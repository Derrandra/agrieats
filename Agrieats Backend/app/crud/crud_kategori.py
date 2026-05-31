from sqlalchemy.orm import Session
from app.db import models
from app.schemas import kategori as schema_category

# 1. Fungsi buat bikin kategori baru untuk UMKM tertentu
def create_merchant_category(db: Session, id_umkm: str, category: schema_category.CategoryCreate):
    # Cek dulu apakah UMKM dengan kategori tersebut sudah pernah dibikin biar gak ganda
    existing_category = db.query(models.KategoriMenu).filter(
        models.KategoriMenu.id_umkm == id_umkm,
        models.KategoriMenu.nama_kategori == category.nama_kategori
    ).first()
    
    if existing_category:
        return existing_category
        
    db_category = models.KategoriMenu(
        id_umkm=id_umkm,
        nama_kategori=category.nama_kategori
    )
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category

# 2. Fungsi buat mengambil semua kategori milik satu toko (UMKM)
def get_categories_by_merchant(db: Session, id_umkm: str):
    return db.query(models.KategoriMenu).filter(models.KategoriMenu.id_umkm == id_umkm).all()