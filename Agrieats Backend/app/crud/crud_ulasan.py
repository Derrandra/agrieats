import uuid
from sqlalchemy.orm import Session
from sqlalchemy import func 
from fastapi import HTTPException
from app.db import models
from app.schemas import ulasan as ulasan_schema

class CRUDUlasan:
    def create(self, db: Session, ulasan_data: ulasan_schema.UlasanCreate, nim: str):
        db_po = db.query(models.PreOrder).filter(models.PreOrder.id_po == ulasan_data.id_po).first()
        if not db_po:
            raise HTTPException(status_code=404, detail="Pesanan tidak ditemukan.")
        if db_po.nim != nim:
            raise HTTPException(status_code=403, detail="Anda hanya bisa mengulas pesanan Anda sendiri.")

        # Pastikan PO ini belum pernah diulas (Anti-Spam)
        existing_review = db.query(models.Ulasan).filter(models.Ulasan.id_po == ulasan_data.id_po).first()
        if existing_review:
            raise HTTPException(status_code=400, detail="Anda sudah memberikan ulasan untuk pesanan ini.")

        if not db_po.items:
            raise HTTPException(status_code=400, detail="Data pesanan tidak valid (kosong).")
        id_umkm_target = db_po.items[0].menu_terkait.id_umkm

        new_id_ulasan = f"REV-{uuid.uuid4().hex[:10].upper()}"

        db_ulasan = models.Ulasan(
            id_ulasan=new_id_ulasan,
            nim=nim,
            id_umkm=id_umkm_target,
            id_po=ulasan_data.id_po,
            isi_ulasan=ulasan_data.isi_ulasan,
            rating=ulasan_data.rating
        )
        db.add(db_ulasan)
        db.commit()
        db.refresh(db_ulasan)

        
        # Hitung rata-rata rating baru untuk id_umkm_target dari seluruh ulasan yang ada
        rata_rata_rating = db.query(func.avg(models.Ulasan.rating)).filter(
            models.Ulasan.id_umkm == id_umkm_target
        ).scalar()

        # Update nilai kolom rating di tabel UMKM (gunakan pembulatan atau default jika None)
        rating_baru = round(rata_rata_rating, 1) if rata_rata_rating else 0.0
        
        db.query(models.UMKM).filter(
            models.UMKM.id_umkm == id_umkm_target
        ).update({"rating": rating_baru})
        
        db.commit()

        return db_ulasan

ulasan_repository = CRUDUlasan()