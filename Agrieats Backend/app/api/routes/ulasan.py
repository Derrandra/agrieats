from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db import models
from app.schemas import ulasan as ulasan_schema
from app.crud.crud_ulasan import ulasan_repository
from app.api.dependencies import get_current_user

router = APIRouter()

@router.post("/", response_model=ulasan_schema.UlasanResponse, status_code=status.HTTP_201_CREATED)
def buat_ulasan(
    ulasan_data: ulasan_schema.UlasanCreate,
    db: Session = Depends(get_db),
    current_user: models.Akun = Depends(get_current_user)
):
    if current_user.peran != "MAHASISWA":
        raise HTTPException(status_code=403, detail="Hanya mahasiswa yang dapat memberikan ulasan.")
    
    return ulasan_repository.create(db=db, ulasan_data=ulasan_data, nim=current_user.id_akun)