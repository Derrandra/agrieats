from sqlalchemy.orm import Session
from app.db.models import UMKM
from app.core.merchant_helper import is_store_open_auto
from datetime import datetime
from app.db import models
import pytz
from app.core.security import get_password_hash 

def create_new_umkm(db: Session, user_data: dict, jam_operasional_default: str = "08:00 - 16:00"):
    db_umkm = UMKM(
        id_akun=user_data["id_akun"],
        username=user_data["username"],
        email=user_data["email"],
        password=get_password_hash(user_data["password"]), 
        peran="UMKM",
        type="UMKM",
        id_umkm=user_data["id_akun"], 
        id_pengelola=user_data["id_pengelola"], 
        nama_umkm=user_data["nama_umkm"],
        lokasi=user_data["lokasi"],
        jam_operasional=jam_operasional_default,
        status_buka=False
    )
    db.add(db_umkm)
    db.commit()
    db.refresh(db_umkm)
    return db_umkm

def get_merchant_by_id(db: Session, id_umkm: str):
    umkm_store = db.query(UMKM).filter(UMKM.id_umkm == id_umkm).first()
    if umkm_store:
        is_open_by_time = is_store_open_auto(umkm_store.jam_operasional)
        
        umkm_store.status_buka = is_open_by_time
    return umkm_store

def update_merchant_toggle_manual(db: Session, id_umkm: str, paksa_buka: bool):
    umkm_store = db.query(UMKM).filter(UMKM.id_umkm == id_umkm).first()
    if umkm_store:
        umkm_store.status_buka = paksa_buka
        db.commit()
        db.refresh(umkm_store)
    return umkm_store

def update_merchant_schedule_str(db: Session, id_umkm: str, jam_operasional: str):
    merchant = db.query(models.UMKM).filter(models.UMKM.id_umkm == id_umkm).first()
    if not merchant:
        return None

    merchant.jam_operasional = jam_operasional

    try:
        tz = pytz.timezone('Asia/Jakarta')
        waktu_sekarang = datetime.now(tz).time() 

        waktu_buka_str, waktu_tutup_str = jam_operasional.split(" - ")
        
        jam_buka = datetime.strptime(waktu_buka_str.strip(), "%H:%M").time()
        jam_tutup = datetime.strptime(waktu_tutup_str.strip(), "%H:%M").time()

        if jam_buka <= jam_tutup:
            if jam_buka <= waktu_sekarang <= jam_tutup:
                merchant.status_buka = True
            else:
                merchant.status_buka = False
        else:
            if waktu_sekarang >= jam_buka or waktu_sekarang <= jam_tutup:
                merchant.status_buka = True
            else:
                merchant.status_buka = False

    except Exception:
        merchant.status_buka = False

    db.commit()
    db.refresh(merchant)
    return merchant