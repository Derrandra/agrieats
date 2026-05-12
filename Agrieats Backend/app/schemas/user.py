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