import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Search, ArrowRightCircle, Coffee, 
  Utensils, Cookie, Store
} from "lucide-react";
import api from "../../services/api";

import SidebarMahasiswa from "../../components/mahasiswa/SidebarMahasiswa";
import TopbarMahasiswa from "../../components/mahasiswa/TopbarMahasiswa";
import FloatingCart from "../../components/mahasiswa/FloatingCart";
import MenuDetailModal from "../../components/umkm/modal/MenuDetailModal";

function Home() {
  const navigate = useNavigate();
  
  const [mahasiswa, setMahasiswa] = useState(null);
  const [menus, setMenus] = useState([]);
  const [umkms, setUmkms] = useState([]);
  const [historyOrders, setHistoryOrders] = useState([]);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMenuDetail, setSelectedMenuDetail] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

async function loadData() {
    try {
      const resProfile = await api.get("/api/mahasiswa/me");
      setMahasiswa(resProfile.data);
    } catch (error) {
      console.error("Gagal memuat profil:", error);
      const localUser = JSON.parse(localStorage.getItem("currentUser"));
      if (localUser) setMahasiswa(localUser);
    }

    try {
      const resUmkm = await api.get("/api/umkm/");
      const mappedUmkm = resUmkm.data.map(u => ({
        id: u.id_umkm,
        name: u.nama_umkm,
        rating: u.rating || 0,
        image: u.foto_profil || "https://images.unsplash.com/photo-1554118811-1e0d58224f24" 
      }));
      setUmkms(mappedUmkm);
    } catch (error) {
      console.error("Gagal memuat UMKM:", error);
      setUmkms([]); 
    }

    try {
      const resMenu = await api.get("/api/menu/");
      const mappedMenu = resMenu.data.map(m => ({
        id: m.id_menu,
        name: m.nama_menu,
        umkm_name: m.umkm?.nama_umkm || "Mitra Kantin", 
        price: m.harga,
        stock: m.stok || 0,
        rating: m.rating || 0,
        image: m.foto_menu || "https://images.unsplash.com/photo-1555126634-323283e090fa",
        description: m.deskripsi || "Tidak ada deskripsi.",
      }));
      setMenus(mappedMenu);
    } catch (error) {
      console.error("Gagal memuat Menu:", error);
      setMenus([]); 
    }

    try {
      // URL DIPERBAIKI MENJADI /api/po/riwayat sesuai isi po.py kamu!
      const resHistory = await api.get("/api/po/riwayat"); 
      const mappedHistory = resHistory.data.map(h => ({
        id: h.id_po,
        name: h.menu?.nama_menu || "Pesanan",
        umkm_name: h.umkm?.nama_umkm || "-",
        price: h.total_harga || 0,
        image: h.menu?.foto_menu || "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841"
      }));
      setHistoryOrders(mappedHistory);
    } catch (error) {
      console.error("Gagal memuat riwayat pesanan:", error);
      setHistoryOrders([]); 
    }
  }

  const globalAddToCart = (newItem) => {
    const currentCart = JSON.parse(localStorage.getItem("agrieats_cart")) || [];
    const existingIndex = currentCart.findIndex(i => i.id === newItem.id);
    
    if (existingIndex >= 0) {
      currentCart[existingIndex].quantity += (newItem.quantity || 1);
      if (newItem.notes) currentCart[existingIndex].notes = newItem.notes;
    } else {
      currentCart.push({ ...newItem, quantity: newItem.quantity || 1, notes: newItem.notes || "" });
    }
    
    localStorage.setItem("agrieats_cart", JSON.stringify(currentCart));
    const total = currentCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    localStorage.setItem("agrieats_cart_total", total);
    
    window.dispatchEvent(new Event("cartUpdated"));
    window.dispatchEvent(new Event("openCartDrawer"));
  };

  const handleQuickAddToCart = (itemMenu) => {
    globalAddToCart({ ...itemMenu, quantity: 1, notes: "" });
  };

  const handleModalAddToCart = (itemData) => {
    globalAddToCart(itemData);
    setIsModalOpen(false);
  };

  const openMenuDetail = (menu) => {
    setSelectedMenuDetail(menu);
    setIsModalOpen(true);
  };

  const filteredMenus = (menus || []).filter(menu => 
    menu.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredUmkms = (umkms || []).filter(umkm => 
    umkm.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const namaDepan = mahasiswa?.nama_mahasiswa?.split(" ")[0] || "Mahasiswa";

  return (
    <div className="flex min-h-screen bg-[#F2F0F0] font-sans relative">
      <SidebarMahasiswa />

      <div className="flex-1 ml-64 p-10 overflow-hidden">
        <TopbarMahasiswa namaUser={namaDepan} />

        {/* --- Search Bar --- */}
        <div className="mb-12 flex items-center border border-gray-300 rounded-2xl px-6 py-4 bg-white shadow-sm focus-within:border-[#15803d] focus-within:ring-1 focus-within:ring-[#15803d] transition-all">
          <Search size={28} className="text-gray-400 mr-4" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari UMKM, makanan, atau minuman..." 
            className="w-full outline-none text-lg font-medium placeholder-gray-400 text-gray-700"
          />
        </div>

        {/* --- Katalog UMKM --- */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Katalog UMKM</h2>
            <button 
              onClick={() => navigate('/katalog-umkm')}
              className="flex items-center gap-2 text-gray-500 hover:text-[#15803d] font-semibold transition-all">
              Lihat Semua <ArrowRightCircle size={24} />
            </button>
          </div>
          
          <div className="flex gap-6 overflow-x-auto pb-6 custom-scrollbar">
            {filteredUmkms.length > 0 ? filteredUmkms.map((umkm) => (
              <div 
                key={umkm.id} 
                onClick={() => navigate('/katalog-menu', { state: { selectedUmkm: umkm.name } })} 
                className="min-w-[280px] bg-white rounded-3xl shadow-sm border border-gray-200 cursor-pointer hover:shadow-md hover:border-[#15803d] transition-all flex flex-col group"
              >
                <div className="relative h-40 overflow-hidden rounded-t-3xl">
                  <img src={umkm.image} alt={umkm.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-bold flex items-center gap-1 shadow-sm text-gray-800">
                    ★ {umkm.rating}
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col justify-center items-center">
                  <h3 className="font-bold text-xl text-gray-800 line-clamp-1">{umkm.name}</h3>
                </div>
              </div>
            )) : (
              <p className="text-gray-500 italic">Belum ada UMKM yang terdaftar atau buka hari ini.</p>
            )}
          </div>
        </div>

        {/* --- Katalog Menu --- */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Katalog Menu</h2>
            <button 
              onClick={() => navigate('/katalog-menu')}
              className="flex items-center gap-2 text-gray-500 hover:text-[#15803d] font-semibold transition-all">
              Lihat Semua <ArrowRightCircle size={24} />
            </button>
          </div>
          
          <div className="flex gap-6 overflow-x-auto pb-6 custom-scrollbar">
            {filteredMenus.length > 0 ? filteredMenus.slice(0, 7).map((menu) => (
              <div 
                key={menu.id} 
                onClick={() => openMenuDetail(menu)}
                className="min-w-[280px] bg-white rounded-3xl shadow-sm border border-gray-200 cursor-pointer hover:shadow-md hover:border-[#15803d] transition-all flex flex-col group"
              >
                <div className="relative h-48 overflow-hidden rounded-t-3xl">
                  <img src={menu.image} alt={menu.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-bold flex items-center gap-1 shadow-sm text-gray-800">
                    ★ {menu.rating}
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-xl text-gray-800 line-clamp-1 mb-1">{menu.name}</h3>
                    <p className="text-sm text-gray-500 font-medium line-clamp-1 flex items-center gap-1">
                      <Store size={14} /> {menu.umkm_name}
                    </p>
                  </div>
                  <div className="mt-4 flex justify-between items-center">
                    <p className="font-bold text-lg text-[#15803d]">Rp {menu.price.toLocaleString("id-ID")}</p>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleQuickAddToCart(menu); }}
                      className="bg-[#15803d] text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-green-800 transition-colors shadow-sm"
                    >
                      Pesan
                    </button>
                  </div>
                </div>
              </div>
            )) : (
              <p className="text-gray-500 italic">Belum ada menu yang tersedia.</p>
            )}
          </div>
        </div>

        {/* --- Riwayat Order --- */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Order Cepat Lagi</h2>
            <button 
              onClick={() => navigate('/history')}
              className="flex items-center gap-2 text-gray-500 hover:text-[#15803d] font-semibold transition-all">
              Riwayat <ArrowRightCircle size={24} />
            </button>
          </div>
          
          <div className="flex gap-6 overflow-x-auto pb-6 custom-scrollbar">
            {historyOrders.length > 0 ? historyOrders.map((itemOrder) => (
              <div key={itemOrder.id} className="min-w-[280px] bg-white rounded-3xl shadow-sm border border-gray-200 cursor-pointer hover:-translate-y-1 hover:shadow-md transition-all p-5 flex flex-col">
                <img src={itemOrder.image} alt={itemOrder.name} className="w-full h-36 object-cover rounded-2xl mb-4" />
                <h3 className="font-bold text-xl text-gray-800 line-clamp-1">{itemOrder.name}</h3>
                <p className="text-sm text-gray-500 font-medium mt-1 line-clamp-1 flex items-center gap-1">
                  <Store size={14} /> {itemOrder.umkm_name}
                </p>
                <div className="mt-5 flex items-center justify-between">
                  <p className="text-xl font-bold text-[#15803d]">Rp {itemOrder.price.toLocaleString("id-ID")}</p>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleQuickAddToCart(itemOrder); }}
                    className="bg-[#15803d] text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-green-800 transition-colors shadow-sm">
                    Pesan
                  </button>
                </div>
              </div>
            )) : (
              <p className="text-gray-500 italic">Belum ada riwayat pesanan.</p>
            )}
          </div>
        </div>

        {/* --- Kategori & Promo (Static Layout) --- */}
        <div className="grid grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Kategori Menu</h2>
            <div className="grid grid-cols-3 gap-5">
              <button className="aspect-square bg-white rounded-3xl shadow-sm border border-gray-200 flex flex-col items-center justify-center hover:border-[#15803d] hover:text-[#15803d] hover:shadow-md transition-all group">
                <Utensils size={32} strokeWidth={1.5} className="mb-2 text-gray-700 group-hover:text-[#15803d] transition-colors" />
                <span className="font-semibold text-sm text-gray-700 group-hover:text-[#15803d] transition-colors">Makanan Berat</span>
              </button>
              <button className="aspect-square bg-white rounded-3xl shadow-sm border border-gray-200 flex flex-col items-center justify-center hover:border-[#15803d] hover:text-[#15803d] hover:shadow-md transition-all group">
                <Cookie size={32} strokeWidth={1.5} className="mb-2 text-gray-700 group-hover:text-[#15803d] transition-colors" />
                <span className="font-semibold text-sm text-gray-700 group-hover:text-[#15803d] transition-colors">Camilan</span>
              </button>
              <button className="aspect-square bg-white rounded-3xl shadow-sm border border-gray-200 flex flex-col items-center justify-center hover:border-[#15803d] hover:text-[#15803d] hover:shadow-md transition-all group">
                <Coffee size={32} strokeWidth={1.5} className="mb-2 text-gray-700 group-hover:text-[#15803d] transition-colors" />
                <span className="font-semibold text-sm text-gray-700 group-hover:text-[#15803d] transition-colors">Minuman</span>
              </button>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Promo Menarik</h2>
              <button className="flex items-center gap-2 text-gray-500 hover:text-[#15803d] font-semibold transition-all">
                Lainnya <ArrowRightCircle size={24} />
              </button>
            </div>
            <div className="flex gap-5 overflow-x-auto pb-4 custom-scrollbar">
              <div className="min-w-[320px] bg-white rounded-3xl shadow-sm border border-gray-200 cursor-pointer overflow-hidden group hover:shadow-md transition-all">
                <img src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da" alt="Promo" className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="p-5 border-t border-gray-100 bg-white relative z-10">
                  <h3 className="font-bold text-xl text-gray-800">Flash Sale 5.5</h3>
                </div>
              </div>
              <div className="min-w-[320px] bg-white rounded-3xl shadow-sm border border-gray-200 cursor-pointer overflow-hidden group hover:shadow-md transition-all">
                <img src="https://images.unsplash.com/photo-1607082350899-7e105aa886ae" alt="Promo 2" className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="p-5 border-t border-gray-100 bg-white relative z-10">
                  <h3 className="font-bold text-xl text-gray-800">Diskon Mahasiswa</h3>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {isModalOpen && (
        <MenuDetailModal 
          menu={selectedMenuDetail} 
          onClose={() => setIsModalOpen(false)} 
          onAddToCart={handleModalAddToCart}
        />
      )}

      <FloatingCart />

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { height: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}</style>
    </div>
  );
}

export default Home;