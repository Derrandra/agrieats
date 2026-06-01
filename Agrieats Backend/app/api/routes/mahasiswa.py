from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.schemas import user
from app.crud import crud_user
from app.api.dependencies import get_current_user
from app.db import models
from app.schemas.user import MahasiswaUpdate

router = APIRouter()

@router.post("/register", response_model=user.MahasiswaResponse, status_code=status.HTTP_201_CREATED)
def register_mahasiswa(mahasiswa: user.MahasiswaCreate, db: Session = Depends(get_db)):
    # Cek NIM
    db_mhs_nim = crud_user.get_mahasiswa_by_nim(db, nim=mahasiswa.nim)
    if db_mhs_nim:
        raise HTTPException(status_code=400, detail="NIM sudah terdaftar")
    
    # Cek Email
    db_mhs_email = crud_user.get_mahasiswa_by_email(db, email=mahasiswa.email)
    if db_mhs_email:
        raise HTTPException(status_code=400, detail="Email sudah terdaftar")

    return crud_user.create_mahasiswa(db=db, mahasiswa=mahasiswa)

@router.get("/me", response_model=user.MahasiswaResponse)
def get_profil_saya(current_user: models.Akun = Depends(get_current_user)):
    """
    Endpoint ini HANYA bisa diakses jika mahasiswa mengirimkan Token JWT yang valid.
    """
    return current_user

@router.put("/me")
def update_profil_mahasiswa(
    payload: MahasiswaUpdate, # Gunakan schema yang baru dibuat
    db: Session = Depends(get_db),
    current_user: models.Akun = Depends(get_current_user)
):
    # Pastikan yang akses adalah Mahasiswa
    if current_user.peran != "MAHASISWA":
        raise HTTPException(status_code=403, detail="Hanya mahasiswa yang dapat mengubah profil.")
        
    # Cari data di tabel Mahasiswa berdasarkan ID Akun (NIM)
    mahasiswa = db.query(models.Mahasiswa).filter(models.Mahasiswa.nim == current_user.id_akun).first()
    if not mahasiswa:
        raise HTTPException(status_code=404, detail="Data mahasiswa tidak ditemukan.")
        
    # Proses Update Data
    if payload.username:
        # Update nama di tabel Mahasiswa
        if hasattr(mahasiswa, 'nama_mahasiswa'):
            mahasiswa.nama_mahasiswa = payload.username
        # Update username di tabel Akun jika ada
        if hasattr(current_user, 'username'):
            current_user.username = payload.username
            
    if payload.email and hasattr(mahasiswa, 'email'):
        mahasiswa.email = payload.email
        
    if payload.telepon and hasattr(mahasiswa, 'telepon'):
        mahasiswa.telepon = payload.telepon
        
    db.commit()
    db.refresh(mahasiswa)
    db.refresh(current_user)
    
    return {"message": "Profil berhasil diperbarui"}