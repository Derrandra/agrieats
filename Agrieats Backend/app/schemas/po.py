from pydantic import BaseModel
from typing import List
from datetime import datetime

# item tunggal di keranjang
class ItemPOCreate(BaseModel):
    id_menu: str
    kuantitas: int

# keseluruhan request PO dari frontend
class POCreate(BaseModel):
    waktu_pengambilan: datetime
    items: List[ItemPOCreate]

class ItemPOResponse(BaseModel):
    id_detail: int
    id_menu: str
    kuantitas: int
    harga_satuan: int

    class Config:
        from_attributes = True

class POResponse(BaseModel):
    id_po: str
    nim: str
    waktu_pengambilan: datetime
    status: str
    total_harga: int
    items: List[ItemPOResponse]

    class Config:
        from_attributes = True

class POStatusUpdate(BaseModel):
    status: str