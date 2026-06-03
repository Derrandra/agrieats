from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.schemas import user as schemas
from app.crud import crud_user
from app.api.dependencies import get_current_user
from app.db import models
from sqlalchemy import func
from sqlalchemy.orm import aliased
from app.schemas.user import PengelolaUpdate 
from sqlalchemy import func, Date, text

def created_at_wib(model):
    return func.cast(
        model.created_at + text("INTERVAL '7 hours'"), 
        Date
    )

router = APIRouter()

@router.post("/register", response_model=schemas.PengelolaResponse, status_code=status.HTTP_201_CREATED)
def register_pengelola(pengelola: schemas.PengelolaCreate, db: Session = Depends(get_db)):
    # Cek apakah email sudah terdaftar
    db_akun = crud_user.get_akun_by_email(db, email=pengelola.email)
    if db_akun:
        raise HTTPException(status_code=400, detail="Email sudah terdaftar")

    return crud_user.create_pengelola(db=db, pengelola=pengelola)

@router.get("/me", response_model=schemas.PengelolaResponse)
def get_profil_pengelola(current_user: models.Akun = Depends(get_current_user)):
    if current_user.peran != "PENGELOLA":
        raise HTTPException(status_code=403, detail="Akses ditolak. Anda bukan Pengelola Kantin.")
    
    return current_user

@router.get("/umkm")
def get_umkm_binaan(db: Session = Depends(get_db), current_user: models.Akun = Depends(get_current_user)):
    if current_user.peran != "PENGELOLA":
        raise HTTPException(status_code=403, detail="Akses ditolak. Anda bukan Pengelola Kantin.")
    
    # Ambil semua UMKM yang id_pengelola-nya sama dengan id_akun pengelola yang sedang login
    daftar_umkm = db.query(models.UMKM).filter(models.UMKM.id_pengelola == current_user.id_akun).all()
    return daftar_umkm

@router.get("/statistik")
def get_statistik_kantin(
    view: str = "daily", 
    start: str = None, 
    end: str = None, 
    db: Session = Depends(get_db), 
    current_user: models.Akun = Depends(get_current_user)
):
    if current_user.peran != "PENGELOLA":
        raise HTTPException(status_code=403, detail="Akses ditolak.")

    umkm_binaan = db.query(models.UMKM.id_akun).filter(models.UMKM.id_pengelola == current_user.id_akun).all()
    umkm_ids = [u[0] for u in umkm_binaan]

    if not umkm_ids:
        return {
            "summary": {"revenue": 0, "totalSales": 0, "topKantin": "Belum ada UMKM"},
            "chart": []
        }

    base_query = db.query(models.PreOrder).join(
        models.DetailPO, models.PreOrder.id_po == models.DetailPO.id_po
    ).join(
        models.Menu, models.DetailPO.id_menu == models.Menu.id_menu
    ).filter(
        models.Menu.id_umkm.in_(umkm_ids),
        models.PreOrder.status == 'Selesai'
    )

    if start and end:
        base_query = base_query.filter(
            func.date(models.PreOrder.created_at) >= start,
            func.date(models.PreOrder.created_at) <= end
        )

    # DISTINCT diperlukan karena 1 PreOrder bisa punya banyak DetailPO
    total_sales = base_query.distinct(models.PreOrder.id_po).count()

    # Menggunakan DetailPO (harga * qty) karena 1 PO bisa berisi gabungan dari beberapa UMKM (jika dibolehkan checkout multi-toko)
    revenue_query = db.query(func.sum(models.DetailPO.harga_satuan * models.DetailPO.kuantitas)).join(
        models.PreOrder, models.DetailPO.id_po == models.PreOrder.id_po
    ).join(
        models.Menu, models.DetailPO.id_menu == models.Menu.id_menu
    ).filter(
        models.Menu.id_umkm.in_(umkm_ids),
        models.PreOrder.status == 'Selesai'
    )
    
    if start and end:
        revenue_query = revenue_query.filter(func.date(models.PreOrder.created_at) >= start, func.date(models.PreOrder.created_at) <= end)
    
    revenue_val = revenue_query.scalar() or 0

    top_kantin_query = db.query(
        models.Menu.id_umkm,
        func.sum(models.DetailPO.harga_satuan * models.DetailPO.kuantitas).label('total_pendapatan')
    ).join(
        models.PreOrder, models.DetailPO.id_po == models.PreOrder.id_po
    ).join(
        models.Menu, models.DetailPO.id_menu == models.Menu.id_menu
    ).filter(
        models.Menu.id_umkm.in_(umkm_ids),
        models.PreOrder.status == 'Selesai'
    )

    if start and end:
        top_kantin_query = top_kantin_query.filter(func.date(models.PreOrder.created_at) >= start, func.date(models.PreOrder.created_at) <= end)
        
    top_kantin_query = top_kantin_query.group_by(models.Menu.id_umkm).order_by(func.sum(models.DetailPO.harga_satuan * models.DetailPO.kuantitas).desc()).first()

    top_kantin_name = "-"
    if top_kantin_query:
        umkm_data = db.query(models.UMKM).filter(models.UMKM.id_akun == top_kantin_query.id_umkm).first()
        if umkm_data:
            top_kantin_name = umkm_data.nama_umkm

    chart_data = []
    
    daily_sales = db.query(
        func.date(models.PreOrder.created_at).label('tanggal'),
        func.sum(models.DetailPO.harga_satuan * models.DetailPO.kuantitas).label('total')
    ).join(
        models.PreOrder, models.DetailPO.id_po == models.PreOrder.id_po
    ).join(
        models.Menu, models.DetailPO.id_menu == models.Menu.id_menu
    ).filter(
        models.Menu.id_umkm.in_(umkm_ids),
        models.PreOrder.status == 'Selesai'
    )
    
    if start and end:
        daily_sales = daily_sales.filter(func.date(models.PreOrder.created_at) >= start, func.date(models.PreOrder.created_at) <= end)
        
    daily_sales = daily_sales.group_by(func.date(models.PreOrder.created_at)).order_by(func.date(models.PreOrder.created_at)).all()

    for ds in daily_sales:
        chart_data.append({
            "name": str(ds.tanggal),
            "total": float(ds.total or 0)
        })

    return {
        "summary": {
            "revenue": float(revenue_val),
            "totalSales": total_sales,
            "topKantin": top_kantin_name
        },
        "chart": chart_data
    }

