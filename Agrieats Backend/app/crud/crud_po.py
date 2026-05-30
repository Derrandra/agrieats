import uuid
from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.db import models
from app.schemas import po as po_schema
from sqlalchemy import desc, func

class CRUDPreOrder:
    def create_po(self, db: Session, po_data: po_schema.POCreate, nim: str):
        # Generate ID PO unik (maks 20 karakter sesuai model)
        id_po = f"PO-{uuid.uuid4().hex[:10].upper()}"
        
        total_harga_keseluruhan = 0
        db_items = []
        
        for item in po_data.items:
            # Ambil data menu langsung dari database (NOT FROM INPUT YAA)
            menu_db = db.query(models.Menu).filter(models.Menu.id_menu == item.id_menu).first()
            
            if not menu_db:
                raise HTTPException(status_code=404, detail=f"Menu dengan ID {item.id_menu} tidak ditemukan.")
            if not menu_db.ketersediaan:
                raise HTTPException(status_code=400, detail=f"Menu '{menu_db.nama_menu}' sedang tidak tersedia.")
            
            subtotal = menu_db.harga * item.kuantitas
            total_harga_keseluruhan += subtotal
            
            # Buat objek (DetailPO)
            db_detail = models.DetailPO(
                id_po=id_po,
                id_menu=item.id_menu,
                kuantitas=item.kuantitas,
                harga_satuan=menu_db.harga
            )
            db_items.append(db_detail)
            
        # Buat objek (PreOrder)
        db_po = models.PreOrder(
            id_po=id_po,
            nim=nim, # NIM otomatis dari Satpam JWT
            waktu_pengambilan=po_data.waktu_pengambilan,
            status="Menunggu Validasi",
            total_harga=total_harga_keseluruhan
        )
        
        db.add(db_po)
        db.add_all(db_items)
        db.commit()
        db.refresh(db_po)
        
        return db_po
    
    def get_po_by_umkm(self, db: Session, id_umkm: str):
        # JOIN 3 tabel: PreOrder -> DetailPO -> Menu
        # buat cari PO mana saja yang memuat menu milik toko
        return (
            db.query(models.PreOrder)
            .join(models.PreOrder.items)           # Relasi ke tabel DetailPO
            .join(models.DetailPO.menu_terkait)    # Relasi ke tabel Menu
            .filter(models.Menu.id_umkm == id_umkm)
            .distinct()                            # Cegah duplikasi data jika ada 2 menu berbeda dari toko yg sama di 1 PO
            .all()
        )
    
    def get_po_by_id(self, db: Session, id_po: str):
        # Mengambil data satu PO spesifik
        return db.query(models.PreOrder).filter(models.PreOrder.id_po == id_po).first()

    def update_status(self, db: Session, db_po: models.PreOrder, new_status: str):
        # Mengubah status dan menyimpannya ke database
        db_po.status = new_status
        db.commit()
        db.refresh(db_po)
        return db_po
    
    def get_po_by_mahasiswa(self, db: Session, nim: str):
        # Mengambil semua riwayat PO milik satu mahasiswa
        return db.query(models.PreOrder).filter(models.PreOrder.nim == nim).all()

    def get_riwayat_mahasiswa(self, db: Session, nim: str):
        # Mengambil semua PO milik mahasiswa, diurutkan dari yang terbaru
        return db.query(models.PreOrder).filter(
            models.PreOrder.nim == nim
        ).order_by(desc(models.PreOrder.created_at)).all()
    
    def get_statistik_umkm(self, db: Session, id_umkm: str):
        query_dasar = db.query(models.PreOrder).join(models.DetailPO).join(models.Menu).filter(
            models.Menu.id_umkm == id_umkm,
            models.PreOrder.status == "Selesai"
        )

        total_pesanan = query_dasar.with_entities(func.count(func.distinct(models.PreOrder.id_po))).scalar() or 0
        total_pendapatan = query_dasar.with_entities(func.sum(func.distinct(models.PreOrder.total_harga))).scalar() or 0.0

        return {
            "total_pesanan_selesai": total_pesanan,
            "total_pendapatan": total_pendapatan
        }
po_repository = CRUDPreOrder()