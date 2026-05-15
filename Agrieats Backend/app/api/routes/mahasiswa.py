from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.schemas import user
from app.crud import crud_user
from app.api.dependencies import get_current_user
from app.db import models
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