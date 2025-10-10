from fastapi import APIRouter, UploadFile, File as FastAPIFile
from PIL import Image
import io
import base64

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

@router.post("/")
async def upload_image(file: UploadFile = FastAPIFile(...)):
    # Read file data
    file_data = await file.read()
    
    # Process image
    processed_data, width, height = process_image(file_data)
    
    # Convert to base64
    base64_data = base64.b64encode(processed_data).decode('utf-8')
    base64_url = f"data:image/jpeg;base64,{base64_data}"
    
    return {
        "success": True,
        "data": {
            "url": base64_url,
            "filename": file.filename,
            "size": len(processed_data),
            "width": width,
            "height": height,
            "format": "jpeg"
        }
    }
