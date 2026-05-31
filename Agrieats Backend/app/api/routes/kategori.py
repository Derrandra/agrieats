from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.db import models
from app.schemas import kategori as schema_category
from app.crud import crud_kategori
from app.api.dependencies import get_current_user 

router = APIRouter()

# Membuat Kategori Baru (Hanya UMKM Pemilik Toko)
@router.post("/{id_umkm}/categories", response_model=schema_category.CategoryResponse, status_code=status.HTTP_201_CREATED)
def add_category(
    id_umkm: str, 
    payload: schema_category.CategoryCreate, 
    db: Session = Depends(get_db),
    current_user: models.Akun = Depends(get_current_user) 
):
    if current_user.peran != "UMKM":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="Akses ditolak. Fitur ini khusus untuk mitra UMKM."
        )
    
    # UMKM yang login harus SAMA dengan id_umkm di URL 
    if current_user.id_akun != id_umkm:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="Akses ditolak. Anda tidak berhak mengubah kategori toko lain."
        )
        
    category = crud_kategori.create_merchant_category(db=db, id_umkm=id_umkm, category=payload)
    if not category:
        raise HTTPException(status_code=400, detail="Gagal membuat kategori")
    return category

# Mengambil Semua Kategori yang Dimiliki Toko Tersebut (Boleh diakses Publik/Mahasiswa buat liat menu)
@router.get("/{id_umkm}/categories", response_model=List[schema_category.CategoryResponse])
def list_categories(id_umkm: str, db: Session = Depends(get_db)):
    return crud_kategori.get_categories_by_merchant(db=db, id_umkm=id_umkm)