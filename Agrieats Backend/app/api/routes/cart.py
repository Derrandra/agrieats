from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.db import models
from app.schemas import cart as schema_cart
from app.crud import crud_cart
from app.api.dependencies import get_current_user

router = APIRouter()

@router.post("/", response_model=schema_cart.CartItemResponse, status_code=status.HTTP_201_CREATED)
def add_to_cart(
    payload: schema_cart.CartAddItem, 
    db: Session = Depends(get_db),
    current_user: models.Akun = Depends(get_current_user) 
):
    if current_user.peran != "MAHASISWA":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="Akses ditolak. Hanya mahasiswa yang dapat menggunakan fitur keranjang belanja."
        )
    
    # Ambil id_akun (NIM) asli dari token JWT user yang sedang login
    user_nim = current_user.id_akun 
    
    # Eksekusi insert/update ke database lewat CRUD
    cart_item = crud_cart.add_item_to_cart(db=db, nim=user_nim, item=payload)
    
    # Ambil data menu terkait lewat relasi ORM untuk dapet nama_menu dan harga
    menu = cart_item.menu_terpilih
    subtotal = menu.harga * cart_item.kuantitas
    
    return {
        "id_keranjang": cart_item.id_keranjang,
        "nim": cart_item.nim,
        "id_menu": cart_item.id_menu,
        "nama_menu": menu.nama_menu,
        "harga": menu.harga,
        "kuantitas": cart_item.kuantitas,
        "subtotal": subtotal
    }

@router.get("/", response_model=List[schema_cart.CartItemResponse])
def get_cart(
    db: Session = Depends(get_db),
    current_user: models.Akun = Depends(get_current_user) # 🌟 Pasang Satpam JWT
):
    if current_user.peran != "MAHASISWA":
        raise HTTPException(status_code=403, detail="Akses ditolak.")
        
    return crud_cart.get_user_cart(db=db, nim=current_user.id_akun)

@router.put("/{id_keranjang}", response_model=schema_cart.CartItemResponse)
def update_quantity(
    id_keranjang: int, 
    payload: schema_cart.CartUpdateItem, 
    db: Session = Depends(get_db),
    current_user: models.Akun = Depends(get_current_user) # 🌟 Pasang Satpam JWT
):
    if current_user.peran != "MAHASISWA":
        raise HTTPException(status_code=403, detail="Akses ditolak.")
        
    user_nim = current_user.id_akun
    updated = crud_cart.update_cart_quantity(db=db, id_keranjang=id_keranjang, nim=user_nim, kuantitas=payload.kuantitas)
    if not updated:
        raise HTTPException(status_code=404, detail="Item keranjang tidak ditemukan")
    
    all_cart = crud_cart.get_user_cart(db=db, nim=user_nim)
    for item in all_cart:
        if item["id_keranjang"] == id_keranjang:
            return item
    raise HTTPException(status_code=404, detail="Gagal merefresh data")

@router.delete("/{id_keranjang}", status_code=status.HTTP_204_NO_CONTENT)
def delete_item(
    id_keranjang: int, 
    db: Session = Depends(get_db),
    current_user: models.Akun = Depends(get_current_user) # 🌟 Pasang Satpam JWT
):
    if current_user.peran != "MAHASISWA":
        raise HTTPException(status_code=403, detail="Akses ditolak.")
        
    success = crud_cart.remove_cart_item(db=db, id_keranjang=id_keranjang, nim=current_user.id_akun)
    if not success:
        raise HTTPException(status_code=404, detail="Item tidak ditemukan")
    return None