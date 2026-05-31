from enum import Enum
from pydantic import BaseModel

# 1. Definisikan pilihan kategori yang saklek (Enum)
class CategoryName(str, Enum):
    MAKANAN = "Makanan"
    MINUMAN = "Minuman"
    CEMILAN = "Cemilan"

# 2. Schema buat Request pas bikin kategori per toko
class CategoryCreate(BaseModel):
    nama_kategori: CategoryName

# 3. Schema buat Response yang dibalikin ke Swagger
class CategoryResponse(BaseModel):
    id_kategori: str
    id_umkm: str
    nama_kategori: CategoryName

    class Config:
        from_attributes = True