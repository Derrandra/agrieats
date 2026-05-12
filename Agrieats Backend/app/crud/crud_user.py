from sqlalchemy.orm import Session
from app.db import models
from app.schemas import user
from app.core.security import get_password_hash
# import uuid

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