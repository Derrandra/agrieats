from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class UlasanCreate(BaseModel):
    id_po: str
    isi_ulasan: Optional[str] = None
    rating: int = Field(..., ge=1, le=5, description="Rating dari 1 sampai 5")

class UlasanResponse(BaseModel):
    id_ulasan: str
    nim: str
    id_umkm: str
    id_po: str
    isi_ulasan: Optional[str]
    rating: int
    tanggal_ulasan: datetime

    class Config:
        from_attributes = True