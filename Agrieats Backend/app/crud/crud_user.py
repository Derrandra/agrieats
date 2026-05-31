from sqlalchemy.orm import Session
from app.db import models
from app.schemas import user
from app.core.security import get_password_hash
import uuid

def create_mahasiswa(db: Session, mahasiswa: user.MahasiswaCreate):
    # generated_id_akun = str(uuid.uuid4())[:20] 
    hashed_password = get_password_hash(mahasiswa.password)

    db_mahasiswa = models.Mahasiswa(
        id_akun=mahasiswa.nim,
        nim=mahasiswa.nim,
        username=mahasiswa.username,
        email=mahasiswa.email,
        password=hashed_password,
        peran="MAHASISWA",
        prodi=mahasiswa.prodi,
        telepon=mahasiswa.telepon
    )

    db.add(db_mahasiswa)
    db.commit()
    db.refresh(db_mahasiswa)

    return db_mahasiswa

def get_mahasiswa_by_nim(db: Session, nim: str):
    return db.query(models.Mahasiswa).filter(models.Mahasiswa.nim == nim).first()

def get_mahasiswa_by_email(db: Session, email: str):
    return db.query(models.Mahasiswa).filter(models.Mahasiswa.email == email).first()

def get_akun_by_email(db: Session, email: str):
    return db.query(models.Akun).filter(models.Akun.email == email).first()

def create_umkm(db: Session, umkm: user.UmkmCreate):
    hashed_password = get_password_hash(umkm.password)
    new_id = str(uuid.uuid4())[:20] 

    db_umkm = models.UMKM(
        id_akun=new_id,
        id_umkm=new_id,
        username=umkm.username,
        email=umkm.email,
        password=hashed_password,
        peran="UMKM",
        
        # Field spesifik subclass UMKM
        id_pengelola=umkm.id_pengelola,
        nama_umkm=umkm.nama_umkm,
        lokasi=umkm.lokasi,
        jam_operasional=umkm.jam_operasional,
        deskripsi=umkm.deskripsi
    )

    db.add(db_umkm)
    db.commit()
    db.refresh(db_umkm)

    return db_umkm

def get_all_umkm(db: Session, hanya_buka: bool = True):
    query = db.query(models.UMKM)
    
    # Filter agar hanya menampilkan UMKM yang status_buka = True
    if hanya_buka:
        query = query.filter(models.UMKM.status_buka == True)
        
    return query.all()

def create_pengelola(db: Session, pengelola: user.PengelolaCreate):
    # Hash password terlebih dahulu
    hashed_password = get_password_hash(pengelola.password)
    
    # Buat ID unik (disamakan dengan format ID di database yaitu [:20])
    new_id = str(uuid.uuid4())[:20]

    # Panggil model PengelolaKantin
    db_pengelola = models.PengelolaKantin(
        id_akun=new_id,
        id_pengelola=new_id, 
        username=pengelola.username,
        email=pengelola.email,
        password=hashed_password,
        peran="PENGELOLA",
        
        # Field spesifik subclass PengelolaKantin
        nama_u_kantin=pengelola.nama_u_kantin,
        nama_pj_usaha=pengelola.nama_pj_usaha,
        kontak_pengelola=pengelola.kontak_pengelola
    )

    db.add(db_pengelola)
    db.commit()
    db.refresh(db_pengelola)
    
    return db_pengelola