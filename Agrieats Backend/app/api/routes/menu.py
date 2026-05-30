from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db import models
from app.schemas import menu as menu_schema
from app.crud.crud_menu import menu_repository
from app.api.dependencies import get_current_user
from typing import List
router = APIRouter()

@router.post("/", response_model=menu_schema.MenuResponse, status_code=status.HTTP_201_CREATED)
def tambah_menu(
    menu: menu_schema.MenuCreate,
    db: Session = Depends(get_db),
    current_user: models.Akun = Depends(get_current_user)
):
    if current_user.peran != "UMKM":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="Akses ditolak. Hanya UMKM yang dapat menambah menu."
        )
    return menu_repository.create(db=db, menu=menu, id_umkm=current_user.id_akun)

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

@router.put("/{id_menu}", response_model=menu_schema.MenuResponse)
def ubah_menu(
    id_menu: str, 
    menu_update: menu_schema.MenuUpdate, 
    db: Session = Depends(get_db),
    current_user: models.Akun = Depends(get_current_user)
):
    if current_user.peran != "UMKM":
        raise HTTPException(status_code=403, detail="Akses ditolak.")

    db_menu = menu_repository.get_by_id(db, id_menu=id_menu)
    if not db_menu:
        raise HTTPException(status_code=404, detail="Menu tidak ditemukan.")
    
    if db_menu.id_umkm != current_user.id_akun:
        raise HTTPException(status_code=403, detail="Anda tidak berhak mengubah menu toko lain.")

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

    menu_repository.delete(db=db, db_menu=db_menu)
    return None