from pydantic import BaseModel, EmailStr, Field
from datetime import datetime

# BASE SCHEMA
class MahasiswaBase(BaseModel):
    username: str
    email: EmailStr
    prodi: str
    telepon: str

# SCHEMA UNTUK INPUT (post)
class MahasiswaCreate(MahasiswaBase):
    nim: str
    password: str = Field(..., min_length=8, max_length=72, description="Password minimal 6 karakter dan maksimal 72 karakter")

# SCHEMA UNTUK OUTPUT (response)
class MahasiswaResponse(MahasiswaBase):
    id_akun: str
    nim: str
    peran: str
    created_at: datetime
    class Config:
        from_attributes = True

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str

# UMKM
class UmkmBase(BaseModel):
    username: str
    email: EmailStr
    nama_umkm: str
    lokasi: str
    jam_operasional: str
    deskripsi: str | None = None
    id_pengelola: str 

class UmkmCreate(UmkmBase):
    password: str = Field(..., min_length=6, max_length=72)

class UmkmResponse(UmkmBase):
    id_umkm: str
    peran: str
    rating: float
    status_buka: bool

    class Config:
        from_attributes = True

class StatistikUMKM(BaseModel):
    total_pesanan_selesai: int
    total_pendapatan: float

    class Config:
        from_attributes = True
