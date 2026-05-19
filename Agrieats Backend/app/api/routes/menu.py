from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db import models
from app.schemas import menu as menu_schema
from app.crud.crud_menu import menu_repository
from app.api.dependencies import get_current_user

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