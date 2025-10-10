from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
import uuid
import json

from app.models.database import get_db, Project

router = APIRouter()

class ProjectCreate(BaseModel):
    title: str
    description: Optional[str] = None
    userId: Optional[str] = None
    metadata: Optional[dict] = None

class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    metadata: Optional[dict] = None

class ProjectResponse(BaseModel):
    id: str
    title: str
    description: Optional[str]
    status: str
    metadata: Optional[dict]
    userId: Optional[str]
    createdAt: str
    updatedAt: str
    
    class Config:
        from_attributes = True

@router.post("/", response_model=dict)
async def create_project(project: ProjectCreate, db: Session = Depends(get_db)):
    db_project = Project(
        id=str(uuid.uuid4()),
        title=project.title,
        description=project.description,
        user_id=project.userId,
        metadata=json.dumps(project.metadata) if project.metadata else None
    )
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    
    return {
        "success": True,
        "data": {
            "id": db_project.id,
            "title": db_project.title,
            "description": db_project.description,
            "status": db_project.status,
            "metadata": json.loads(db_project.metadata) if db_project.metadata else None,
            "userId": db_project.user_id,
            "createdAt": db_project.created_at.isoformat(),
            "updatedAt": db_project.updated_at.isoformat(),
            "files": []
        }
    }

@router.get("/")
async def get_projects(
    status: Optional[str] = None,
    userId: Optional[str] = None,
    page: int = 1,
    limit: int = 10,
    db: Session = Depends(get_db)
):
    query = db.query(Project)
    
    if status:
        query = query.filter(Project.status == status)
    if userId:
        query = query.filter(Project.user_id == userId)
    
    total = query.count()
    projects = query.offset((page - 1) * limit).limit(limit).all()
    
    return {
        "success": True,
        "data": [
            {
                "id": p.id,
                "title": p.title,
                "description": p.description,
                "status": p.status,
                "metadata": json.loads(p.metadata) if p.metadata else None,
                "userId": p.user_id,
                "createdAt": p.created_at.isoformat(),
                "updatedAt": p.updated_at.isoformat(),
                "files": []
            }
            for p in projects
        ],
        "pagination": {
            "page": page,
            "limit": limit,
            "total": total,
            "totalPages": (total + limit - 1) // limit
        }
    }

@router.get("/{project_id}")
async def get_project(project_id: str, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    return {
        "success": True,
        "data": {
            "id": project.id,
            "title": project.title,
            "description": project.description,
            "status": project.status,
            "metadata": json.loads(project.metadata) if project.metadata else None,
            "userId": project.user_id,
            "createdAt": project.created_at.isoformat(),
            "updatedAt": project.updated_at.isoformat(),
            "files": []
        }
    }

@router.put("/{project_id}")
async def update_project(
    project_id: str,
    project_update: ProjectUpdate,
    db: Session = Depends(get_db)
):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    if project_update.title:
        project.title = project_update.title
    if project_update.description is not None:
        project.description = project_update.description
    if project_update.status:
        project.status = project_update.status
    if project_update.metadata:
        project.metadata = json.dumps(project_update.metadata)
    
    db.commit()
    db.refresh(project)
    
    return {
        "success": True,
        "data": {
            "id": project.id,
            "title": project.title,
            "description": project.description,
            "status": project.status,
            "metadata": json.loads(project.metadata) if project.metadata else None,
            "userId": project.user_id,
            "createdAt": project.created_at.isoformat(),
            "updatedAt": project.updated_at.isoformat(),
            "files": []
        }
    }

@router.delete("/{project_id}")
async def delete_project(project_id: str, hard: bool = False, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    if hard:
        db.delete(project)
    else:
        project.status = "deleted"
    
    db.commit()
    
    return {
        "success": True,
        "message": "Project deleted successfully"
    }
