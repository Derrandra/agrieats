from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
import os
import uuid
import shutil
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

@router.put("/{id_ulasan}/upload-foto")
def unggah_foto_ulasan(
    id_ulasan: str,
    foto: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: models.Akun = Depends(get_current_user)
):
    if current_user.peran != "MAHASISWA":
        raise HTTPException(status_code=403, detail="Akses ditolak.")
        
    db_ulasan = db.query(models.Ulasan).filter(models.Ulasan.id_ulasan == id_ulasan).first()
    if not db_ulasan:
        raise HTTPException(status_code=404, detail="Ulasan tidak ditemukan")

    # Buat folder jika belum ada
    os.makedirs("app/static/images/reviews", exist_ok=True)
    
    ekstensi = foto.filename.split(".")[-1]
    nama_file = f"rev_{uuid.uuid4()}.{ekstensi}"
    lokasi_simpan = f"app/static/images/reviews/{nama_file}"

    with open(lokasi_simpan, "wb") as buffer:
        shutil.copyfileobj(foto.file, buffer)
        
    foto_url = f"/static/images/reviews/{nama_file}"
    
    db_ulasan.foto_ulasan = foto_url 
    db.commit()
    db.refresh(db_ulasan)
    
    return db_ulasan