@router.get("/ulasan")
def get_ulasan_kantin(
    db: Session = Depends(get_db), 
    current_user: models.Akun = Depends(get_current_user)
):
    if current_user.peran != "PENGELOLA":
        raise HTTPException(status_code=403, detail="Akses ditolak.")

    umkm_binaan = db.query(models.UMKM.id_umkm).filter(
        models.UMKM.id_pengelola == current_user.id_akun
    ).all()
    
    umkm_ids = [u[0] for u in umkm_binaan]

    if not umkm_ids:
        return []

    CustomerAkun = aliased(models.Akun)

    ulasan_query = db.query(
        models.Ulasan.id_ulasan,
        CustomerAkun.username.label("customer"), # Mengambil nama dari alias
        models.UMKM.nama_umkm.label("umkm"),
        models.Ulasan.rating,
        models.Ulasan.tanggal_ulasan,
        models.Ulasan.isi_ulasan.label("comment")
    ).join(
        # Gabungkan ke alias tabel akun menggunakan nim mahasiswa
        CustomerAkun, models.Ulasan.nim == CustomerAkun.id_akun 
    ).join(
        # Gabungkan ke tabel UMKM (yang secara otomatis membawa tabel akun utamanya)
        models.UMKM, models.Ulasan.id_umkm == models.UMKM.id_umkm
    ).filter(
        models.Ulasan.id_umkm.in_(umkm_ids)
    ).order_by(
        models.Ulasan.tanggal_ulasan.desc()
    ).all()

    hasil_ulasan = []
    
    bulan_indo = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", 
                  "Juli", "Agustus", "September", "Oktober", "November", "Desember"]

    for u in ulasan_query:
        tgl = u.tanggal_ulasan
        if tgl:
            format_tgl = f"{tgl.day} {bulan_indo[tgl.month - 1]} {tgl.year}"
        else:
            format_tgl = "-"

        hasil_ulasan.append({
            "id": u.id_ulasan,
            "customer": u.customer,
            "umkm": u.umkm,
            "rating": int(u.rating),
            "date": format_tgl,
            "comment": u.comment if u.comment else "Tidak ada komentar."
        })

    return hasil_ulasan

@router.put("/me", response_model=schemas.PengelolaResponse)
def update_profil_pengelola(
    payload: PengelolaUpdate,
    db: Session = Depends(get_db),
    current_user: models.Akun = Depends(get_current_user)
):
    if current_user.peran != "PENGELOLA":
        raise HTTPException(status_code=403, detail="Akses ditolak")
    
    updated_user = crud_user.update_pengelola_profile(db, current_user.id_akun, payload)
    return updated_user