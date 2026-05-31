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
  const [summary, setSummary] = useState({ revenue: "Rp 0", totalOrders: 0, incomingOrders: 0 });

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
      const response = await api.get("/orders");
      setOrders(response.data);
    } catch (error) {
      const savedOrders = JSON.parse(localStorage.getItem("orders")) || [];
      if (savedOrders.length > 0) {
        setOrders(savedOrders);
      } else {
        const defaultOrders = [
          { id: 1, customer: "Budi Santoso", items: [{ name: "Nasi Goreng", price: 15000 }], total: "15000", status: "pending", declineReason: "" },
          { id: 2, customer: "Andi Wijaya", items: [{ name: "Mie Ayam", price: 12000 }], total: "12000", status: "pending", declineReason: "" },
        ];
        localStorage.setItem("orders", JSON.stringify(defaultOrders));
        setOrders(defaultOrders);
      }
    }
  }

  async function loadDashboardSummary() {
    try {
      const response = await api.get("/dashboard/summary");
      setSummary(response.data);
    } catch (error) {
      setSummary({ revenue: "Rp 1.250.000", totalOrders: 424, incomingOrders: 42 });
    }
  }

  async function loadProducts() {
    try {
      const response = await api.get("/menus");
      setProducts(response.data);
    } catch (error) {
      // Pastikan ada 5 item di fallback agar grid terisi 5 produk + 1 tambah menu = 6 kotak simetris
      setProducts([
        { id: 1, name: "Nasi Goreng", price: "15.000", stock: true },
        { id: 2, name: "Mie Goreng", price: "12.000", stock: false },
        { id: 3, name: "Kwetiau", price: "18.000", stock: true },
        { id: 4, name: "Ayam Geprek", price: "20.000", stock: true },
        { id: 5, name: "Es Teh", price: "5.000", stock: true },
      ]);
    }
  }

  async function updateStoreStatus() {
    setStoreOpen(!storeOpen);
    try {
      await api.put("/store/status", { open: !storeOpen });
    } catch (error) {}
  }

  // LOGIKA TERIMA/TOLAK PESANAN (Sinkron dengan halaman Orders)
  function openOrderModal(order) {
    setSelectedOrder(order);
    setIsModalOpen(true);
  }

  async function handleAcceptOrder(orderId) {
    try {
      await api.put(`/orders/${orderId}/status`, { status: "processing" });
    } catch (error) {}

    const updatedOrders = orders.map((order) =>
      order.id === orderId ? { ...order, status: "processing" } : order
    );
    setOrders(updatedOrders);
    localStorage.setItem("orders", JSON.stringify(updatedOrders));
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
      await api.put(`/orders/${selectedOrderId}/status`, { status: "rejected", declineReason });
    } catch (error) {}

    const updatedOrders = orders.map((order) =>
      order.id === selectedOrderId ? { ...order, status: "rejected", declineReason } : order
    );
    
    setOrders(updatedOrders);
    localStorage.setItem("orders", JSON.stringify(updatedOrders));
    
    setShowDeclineModal(false);
    setDeclineReason("");
    setSelectedOrderId(null);
  }

  const pendingOrders = orders.filter((order) => order.status === "pending");

  return (
    <div className="flex min-h-screen bg-[#F2F0F0]">
      <Sidebar />

      <div className="flex-1 ml-64 p-10">
        <Topbar storeOpen={storeOpen} updateStoreStatus={updateStoreStatus} onNotificationClick={() => setIsNotifOpen(true)} />

        {/* SUMMARY */}
        <div className="grid grid-cols-3 gap-5">
          <SummaryCard title="Total Pendapatan" value={summary.revenue} />
          <SummaryCard title="Total Pesanan" value={summary.totalOrders} />
          <SummaryCard title="Pesanan Masuk" value={pendingOrders.length} />
        </div>

        {/* PESANAN AKTIF */}
        <div className="mt-10">
          <div className="flex justify-between items-center mb-5">
            <h1 className="text-2xl font-bold">Pesanan Aktif</h1>
            <div className="flex items-center gap-3">
              <div className="bg-red-500 text-white text-sm px-3 py-1 rounded-full font-semibold">
                {pendingOrders.length} Baru
              </div>
              <p onClick={() => navigate("/orders")} className="text-gray-500 cursor-pointer hover:text-green-700 font-medium">
                Selengkapnya
              </p>
            </div>
          </div>

          <div className="space-y-5">
            {pendingOrders.length > 0 ? (
              pendingOrders.slice(0, 5).map((order) => (
                <OrderCard
                  key={order.id}
                  customer={order.customer}
                  items={order.items}
                  status={order.status}
                  onDetail={() => openOrderModal(order)}
                  onAccept={() => handleAcceptOrder(order.id)}
                  onDecline={() => openDeclineModal(order.id)}
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
              <ProductCard key={product.id} name={product.name} price={product.price} stock={product.stock} />
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