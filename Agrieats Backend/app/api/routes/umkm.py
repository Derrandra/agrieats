from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.schemas import user
from app.crud import crud_user
from app.api.dependencies import get_current_user
from app.db import models
from typing import List
from app.crud.crud_po import po_repository

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

@router.get("/", response_model=List[user.UmkmResponse])
def lihat_daftar_umkm(
    db: Session = Depends(get_db),
    current_user: models.Akun = Depends(get_current_user)
):
    daftar_umkm = crud_user.get_all_umkm(db=db, hanya_buka=True)
    return daftar_umkm

@router.get("/statistik", response_model=user.StatistikUMKM)
def lihat_statistik_toko(
    db: Session = Depends(get_db),
    current_user: models.Akun = Depends(get_current_user)
):
    if current_user.peran != "UMKM":
        raise HTTPException(status_code=403, detail="Hanya penjual yang dapat melihat statistik toko.")
    
    statistik = po_repository.get_statistik_umkm(db=db, id_umkm=current_user.id_akun)
    return statistik