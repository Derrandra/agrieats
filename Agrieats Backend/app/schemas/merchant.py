from pydantic import BaseModel
from datetime import time
from typing import Optional

class MerchantScheduleUpdate(BaseModel):
    jam_operasional: str # Menerima string format "HH:MM - HH:MM"

class MerchantToggleUpdate(BaseModel):
    status_buka: bool # Langsung nembak True / False manual

class MerchantResponse(BaseModel):
    id_umkm: str
    nama_umkm: str
    jam_operasional: str
    status_buka: bool

    class Config:
        from_attributes = True