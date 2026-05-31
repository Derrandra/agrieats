from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.schemas import kategori as schema_category
from app.crud import crud_kategori

router = APIRouter()

# Endpoint 1: Membuat Kategori Baru Per Toko
@router.post("/{id_umkm}/categories", response_model=schema_category.CategoryResponse, status_code=status.HTTP_201_CREATED)
def add_category(id_umkm: str, payload: schema_category.CategoryCreate, db: Session = Depends(get_db)):
    category = crud_kategori.create_merchant_category(db=db, id_umkm=id_umkm, category=payload)
    if not category:
        raise HTTPException(status_code=400, detail="Gagal membuat kategori")
    return category

# Endpoint 2: Mengambil Semua Kategori yang Dimiliki Toko Tersebut
@router.get("/{id_umkm}/categories", response_model=List[schema_category.CategoryResponse])
def list_categories(id_umkm: str, db: Session = Depends(get_db)):
    return crud_kategori.get_categories_by_merchant(db=db, id_umkm=id_umkm)