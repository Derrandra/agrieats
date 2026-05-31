import { useState, useEffect } from "react";
import api from "../../services/api";

import Sidebar from "../../components/umkm/layout/Sidebar";
import Topbar from "../../components/umkm/layout/Topbar";
import OrderCard from "../../components/umkm/dashboard/OrderCard";
import OrderDetailModal from "../../components/umkm/modal/OrderDetailModal";

function Orders() {
  const [storeOpen, setStoreOpen] = useState(true);
  // Default tab disesuaikan langsung ke status awal database
  const [activeTab, setActiveTab] = useState("Menunggu Validasi");
  const [orders, setOrders] = useState([]);

  // Modal Detail State
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Modal Decline State
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [declineReason, setDeclineReason] = useState("");

  useEffect(() => {
    loadOrders();
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

      const response = await api.get("/api/po/umkm");
      
      const dataAsli = Array.isArray(response.data) ? response.data : [];

      const mappedOrders = dataAsli.map((order) => ({
        id: order.id_po || "ID_UNKNOWN",
        customer: `NIM: ${order.nim || "Tidak diketahui"}`, 
        total: order.total_harga || 0,
        status: order.status || "Menunggu Validasi",
        declineReason: "", 
        items: (Array.isArray(order.items) ? order.items : []).map((item) => ({
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

  function updateStoreStatus() {
    setStoreOpen(!storeOpen);
  }

  function openOrderModal(order) {
    setSelectedOrder(order);
    setIsModalOpen(true);
  }

  async function handleAcceptOrder(orderId) {
    try {
      await api.put(`/api/po/${orderId}/status`, { status: "Diproses" });

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: "Diproses" } : order
        )
      );
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
      await api.put(`/api/po/${selectedOrderId}/status`, { 
        status: "Ditolak" 
      });

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === selectedOrderId
            ? { ...order, status: "Ditolak", declineReason } 
            : order
        )
      );
      
      setShowDeclineModal(false);
      setDeclineReason("");
      setSelectedOrderId(null);
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
      alert("Gagal menolak pesanan.");
    }
  }

  // FUNGSI BARU: Untuk menyelesaikan pesanan
  async function handleCompleteOrder(orderId) {
    try {
      await api.put(`/api/po/${orderId}/status`, { status: "Selesai" });

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: "Selesai" } : order
        )
      );
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
      alert("Gagal menyelesaikan pesanan.");
    }
  }

  const filteredOrders = orders.filter((order) => order.status === activeTab);

  return (
    <div className="flex min-h-screen bg-[#F2F0F0]">
      <Sidebar />

      <div className="flex-1 ml-64 p-10">
        <Topbar storeOpen={storeOpen} updateStoreStatus={updateStoreStatus} />

        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Manajemen Pesanan</h1>
          <p className="text-gray-500 mt-2">Kelola seluruh pesanan masuk</p>
        </div>

        {/* TABS */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab("Menunggu Validasi")}
            className={`px-6 py-3 rounded-xl font-bold transition-all ${
              activeTab === "Menunggu Validasi"
                ? "bg-[#15803d] text-white shadow-md"
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            Pesanan Masuk
          </button>
          <button
            onClick={() => setActiveTab("Diproses")}
            className={`px-6 py-3 rounded-xl font-bold transition-all ${
              activeTab === "Diproses"
                ? "bg-[#15803d] text-white shadow-md"
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            Sedang Diproses
          </button>
          <button
            onClick={() => setActiveTab("Selesai")}
            className={`px-6 py-3 rounded-xl font-bold transition-all ${
              activeTab === "Selesai"
                ? "bg-[#15803d] text-white shadow-md"
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            Selesai
          </button>
          <button
            onClick={() => setActiveTab("Ditolak")}
            className={`px-6 py-3 rounded-xl font-bold transition-all ${
              activeTab === "Ditolak"
                ? "bg-[#15803d] text-white shadow-md"
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            Ditolak
          </button>
        </div>

        {/* LIST ORDER */}
        <div className="space-y-5">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
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
            <div className="bg-white p-10 rounded-2xl shadow text-center text-gray-500">
              Tidak ada pesanan di kategori ini.
            </div>
          )}
        </div>
      </div>

      {/* DETAIL MODAL */}
      <OrderDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        order={selectedOrder}
        onAccept={handleAcceptOrder}
        onDecline={openDeclineModal}
        onComplete={handleCompleteOrder}
      />

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

export default Orders;