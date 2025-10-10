from fastapi import APIRouter, Depends, HTTPException, UploadFile, File as FastAPIFile, Form
from sqlalchemy.orm import Session
from PIL import Image
import io
import uuid
import json

from app.models.database import get_db, File
from app.services.s3_service import s3_service

router = APIRouter()

def process_image(image_data: bytes, max_width: int = 1920, max_height: int = 1920, quality: int = 85):
    """Process and optimize image"""
    img = Image.open(io.BytesIO(image_data))
    
    # Convert RGBA to RGB if necessary
    if img.mode == 'RGBA':
        img = img.convert('RGB')
    
    # Resize if needed
    if img.width > max_width or img.height > max_height:
        img.thumbnail((max_width, max_height), Image.Resampling.LANCZOS)
    
    # Save optimized image
    output = io.BytesIO()
    img.save(output, format='JPEG', quality=quality, optimize=True)
    output.seek(0)
    
    return output.getvalue(), img.width, img.height

@router.post("/upload")
async def upload_file(
    file: UploadFile = FastAPIFile(...),
    projectId: str = Form(None),
    userId: str = Form(None),
    db: Session = Depends(get_db)
):
    # Read file data
    file_data = await file.read()
    
    # Process image
    processed_data, width, height = process_image(file_data)
    
    # Upload to S3
    result = s3_service.upload_file(processed_data, file.filename, "image/jpeg")
    
    # Save to database
    db_file = File(
        id=str(uuid.uuid4()),
        filename=file.filename,
        original_name=file.filename,
        s3_key=result["key"],
        s3_url=result["url"],
        content_type="image/jpeg",
        size=result["size"],
        width=width,
        height=height,
        metadata=json.dumps({"format": "jpeg"}),
        project_id=projectId,
        user_id=userId
    )
    db.add(db_file)
    db.commit()
    db.refresh(db_file)
    
    return {
        "success": True,
        "data": {
            "id": db_file.id,
            "s3Key": db_file.s3_key,
            "url": db_file.s3_url,
            "filename": db_file.filename,
            "size": db_file.size,
            "width": db_file.width,
            "height": db_file.height,
            "format": "jpeg",
            "bucket": result["bucket"]
        }
    }

@router.get("/{file_id}")
async def get_file(file_id: str, db: Session = Depends(get_db)):
    file = db.query(File).filter(File.id == file_id).first()
    if not file:
        raise HTTPException(status_code=404, detail="File not found")
    
    return {
        "success": True,
        "data": {
            "id": file.id,
            "filename": file.filename,
            "originalName": file.original_name,
            "s3Key": file.s3_key,
            "s3Url": file.s3_url,
            "contentType": file.content_type,
            "size": file.size,
            "width": file.width,
            "height": file.height,
            "metadata": json.loads(file.metadata) if file.metadata else None,
            "projectId": file.project_id,
            "userId": file.user_id,
            "createdAt": file.created_at.isoformat(),
            "updatedAt": file.updated_at.isoformat()
        }
    }

@router.delete("/{file_id}")
async def delete_file(file_id: str, db: Session = Depends(get_db)):
    file = db.query(File).filter(File.id == file_id).first()
    if not file:
        raise HTTPException(status_code=404, detail="File not found")
    
    # Delete from S3
    s3_service.delete_file(file.s3_key)
    
    # Delete from database
    db.delete(file)
    db.commit()
    
    return {
        "success": True,
        "message": "File deleted successfully"
    }
