from sqlalchemy.orm import Session
from app.db import models
from app.schemas import cart as schema_cart

# 1. Tambah item ke keranjang (Pake logika check existing)
def add_item_to_cart(db: Session, nim: str, item: schema_cart.CartAddItem):
    # Cek dulu, apakah menu ini udah ada di keranjang mahasiswa tersebut?
    existing_item = db.query(models.KeranjangBelanja).filter(
        models.KeranjangBelanja.nim == nim,
        models.KeranjangBelanja.id_menu == item.id_menu
    ).first()

    if existing_item:
        # Kalau udah ada, tinggal tambahkan kuantitasnya
        existing_item.kuantitas += item.kuantitas
        db.commit()
        db.refresh(existing_item)
        return existing_item
    
    # Kalau belum ada, baru bikin baris baru di tabel
    db_cart = models.KeranjangBelanja(
        nim=nim,
        id_menu=item.id_menu,
        kuantitas=item.kuantitas
    )
    db.add(db_cart)
    db.commit()
    db.refresh(db_cart)
    return db_cart

# 2. Ambil isi keranjang belanja milik mahasiswa tertentu
def get_user_cart(db: Session, nim: str):
    # Kita join ke tabel Menu biar bisa dapet data nama_menu dan harga buat hitung subtotal
    cart_items = db.query(models.KeranjangBelanja).filter(models.KeranjangBelanja.nim == nim).all()
    
    result = []
    for item in cart_items:
        # Tarik data menu terkait lewat relasi ORM yang udah kita set tadi
        menu = item.menu_terpilih
        subtotal = menu.harga * item.kuantitas
        
        result.append({
            "id_creanjang": item.id_keranjang,  # disesuaikan nama field response
            "id_keranjang": item.id_keranjang,
            "nim": item.nim,
            "id_menu": item.id_menu,
            "nama_menu": menu.nama_menu,
            "harga": menu.harga,
            "kuantitas": item.kuantitas,
            "subtotal": subtotal
        })
    return result

# 3. Ubah kuantitas secara manual (misal user ketik angka atau klik tombol + - di frontend)
def update_cart_quantity(db: Session, id_keranjang: int, nim: str, kuantitas: int):
    db_item = db.query(models.KeranjangBelanja).filter(
        models.KeranjangBelanja.id_keranjang == id_keranjang,
        models.KeranjangBelanja.nim == nim
    ).first()
    
    if db_item:
        db_item.kuantitas = kuantitas
        db.commit()
        db.refresh(db_item)
    return db_item

# 4. Hapus satu item dari keranjang (misal klik ikon tempat sampah)
def remove_cart_item(db: Session, id_keranjang: int, nim: str):
    db_item = db.query(models.KeranjangBelanja).filter(
        models.KeranjangBelanja.id_keranjang == id_keranjang,
        models.KeranjangBelanja.nim == nim
    ).first()
    
    if db_item:
        db.delete(db_item)
        db.commit()
        return True
    return False