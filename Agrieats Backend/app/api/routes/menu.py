from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db import models
from app.schemas import menu as menu_schema
from app.crud.crud_menu import menu_repository
from app.api.dependencies import get_current_user
from typing import List, Optional
from sqlalchemy.exc import IntegrityError
import shutil
import uuid
import os

router = APIRouter()

@router.post("/", response_model=menu_schema.MenuResponse, status_code=status.HTTP_201_CREATED)
def tambah_menu(
    nama_menu: str = Form(...),
    harga: int = Form(...),
    id_kategori: Optional[str] = Form(None),
    ketersediaan: bool = Form(True),
    tag_makanan: Optional[str] = Form(None),
    foto: UploadFile = File(None),
    db: Session = Depends(get_db),
    current_user: models.Akun = Depends(get_current_user)
):
    if current_user.peran != "UMKM":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="Akses ditolak. Hanya UMKM yang dapat menambah menu."
        )

    foto_url = None
    if foto and foto.filename:
        # Buat folder otomatis jika belum ada
        os.makedirs("app/static/images", exist_ok=True)
        
        # Ambil ekstensi dan buat nama acak
        ekstensi = foto.filename.split(".")[-1]
        nama_file = f"{uuid.uuid4()}.{ekstensi}"
        lokasi_simpan = f"app/static/images/{nama_file}"

        # Simpan file gambar
        with open(lokasi_simpan, "wb") as buffer:
            shutil.copyfileobj(foto.file, buffer)
            
        foto_url = f"/static/images/{nama_file}"

    # Ubah data Form menjadi format schema Pydantic
    menu_data = menu_schema.MenuCreate(
        nama_menu=nama_menu,
        harga=harga,
        id_kategori=id_kategori,
        ketersediaan=ketersediaan,
        tag_makanan=tag_makanan,
        foto_menu=foto_url
    )
    
    return menu_repository.create(db=db, menu=menu_data, id_umkm=current_user.id_akun)

@router.get("/saya", response_model=List[menu_schema.MenuResponse])
def lihat_menu_saya(
    db: Session = Depends(get_db),
    current_user: models.Akun = Depends(get_current_user)
):
    if current_user.peran != "UMKM":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="Akses ditolak. Hanya UMKM yang dapat melihat manajemen menu."
        )
    
    daftar_menu = menu_repository.get_all_by_umkm(db=db, id_umkm=current_user.id_akun)
    return daftar_menu

@router.get("/search", response_model=List[menu_schema.MenuResponse])
def cari_menu(
    keyword: str,
    db: Session = Depends(get_db),
    current_user: models.Akun = Depends(get_current_user)
):
    daftar_menu = menu_repository.search_menu(db=db, keyword=keyword)
    return daftar_menu

@router.get("/toko/{id_umkm}", response_model=List[menu_schema.MenuResponse])
def lihat_etalase_toko(
    id_umkm: str,
    db: Session = Depends(get_db),
    current_user: models.Akun = Depends(get_current_user)
):
    daftar_menu = menu_repository.get_menu_by_toko(db=db, id_umkm=id_umkm)
    
    return daftar_menu

@router.get("/{id_menu}", response_model=menu_schema.MenuResponse)
def lihat_detail_menu(
    id_menu: str,
    db: Session = Depends(get_db),
    current_user: models.Akun = Depends(get_current_user)
):
    # Mengambil data satu menu spesifik berdasarkan ID
    db_menu = menu_repository.get_by_id(db, id_menu=id_menu)
    
    if not db_menu:
        raise HTTPException(status_code=404, detail="Menu tidak ditemukan.")
        
    # Memastikan UMKM hanya bisa melihat detail menu miliknya sendiri
    if db_menu.id_umkm != current_user.id_akun:
        raise HTTPException(status_code=403, detail="Anda tidak berhak melihat menu toko lain.")
        
    return db_menu

@router.put("/{id_menu}", response_model=menu_schema.MenuResponse)
def ubah_menu(
    id_menu: str, 
    nama_menu: str = Form(...),
    harga: int = Form(...),
    id_kategori: Optional[str] = Form(None),
    ketersediaan: bool = Form(True),
    tag_makanan: Optional[str] = Form(None),
    foto: UploadFile = File(None),
    db: Session = Depends(get_db),
    current_user: models.Akun = Depends(get_current_user)
):
    if current_user.peran != "UMKM":
        raise HTTPException(status_code=403, detail="Akses ditolak.")

    # 1. Cari menu yang mau diubah
    db_menu = menu_repository.get_by_id(db, id_menu=id_menu)
    if not db_menu:
        raise HTTPException(status_code=404, detail="Menu tidak ditemukan.")
    
    if db_menu.id_umkm != current_user.id_akun:
        raise HTTPException(status_code=403, detail="Anda tidak berhak mengubah menu toko lain.")

    # 2. Pertahankan foto lama sebagai default
    foto_url = db_menu.foto_menu 
    
    # 3. Jika user mengunggah foto baru saat mengedit, proses dan timpa URL-nya
    if foto and foto.filename:
        os.makedirs("app/static/images", exist_ok=True)
        ekstensi = foto.filename.split(".")[-1]
        nama_file = f"{uuid.uuid4()}.{ekstensi}"
        lokasi_simpan = f"app/static/images/{nama_file}"

        with open(lokasi_simpan, "wb") as buffer:
            shutil.copyfileobj(foto.file, buffer)
            
        foto_url = f"/static/images/{nama_file}"

    # 4. Buat objek data baru menggunakan schema Pydantic
    menu_update = menu_schema.MenuUpdate(
        nama_menu=nama_menu,
        harga=harga,
        id_kategori=id_kategori,
        ketersediaan=ketersediaan,
        tag_makanan=tag_makanan,
        foto_menu=foto_url
    )

    return menu_repository.update(db=db, db_menu=db_menu, menu_update=menu_update)

@router.delete("/{id_menu}", status_code=status.HTTP_204_NO_CONTENT)
def hapus_menu(
    id_menu: str, 
    db: Session = Depends(get_db),
    current_user: models.Akun = Depends(get_current_user)
):
    if current_user.peran != "UMKM":
        raise HTTPException(status_code=403, detail="Akses ditolak.")

    db_menu = menu_repository.get_by_id(db, id_menu=id_menu)
    if not db_menu:
        raise HTTPException(status_code=404, detail="Menu tidak ditemukan.")
    
    if db_menu.id_umkm != current_user.id_akun:
        raise HTTPException(status_code=403, detail="Anda tidak berhak menghapus menu toko lain.")

    try:
        menu_repository.delete(db=db, db_menu=db_menu)
    except IntegrityError:
        # Batalkan transaksi database yang gagal
        db.rollback() 
        raise HTTPException(
            status_code=400, 
            detail="Menu ini tidak bisa dihapus karena sudah ada di riwayat pesanan. Silakan ubah statusnya menjadi 'Habis' saja."
        )
    return None