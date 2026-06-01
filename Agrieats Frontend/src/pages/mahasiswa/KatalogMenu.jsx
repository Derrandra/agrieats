import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Search, Star, ShoppingCart, Store, X } from "lucide-react";
import api from "../../services/api";

import SidebarMahasiswa from "../../components/mahasiswa/SidebarMahasiswa";
import TopbarMahasiswa from "../../components/mahasiswa/TopbarMahasiswa";
import MenuDetailModal from "../../components/umkm/modal/MenuDetailModal";
import FloatingCart from "../../components/mahasiswa/FloatingCart";

function KatalogMenu() {
  const navigate = useNavigate();
  const location = useLocation();
  const initialUmkm = location.state?.selectedUmkm || "";

  const [mahasiswa, setMahasiswa] = useState(null);
  const [menus, setMenus] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("Semua");
  const [activeUmkm, setActiveUmkm] = useState(initialUmkm);
  const [dynamicFilters, setDynamicFilters] = useState(["Semua"]);

  // STATE MODAL DETAIL MENU
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMenuDetail, setSelectedMenuDetail] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (location.state?.selectedUmkm) {
      setActiveUmkm(location.state.selectedUmkm);
    }
  }, [location.state]);

  async function loadData() {
    try {
      const resProfile = await api.get("/api/mahasiswa/me");
      setMahasiswa(resProfile.data);
    } catch (error) {
      console.error("Gagal memuat profil:", error);
      const localUser = JSON.parse(localStorage.getItem("currentUser"));
      if (localUser) setMahasiswa(localUser);
    }

    let namaUmkmMap = {};
    try {
      const resUmkm = await api.get("/api/umkm/");
      resUmkm.data.forEach(u => {
        namaUmkmMap[u.id_umkm] = u.nama_umkm;
      });
    } catch (error) {
      console.error("Gagal memuat data UMKM");
    }

    try {
      const resMenu = await api.get("/api/menu/");
      const mappedMenu = resMenu.data.map(m => {
        // Cocokkan nama UMKM persis seperti di database
        const namaLangsung = m.pemilik?.nama_umkm || m.umkm?.nama_umkm || m.nama_umkm;
        const namaFinal = namaLangsung || namaUmkmMap[m.id_umkm] || "UMKM Tidak Diketahui";

        return {
          id: m.id_menu,
          name: m.nama_menu,
          umkm_name: namaFinal,
          price: m.harga,
          isAvailable: m.ketersediaan,          
          rating: m.rating || 0,
          image: m.foto_menu || "https://images.unsplash.com/photo-1555126634-323283e090fa",
          description: m.deskripsi || "Tidak ada deskripsi.",
        };
      });
      
      setMenus(mappedMenu);
      generateFilters(mappedMenu);
    } catch (error) {
      console.error("Gagal memuat Menu:", error);
      setMenus([]); 
      generateFilters([]);
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
    
    // Pancarkan sinyal agar FloatingCart di manapun otomatis update & terbuka
    window.dispatchEvent(new Event("cartUpdated"));
    window.dispatchEvent(new Event("openCartDrawer"));
  };

  const handleQuickAddToCart = (item) => {
    globalAddToCart({ ...item, quantity: 1, notes: "" });
  };

  const handleModalAddToCart = (itemData) => {
    globalAddToCart(itemData);
    setIsModalOpen(false);
  };

  const openMenuDetail = (menu) => {
    setSelectedMenuDetail(menu);
    setIsModalOpen(true);
  };

  function generateFilters(dataMenus) {
    if (!dataMenus || dataMenus.length === 0) {
      setDynamicFilters(["Semua"]);
      return;
    }
    const words = dataMenus.map(menu => menu.name.split(" ")[0]);
    const uniqueWords = [...new Set(words)];
    setDynamicFilters(["Semua", ...uniqueWords.slice(0, 6)]);
  }

  const filteredMenus = menus.filter((menu) => {
    const matchSearch = menu.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchFilter = activeFilter === "Semua" || menu.name.startsWith(activeFilter);
    // Filter by UMKM if activeUmkm is set
    const matchUmkm = activeUmkm === "" || menu.umkm_name === activeUmkm; 
    return matchSearch && matchFilter && matchUmkm;
  });

  const totalPages = Math.ceil(filteredMenus.length / itemsPerPage);
  const currentMenus = filteredMenus.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  function goToPage(page) {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  }

  const namaDepan = mahasiswa?.nama_mahasiswa?.split(" ")[0] || "Mahasiswa";

  return (
    <div className="flex min-h-screen bg-[#F2F0F0] font-sans relative">
      <SidebarMahasiswa />

      <div className="flex-1 ml-64 p-10 overflow-hidden relative">
        <TopbarMahasiswa namaUser={namaDepan} />

        {/* Notifikasi Filter UMKM Aktif */}
        {activeUmkm && (
          <div className="mb-6 flex items-center justify-between bg-green-100 border border-green-300 p-4 rounded-2xl shadow-sm">
            <div className="flex items-center gap-3 text-green-800">
              <Store size={24} />
              <div>
                <p className="text-sm opacity-80">Menampilkan menu khusus dari kedai:</p>
                <p className="font-bold text-lg">{activeUmkm}</p>
              </div>
            </div>
            <button 
              onClick={() => setActiveUmkm("")} 
              className="flex items-center gap-2 text-red-600 hover:text-red-800 font-bold bg-white px-4 py-2 rounded-xl border border-red-200 hover:bg-red-50 transition-all"
            >
              <X size={18} /> Hapus Filter UMKM
            </button>
          </div>
        )}

        <div className="mb-8">
          <div className="flex items-center border border-gray-300 rounded-2xl px-6 py-4 bg-white shadow-sm focus-within:border-[#15803d] focus-within:ring-1 focus-within:ring-[#15803d] transition-all mb-4">
            <Search size={28} className="text-gray-400 mr-4" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari makanan atau minuman..." 
              className="w-full outline-none text-lg font-medium placeholder-gray-400 text-gray-700"
            />
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
            {dynamicFilters.map((filter, index) => (
              <button
                key={index}
                onClick={() => {
                  setActiveFilter(filter);
                  setCurrentPage(1); // Reset halaman ke 1 saat mengganti filter
                }}
                className={`px-6 py-2.5 rounded-xl text-base font-bold transition-all whitespace-nowrap shadow-sm border ${
                  activeFilter === filter ? "bg-[#15803d] text-white border-[#15803d]" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Menu Tersedia</h2>
          
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {currentMenus.length > 0 ? currentMenus.map((item) => (
              <div 
                key={item.id} 
                onClick={() => openMenuDetail(item)}
                className="bg-white rounded-3xl shadow-sm border border-gray-200 p-4 flex gap-6 hover:shadow-md hover:border-[#15803d] transition-all cursor-pointer group"
              >
                <div className="w-40 h-40 shrink-0 overflow-hidden rounded-2xl relative">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  
                  {/* Cek menggunakan isAvailable, bukan stock <= 0 */}
                  {!item.isAvailable && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="text-white font-bold bg-red-600 px-3 py-1 rounded-lg">HABIS</span>
                    </div>
                  )}
                </div>
                <div className="flex flex-col justify-between flex-1 py-1">
                  <div>
                    <div className="flex justify-between items-start gap-2 mb-1">
                      <h3 className="font-bold text-xl text-gray-800 line-clamp-1 group-hover:text-[#15803d] transition-colors">{item.name}</h3>
                      <div className="flex items-center gap-1 text-gray-800 font-bold text-sm bg-yellow-100/50 px-2 py-1 rounded-lg whitespace-nowrap">
                        <Star size={16} className="text-yellow-500 fill-yellow-500" /> {item.rating}
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 font-medium mb-3 flex items-center gap-1.5">
                      <Store size={14} /> {item.umkm_name}
                    </p>
                    <div className="flex items-center gap-3 mb-2">
                      
                      {/* Tampilkan label "Tersedia" atau "Habis" */}
                      <span className={`px-3 py-1 rounded-lg text-xs font-bold text-white ${item.isAvailable ? 'bg-green-500' : 'bg-gray-400'}`}>
                        {item.isAvailable ? 'Tersedia' : 'Habis'}
                      </span>
                      
                      <span className="font-bold text-[#15803d] text-lg">Rp {Number(item.price).toLocaleString("id-ID")}</span>
                    </div>
                  </div>
                  
                  {/* Disable tombol jika isAvailable false */}
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleQuickAddToCart(item); }}
                    disabled={!item.isAvailable}
                    className="w-full py-2.5 bg-[#15803d] rounded-xl text-white font-bold hover:bg-green-800 transition-colors mt-auto flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    <ShoppingCart size={18} /> {item.isAvailable ? "Tambah" : "Habis"}
                  </button>
                </div>
              </div>
            )) : (
              <div className="col-span-full py-16 text-center text-gray-500 bg-white rounded-3xl border border-gray-200 flex flex-col items-center justify-center gap-3">
                <Store size={48} className="text-gray-300" />
                <p className="text-lg font-medium">Tidak ada menu yang ditemukan untuk kriteria tersebut.</p>
              </div>
            )}
          </div>
        </div>

        {totalPages > 0 && (
          <div className="flex justify-center mt-8 gap-2">
             <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100 font-bold disabled:opacity-50">{"<"}</button>
            {[...Array(totalPages)].map((_, index) => {
              const pageNumber = index + 1;
              return (
                <button key={pageNumber} onClick={() => goToPage(pageNumber)} className={`px-4 py-1 rounded border font-bold ${currentPage === pageNumber ? "bg-[#3d603a] text-white border-[#3d603a]" : "bg-white text-black border-gray-300 hover:bg-gray-100"}`}>
                  {pageNumber}
                </button>
              );
            })}
             <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages} className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100 font-bold disabled:opacity-50">{">"}</button>
          </div>
        )}
      </div>

      {isModalOpen && (
        <MenuDetailModal 
          menu={selectedMenuDetail} 
          onClose={() => setIsModalOpen(false)} 
          onAddToCart={handleModalAddToCart}
        />
      )}

      {/* PANGGIL KOMPONEN KERANJANG DI SINI */}
      <FloatingCart />
      
    </div>
  );
}

export default KatalogMenu;