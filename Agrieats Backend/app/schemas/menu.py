from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class MenuBase(BaseModel):
    nama_menu: str
    harga: int
    ketersediaan: bool = False
    tag_makanan: Optional[str] = None
    foto_menu: Optional[str] = None

class MenuCreate(MenuBase):
    pass
    # id_menu di-generate sistem
    # id_umkm diambil dari token JWT

class MenuResponse(MenuBase):
    id_menu: str
    id_umkm: str
    created_at: datetime

    class Config:
        from_attributes = True

class MenuUpdate(BaseModel):
    nama_menu: Optional[str] = None
    harga: Optional[int] = None
    ketersediaan: Optional[bool] = None
    tag_makanan: Optional[str] = None
    foto_menu: Optional[str] = None