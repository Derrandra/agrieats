from pydantic import BaseModel, Field

# 1. Schema buat request pas mahasiswa klik "Tambah ke Keranjang"
class CartAddItem(BaseModel):
    id_menu: str = Field(..., example="MENU01")
    kuantitas: int = Field(1, ge=1, description="Jumlah item yang dibeli, minimal 1")

# 2. Schema buat request pas mahasiswa mau update jumlah 
class CartUpdateItem(BaseModel):
    kuantitas: int = Field(..., ge=1)

# 3. Schema buat response isi keranjang belanja
class CartItemResponse(BaseModel):
    id_keranjang: int
    nim: str
    id_menu: str
    nama_menu: str
    harga: int
    kuantitas: int
    subtotal: int

    class Config:
        from_attributes = True