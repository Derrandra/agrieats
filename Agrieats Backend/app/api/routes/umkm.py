from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.schemas import user
from app.crud import crud_user
from app.api.dependencies import get_current_user
from app.db import models

router = APIRouter()

@router.post("/register", response_model=user.UmkmResponse, status_code=status.HTTP_201_CREATED)
def register_umkm(umkm: user.UmkmCreate, db: Session = Depends(get_db)):
    db_akun = crud_user.get_akun_by_email(db, email=umkm.email)
    if db_akun:
        raise HTTPException(status_code=400, detail="Email sudah terdaftar")

    return crud_user.create_umkm(db=db, umkm=umkm)

@router.get("/me", response_model=user.UmkmResponse)
def get_profil_toko(current_user: models.Akun = Depends(get_current_user)):
    if current_user.peran != "UMKM":
        raise HTTPException(status_code=403, detail="Akses ditolak. Anda bukan UMKM.")
    
    return current_user