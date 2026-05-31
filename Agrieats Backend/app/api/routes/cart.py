from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.schemas import cart as schema_cart
from app.crud import crud_cart
from app.api.dependencies import get_current_user

router = APIRouter()

@router.post("/", response_model=schema_cart.CartItemResponse, status_code=status.HTTP_201_CREATED)
def add_to_cart(payload: schema_cart.CartAddItem, db: Session = Depends(get_db)):
    dummy_nim = "MHS001" 
    
    # 1. Eksekusi insert/update ke database lewat CRUD
    cart_item = crud_cart.add_item_to_cart(db=db, nim=dummy_nim, item=payload)
    
    # 2. Ambil data menu terkait lewat relasi ORM untuk dapet nama_menu dan harga
    menu = cart_item.menu_terpilih
    subtotal = menu.harga * cart_item.kuantitas
    
    # 3. Kembalikan data dalam bentuk dictionary yang sesuai dengan pesanan Pydantic Schema
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
def get_cart(db: Session = Depends(get_db)):
    dummy_nim = "MHS001"
    return crud_cart.get_user_cart(db=db, nim=dummy_nim)

@router.put("/{id_keranjang}", response_model=schema_cart.CartItemResponse)
def update_quantity(id_keranjang: int, payload: schema_cart.CartUpdateItem, db: Session = Depends(get_db)):
    dummy_nim = "MHS001"
    updated = crud_cart.update_cart_quantity(db=db, id_keranjang=id_keranjang, nim=dummy_nim, kuantitas=payload.kuantitas)
    if not updated:
        raise HTTPException(status_code=404, detail="Item keranjang tidak ditemukan")
    
    # Bungkus ulang format returnnya agar ada field subtotal, nama_menu, dll
    all_cart = crud_cart.get_user_cart(db=db, nim=dummy_nim)
    for item in all_cart:
        if item["id_keranjang"] == id_keranjang:
            return item
    raise HTTPException(status_code=404, detail="Gagal merefresh data")

@router.delete("/{id_keranjang}", status_code=status.HTTP_204_NO_CONTENT)
def delete_item(id_keranjang: int, db: Session = Depends(get_db)):
    dummy_nim = "MHS001"
    success = crud_cart.remove_cart_item(db=db, id_keranjang=id_keranjang, nim=dummy_nim)
    if not success:
        raise HTTPException(status_code=404, detail="Item tidak ditemukan")
    return None