from sqlalchemy import Column, String, Boolean, Integer, Numeric, TIMESTAMP, ForeignKey, CheckConstraint
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from .database import Base
import uuid

# SUPERCLASS
class Akun(Base):
    __tablename__ = "akun"

    id_akun = Column(String(20), primary_key=True, index=True)
    username = Column(String(50), unique=True, nullable=False, index=True)
    email = Column(String(100), unique=True, nullable=False, index=True)
    password = Column(String(255), nullable=False)
    peran = Column(String(20), nullable=False)  # 'MAHASISWA', 'UMKM', 'PENGELOLA'
    created_at = Column(TIMESTAMP, server_default=func.now())

    # Atribut polmorfismik untuk inheritance
    type = Column(String(20))
    __mapper_args__ = {
        "polymorphic_identity": "akun",
        "polymorphic_on": type,
    }

# SUBCLASS: PENGELOLA KANTIN
class PengelolaKantin(Akun):
    __tablename__ = "pengelola_kantin"

    id_pengelola = Column(String(20), ForeignKey("akun.id_akun", ondelete="CASCADE"), primary_key=True)
    nama_u_kantin = Column(String(50), nullable=False)
    kontak_pengelola = Column(String(30), nullable=False)
    nama_pj_usaha = Column(String(100), nullable=False)

    __mapper_args__ = {"polymorphic_identity": "PENGELOLA"}

# SUBCLASS: UMKM
class UMKM(Akun):
    __tablename__ = "umkm"

    id_umkm = Column(String(20), ForeignKey("akun.id_akun", ondelete="CASCADE"), primary_key=True)
    id_pengelola = Column(String(20), ForeignKey("pengelola_kantin.id_pengelola", ondelete="CASCADE"), nullable=False)
    nama_umkm = Column(String(50), nullable=False)
    lokasi = Column(String(255), nullable=False)
    jam_operasional = Column(String(50), nullable=False)
    deskripsi = Column(String)
    rating = Column(Numeric(3, 2), default=0.00)
    status_buka = Column(Boolean, default=False)

    __mapper_args__ = {"polymorphic_identity": "UMKM"}

    # Relasi ke Menu
    daftar_menu = relationship("Menu", back_populates="pemilik")

    # Relasi dari UMKM ke Kategori Menu milik toko tersebut
    daftar_kategori = relationship("KategoriMenu", back_populates="merchant", cascade="all, delete-orphan")

# SUBCLASS: MAHASISWA
class Mahasiswa(Akun):
    __tablename__ = "mahasiswa"

    nim = Column(String(20), ForeignKey("akun.id_akun", ondelete="CASCADE"), primary_key=True)
    prodi = Column(String(50), nullable=False)
    telepon = Column(String(20), nullable=False)

    __mapper_args__ = {"polymorphic_identity": "MAHASISWA"}
    riwayat_pesanan = relationship("PreOrder", back_populates="pembeli")

