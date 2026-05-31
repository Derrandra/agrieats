import { useState, useEffect } from "react";
import api from "../../services/api";

import Sidebar from "../../components/umkm/layout/Sidebar";
import Topbar from "../../components/umkm/layout/Topbar";
import OrderCard from "../../components/umkm/dashboard/OrderCard";
import OrderDetailModal from "../../components/umkm/modal/OrderDetailModal";

function Orders() {
  const [storeOpen, setStoreOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("pending");
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
      const response = await api.get("/orders");
      setOrders(response.data);
    } catch (error) {
      console.log("Menggunakan fallback localStorage");
      const savedOrders = JSON.parse(localStorage.getItem("orders")) || [];
      if (savedOrders.length > 0) {
        setOrders(savedOrders);
      } else {
        // Data Dummy yang strukturnya sudah diperbaiki
        const defaultOrders = [
          {
            id: 1,
            customer: "Budi Santoso",
            items: [{ name: "Nasi Goreng", price: 15000 }],
            total: "15000",
            status: "pending",
            declineReason: "",
          },
          {
            id: 2,
            customer: "Andi Wijaya",
            items: [{ name: "Mie Ayam", price: 12000 }],
            total: "12000",
            status: "pending",
            declineReason: "",
          },
        ];
        localStorage.setItem("orders", JSON.stringify(defaultOrders));
        setOrders(defaultOrders);
      }
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
      await api.put(`/orders/${orderId}/status`, { status: "processing" });
    } catch (error) {
      console.log("Fallback: update lokal");
    }

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
      await api.put(`/orders/${selectedOrderId}/status`, { 
        status: "rejected", 
        declineReason 
      });
    } catch (error) {
      console.log("Fallback: update lokal");
    }

    const updatedOrders = orders.map((order) =>
      order.id === selectedOrderId
        ? { ...order, status: "rejected", declineReason }
        : order
    );
    
    setOrders(updatedOrders);
    localStorage.setItem("orders", JSON.stringify(updatedOrders));
    
    setShowDeclineModal(false);
    setDeclineReason("");
    setSelectedOrderId(null);
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
            onClick={() => setActiveTab("pending")}
            className={`px-6 py-3 rounded-xl font-bold transition-all ${
              activeTab === "pending"
                ? "bg-[#15803d] text-white shadow-md"
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            Pesanan Masuk
          </button>
          <button
            onClick={() => setActiveTab("processing")}
            className={`px-6 py-3 rounded-xl font-bold transition-all ${
              activeTab === "processing"
                ? "bg-[#15803d] text-white shadow-md"
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            Sedang Diproses
          </button>
          <button
            onClick={() => setActiveTab("rejected")}
            className={`px-6 py-3 rounded-xl font-bold transition-all ${
              activeTab === "rejected"
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