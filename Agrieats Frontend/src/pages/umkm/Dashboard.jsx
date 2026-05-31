import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

import Sidebar from "../../components/umkm/layout/Sidebar";
import Topbar from "../../components/umkm/layout/Topbar";
import SummaryCard from "../../components/umkm/dashboard/SummaryCard";
import OrderCard from "../../components/umkm/dashboard/OrderCard";
import ProductCard from "../../components/umkm/dashboard/ProductCard";
import OrderDetailModal from "../../components/umkm/modal/OrderDetailModal";
import NotificationModal from "../../components/umkm/modal/NotificationModal";

function Dashboard() {
  const navigate = useNavigate();

  const [storeOpen, setStoreOpen] = useState(true);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  
  // Data State
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [summary, setSummary] = useState({ revenue: "Rp 0", totalOrders: 0 });

  // Modal Detail State
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Modal Decline State
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [declineReason, setDeclineReason] = useState("");

  const notifications = [
    { id: 1, title: "Pesanan Baru", message: "Budi Santoso membuat pesanan baru" },
    { id: 2, title: "Menu Habis", message: "Mie Goreng stok habis" },
  ];

  useEffect(() => {
    loadDashboardSummary();
    loadOrders();
    loadProducts();
  }, []);

  async function loadOrders() {
    try {
      // 1. Ambil daftar menu toko ini dulu untuk mencocokkan ID dengan Nama Menu
      let menuMap = {};
      try {
        const menuRes = await api.get("/api/menu/saya");
        menuRes.data.forEach((menu) => {
          menuMap[menu.id_menu] = menu.nama_menu;
        });
      } catch (menuErr) {
        console.error("Gagal memuat daftar menu untuk mapping nama:", menuErr);
      }

      // 2. Ambil dari Pesanan Masuk UMKM
      const response = await api.get("/api/po/umkm");
      const dataAsli = Array.isArray(response.data) ? response.data : [];

      const mappedOrders = dataAsli.map((order) => ({
        id: order.id_po || "ID_UNKNOWN",
        customer: `NIM: ${order.nim || "Tidak diketahui"}`, 
        total: order.total_harga || 0,
        status: order.status || "Menunggu Validasi",
        declineReason: "", 
        items: (Array.isArray(order.items) ? order.items : []).map((item) => ({
          // 3. Cocokkan ID dengan nama asli
          name: item.id_menu 
            ? menuMap[item.id_menu] || `Menu (ID: ${String(item.id_menu).substring(0, 8)})` 
            : "Menu Tidak Diketahui", 
          price: item.harga_satuan || 0,
          qty: item.kuantitas || 1
        }))
      }));

      setOrders(mappedOrders);
    } catch (error) {
      console.error("Gagal memuat pesanan:", error);
      setOrders([]); 
    }
  }

  async function loadDashboardSummary() {
    try {
      const response = await api.get("/api/umkm/statistik");
      
      const pendapatan = response.data.total_pendapatan || 0;
      const pesanan = response.data.total_pesanan || 0;

      const formatRupiah = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0
      }).format(pendapatan);

      setSummary({ 
        revenue: formatRupiah, 
        totalOrders: pesanan,
      });
    } catch (error) {
      console.error("Gagal memuat statistik:", error);
      setSummary({ revenue: "Rp 0", totalOrders: 0 });
    }
  }

  async function loadProducts() {
    try {
      const response = await api.get("/api/menu/saya");
      setProducts(response.data);
    } catch (error) {
      console.error("Gagal memuat menu:", error);
      setProducts([]); 
    }
  }

  async function updateStoreStatus() {
    setStoreOpen(!storeOpen);
    try {
      await api.put("/store/status", { open: !storeOpen });
    } catch (error) {}
  }

  function openOrderModal(order) {
    setSelectedOrder(order);
    setIsModalOpen(true);
  }

  async function handleAcceptOrder(orderId) {
    try {
      await api.put(`/api/po/${orderId}/status`, { status: "Diproses" });

      // Update state lokal
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: "Diproses" } : order
        )
      );
      
      // Update statistik & daftar pesanan secara otomatis
      await loadDashboardSummary();
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
      alert("Gagal menerima pesanan.");
    }
  }
  function openDeclineModal(orderId) {
    setSelectedOrderId(orderId);
    setShowDeclineModal(true);
  }

  async function handleDeclineOrder() {
    if (!declineReason.trim()) {
      alert("Masukkan alasan penolakan");
      return;
    }
    try {
      await api.put(`/api/po/${selectedOrderId}/status`, { status: "Ditolak" });
      
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === selectedOrderId ? { ...order, status: "Ditolak", declineReason } : order
        )
      );
      
      // Update statistik agar jumlah pesanan masuk berkurang
      await loadDashboardSummary();
      
      setShowDeclineModal(false);
      setDeclineReason("");
      setSelectedOrderId(null);
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
      alert("Gagal menolak pesanan.");
    }
  }

  // Fungsi tambahan untuk menyelesaikan pesanan dari dashboard
  async function handleCompleteOrder(orderId) {
    try {
      await api.put(`/api/po/${orderId}/status`, { status: "Selesai" });
      
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: "Selesai" } : order
        )
      );
      
      // Update pendapatan dan statistik secara instan
      await loadDashboardSummary();
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
      alert("Gagal menyelesaikan pesanan.");
    }
  }

  // Filter khusus Dashboard
  const pesananBaru = orders.filter((order) => order.status === "Menunggu Validasi");
  const pesananAktif = orders.filter((order) => order.status === "Menunggu Validasi" || order.status === "Diproses");

  return (
    <div className="flex min-h-screen bg-[#F2F0F0]">
      <Sidebar />

      <div className="flex-1 ml-64 p-10">
        <Topbar storeOpen={storeOpen} updateStoreStatus={updateStoreStatus} onNotificationClick={() => setIsNotifOpen(true)} />

        {/* SUMMARY */}
        <div className="grid grid-cols-3 gap-5">
          <SummaryCard title="Total Pendapatan" value={summary.revenue} />
          <SummaryCard title="Total Pesanan" value={summary.totalOrders} />
          <SummaryCard title="Pesanan Masuk" value={pesananBaru.length} />
        </div>

        {/* PESANAN AKTIF */}
        <div className="mt-10">
          <div className="flex justify-between items-center mb-5">
            <h1 className="text-2xl font-bold">Pesanan Aktif</h1>
            <div className="flex items-center gap-3">
              <div className="bg-red-500 text-white text-sm px-3 py-1 rounded-full font-semibold">
                {pesananBaru.length} Baru
              </div>
              <p onClick={() => navigate("/orders")} className="text-gray-500 cursor-pointer hover:text-green-700 font-medium">
                Selengkapnya
              </p>
            </div>
          </div>

          <div className="space-y-5">
            {pesananAktif.length > 0 ? (
              pesananAktif.slice(0, 5).map((order) => (
                <OrderCard
                  key={order.id}
                  customer={order.customer}
                  items={order.items}
                  status={order.status}
                  declineReason={order.declineReason}
                  onDetail={() => openOrderModal(order)}
                  onAccept={() => handleAcceptOrder(order.id)}
                  onDecline={() => openDeclineModal(order.id)}
                  onComplete={() => handleCompleteOrder(order.id)}
                />
              ))
            ) : (
              <div className="bg-white p-8 rounded-2xl shadow text-center text-gray-500">
                Belum ada pesanan aktif.
              </div>
            )}
          </div>
        </div>

        {/* MANAJEMEN MENU */}
        <div className="mt-10">
          <div className="flex justify-between items-center mb-5">
            <h1 className="text-2xl font-bold">Manajemen Menu</h1>
            <p onClick={() => navigate("/menu")} className="text-gray-500 cursor-pointer hover:text-green-700 font-medium">
              Selengkapnya
            </p>
          </div>

            <div className="grid grid-cols-3 gap-5">
            {products.slice(0, 5).map((product) => (
              <ProductCard 
                key={product.id_menu}
                name={product.nama_menu}
                price={product.harga}
                stock={product.ketersediaan}
                image={product.foto_menu ? `http://127.0.0.1:8000${product.foto_menu}` : null}
              />
            ))}
            
            <div onClick={() => navigate("/menu/add")} className="bg-white rounded-2xl shadow flex flex-col justify-center items-center cursor-pointer hover:scale-105 transition-all border-2 border-dashed border-green-700 min-h-[220px]">
              <div className="text-5xl text-green-700">+</div>
              <p className="font-semibold mt-3 text-green-700">Tambah Menu</p>
            </div>
          </div>
        </div>
      </div>

      <OrderDetailModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        order={selectedOrder} 
        onAccept={handleAcceptOrder}
        onDecline={openDeclineModal}
        onComplete={handleCompleteOrder}
      />

      <NotificationModal isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} notifications={notifications} />

      {/* DECLINE MODAL */}
      {showDeclineModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white rounded-3xl p-8 w-[500px] shadow-2xl">
            <h2 className="text-2xl font-bold mb-4">Alasan Penolakan</h2>
            <textarea
              rows="5"
              value={declineReason}
              onChange={(e) => setDeclineReason(e.target.value)}
              className="w-full border-2 border-gray-200 rounded-xl p-4 outline-none focus:border-red-500 transition-all text-gray-700"
              placeholder="Masukkan alasan penolakan pesanan ini..."
            />
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowDeclineModal(false)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold px-6 py-2.5 rounded-xl transition-all"
              >
                Batal
              </button>
              <button
                onClick={handleDeclineOrder}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2.5 rounded-xl transition-all"
              >
                Tolak Pesanan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;