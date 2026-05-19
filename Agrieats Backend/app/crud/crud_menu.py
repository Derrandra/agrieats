import uuid
from sqlalchemy.orm import Session
from app.db import models
from app.schemas import menu as menu_schema

class CRUDMenu:
    def create(self, db: Session, menu: menu_schema.MenuCreate, id_umkm: str):
        random_str = uuid.uuid4().hex[:6].upper()
        new_id_menu = f"MNU-{random_str}"
        
        db_menu = models.Menu(
            id_menu=new_id_menu,
            id_umkm=id_umkm,  # Didapat dari JWT
            nama_menu=menu.nama_menu,
            harga=menu.harga,
            ketersediaan=menu.ketersediaan,
            tag_makanan=menu.tag_makanan,
            foto_menu=menu.foto_menu
        )
        
        db.add(db_menu)
        db.commit()
        db.refresh(db_menu)
        return db_menu

menu_repository = CRUDMenu()