# TABEL KATEGORI MENU
class KategoriMenu(Base):
    __tablename__ = "kategori_menu"

    id_kategori = Column(String(50), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    id_umkm = Column(String(20), ForeignKey("umkm.id_umkm", ondelete="CASCADE"), nullable=False)
    nama_kategori = Column(String(20), nullable=False) # Isinya 'Makanan', 'Minuman', atau 'Cemilan'

    # Relasi balik ke UMKM
    merchant = relationship("UMKM", back_populates="daftar_kategori")
    # Relasi ke Menu-menu yang memakai kategori ini
    daftar_menu_kategori = relationship("Menu", back_populates="kategori")
    
# TABEL MENU
class Menu(Base):
    __tablename__ = "menu"

    id_menu = Column(String(10), primary_key=True, index=True)
    id_umkm = Column(String(20), ForeignKey("umkm.id_umkm", ondelete="CASCADE"), nullable=False)
    nama_menu = Column(String(100), nullable=False)
    
    # Hubungkan tabel Menu ke tabel KategoriMenu
    id_kategori = Column(String(50), ForeignKey("kategori_menu.id_kategori", ondelete="SET NULL"), nullable=True)
    
    harga = Column(Integer, nullable=False)
    ketersediaan = Column(Boolean, default=False)
    tag_makanan = Column(String(50))
    foto_menu = Column(String) # Berisi URL/Path foto
    created_at = Column(TIMESTAMP, server_default=func.now())

    # Relasi balik ke UMKM
    pemilik = relationship("UMKM", back_populates="daftar_menu")
    # Relasi ke DetailPO
    dalam_pesanan = relationship("DetailPO", back_populates="menu_terkait")

    # Relasi balik ke KategoriMenu
    kategori = relationship("KategoriMenu", back_populates="daftar_menu_kategori")

# TABEL PRE-ORDER
class PreOrder(Base):
    __tablename__ = "pre_order"

    id_po = Column(String(20), primary_key=True, index=True)
    nim = Column(String(20), ForeignKey("mahasiswa.nim", ondelete="CASCADE"), nullable=False)
    waktu_pengambilan = Column(TIMESTAMP, nullable=False)
    status = Column(String(50), default="Menunggu Validasi")
    total_harga = Column(Integer, nullable=False)
    bukti_pembayaran = Column(String, nullable=True)
    created_at = Column(TIMESTAMP, server_default=func.now())

    # Relasi
    pembeli = relationship("Mahasiswa", back_populates="riwayat_pesanan")
    items = relationship("DetailPO", back_populates="pesanan_induk")
    ulasan_pesanan = relationship("Ulasan", back_populates="pesanan_terkait", uselist=False)

# TABEL DETAIL PO (Junction)
class DetailPO(Base):
    __tablename__ = "detail_po"

    id_detail = Column(Integer, primary_key=True, autoincrement=True)
    id_po = Column(String(20), ForeignKey("pre_order.id_po", ondelete="CASCADE"), nullable=False)
    id_menu = Column(String(10), ForeignKey("menu.id_menu", ondelete="CASCADE"), nullable=False)
    kuantitas = Column(Integer, nullable=False)
    harga_satuan = Column(Integer, nullable=False)

    # Relasi
    pesanan_induk = relationship("PreOrder", back_populates="items")
    menu_terkait = relationship("Menu", back_populates="dalam_pesanan")
    
    __table_args__ = (CheckConstraint('kuantitas > 0', name='check_kuantitas_positif'),)

# TABEL ULASAN 
class Ulasan(Base):
    __tablename__ = "ulasan"

    id_ulasan = Column(String(20), primary_key=True, index=True)
    nim = Column(String(20), ForeignKey("mahasiswa.nim", ondelete="CASCADE"), nullable=False)
    id_umkm = Column(String(20), ForeignKey("umkm.id_umkm", ondelete="CASCADE"), nullable=False)
    id_po = Column(String(20), ForeignKey("pre_order.id_po", ondelete="CASCADE"), nullable=False)
    isi_ulasan = Column(String)
    rating = Column(Integer, nullable=False)
    tanggal_ulasan = Column(TIMESTAMP, server_default=func.now())
    foto_ulasan = Column(String, nullable=True)

    # Relasi
    penulis = relationship("Mahasiswa")
    umkm_tujuan = relationship("UMKM")
    pesanan_terkait = relationship("PreOrder", back_populates="ulasan_pesanan")

    __table_args__ = (CheckConstraint('rating >= 1 AND rating <= 5', name='check_rating_range'),)
    
# TABEL KERANJANG BELANJA (CART)
class KeranjangBelanja(Base):
    __tablename__ = "keranjang_belanja"

    id_keranjang = Column(Integer, primary_key=True, autoincrement=True)
    nim = Column(String(20), ForeignKey("mahasiswa.nim", ondelete="CASCADE"), nullable=False)
    id_menu = Column(String(10), ForeignKey("menu.id_menu", ondelete="CASCADE"), nullable=False)
    kuantitas = Column(Integer, nullable=False, default=1)

    # Relasi ke Mahasiswa dan Menu agar ORM SQLAlchemy bisa manggil datanya langsung
    pembeli = relationship("Mahasiswa")
    menu_terpilih = relationship("Menu")

    # Validasi level database biar mahasiswa gak bisa input kuantitas 0 atau minus
    __table_args__ = (CheckConstraint('kuantitas > 0', name='check_kuantitas_keranjang_positif'),)