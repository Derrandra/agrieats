from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db import models
from app.schemas import po as po_schema
from app.crud.crud_po import po_repository
from app.api.dependencies import get_current_user
from typing import List

router = APIRouter()

@router.post("/", response_model=po_schema.POResponse, status_code=status.HTTP_201_CREATED)
def buat_pesanan(
    po_data: po_schema.POCreate,
    db: Session = Depends(get_db),
    current_user: models.Akun = Depends(get_current_user)
):

    if current_user.peran != "MAHASISWA":
        raise HTTPException(status_code=403, detail="Hanya mahasiswa yang dapat membuat Pre-Order.")
    
    return po_repository.create_po(db=db, po_data=po_data, nim=current_user.id_akun)

@router.get("/umkm", response_model=List[po_schema.POResponse])
def pesanan_masuk_umkm(
    db: Session = Depends(get_db),
    current_user: models.Akun = Depends(get_current_user)
):
    if current_user.peran != "UMKM":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="Akses ditolak. Hanya penjual yang dapat melihat daftar pesanan masuk."
        )
    
    daftar_pesanan = po_repository.get_po_by_umkm(db=db, id_umkm=current_user.id_akun)
    return daftar_pesanan

@router.get("/saya", response_model=List[po_schema.POResponse])
def riwayat_pesanan_mahasiswa(
    db: Session = Depends(get_db),
    current_user: models.Akun = Depends(get_current_user)
):
    if current_user.peran != "MAHASISWA":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="Akses ditolak. Anda bukan mahasiswa."
        )
    
    riwayat = po_repository.get_po_by_mahasiswa(db=db, nim=current_user.id_akun)
    return riwayat

@router.get("/riwayat", response_model=List[po_schema.POResponse])
def lihat_riwayat_pesanan(
    db: Session = Depends(get_db),
    current_user: models.Akun = Depends(get_current_user)
):
    if current_user.peran != "MAHASISWA":
        raise HTTPException(status_code=403, detail="Akses ditolak. Fitur ini khusus mahasiswa.")
    
    riwayat = po_repository.get_riwayat_mahasiswa(db=db, nim=current_user.id_akun)
    return riwayat

@router.put("/{id_po}/status", response_model=po_schema.POResponse)
def ubah_status_pesanan(
    id_po: str,
    status_update: po_schema.POStatusUpdate,
    db: Session = Depends(get_db),
    current_user: models.Akun = Depends(get_current_user)
):
    if current_user.peran != "UMKM":
        raise HTTPException(status_code=403, detail="Akses ditolak.")
    
    db_po = po_repository.get_po_by_id(db, id_po=id_po)
    if not db_po:
        raise HTTPException(status_code=404, detail="Pesanan tidak ditemukan.")
    
    is_owner = any(item.menu_terkait.id_umkm == current_user.id_akun for item in db_po.items)
    if not is_owner:
        raise HTTPException(status_code=403, detail="Anda tidak berhak mengubah status pesanan toko lain.")
    
    return po_repository.update_status(db=db, db_po=db_po, new_status=status_update.status)

# ENDPOINT CANCEL UNTUK MAHASISWA
@router.put("/{id_po}/cancel", response_model=po_schema.POResponse)
def mahasiswa_cancel_pesanan(
    id_po: str,
    db: Session = Depends(get_db),
    current_user: models.Akun = Depends(get_current_user)
):
    
    if current_user.peran != "MAHASISWA":
        raise HTTPException(status_code=403, detail="Akses ditolak. Fitur ini khusus mahasiswa.")
            
    return po_repository.cancel_po_by_mahasiswa(db=db, id_po=id_po, nim=current_user.id_akun)


# ENDPOINT KONFIRMASI (TERIMA/TOLAK) UNTUK UMKM
@router.put("/{id_po}/konfirmasi", response_model=po_schema.POResponse)
def umkm_konfirmasi_pesanan(
    id_po: str,
    tindakan: str,  # Isikan query param di Swagger: TERIMA atau TOLAK
    db: Session = Depends(get_db),
    current_user: models.Akun = Depends(get_current_user)
):
    if current_user.peran != "UMKM":
        raise HTTPException(status_code=403, detail="Akses ditolak. Hanya penjual yang dapat memproses pesanan.")
        
    return po_repository.konfirmasi_po_by_umkm(
        db=db, 
        id_po=id_po, 
        id_umkm=current_user.id_akun, 
        tindakan=tindakan
    )