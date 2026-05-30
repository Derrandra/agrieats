import { useState, useEffect } from "react";

import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";
import OrderCard from "../components/dashboard/OrderCard";
import OrderDetailModal from "../components/modal/OrderDetailModal";

function Orders() {
  const [storeOpen, setStoreOpen] = useState(true);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [activeTab, setActiveTab] = useState("pending");

  const [orders, setOrders] = useState([]);

  const [showDeclineModal, setShowDeclineModal] =
    useState(false);

  const [selectedOrderId, setSelectedOrderId] =
    useState(null);

  const [declineReason, setDeclineReason] =
    useState("");

  useEffect(() => {
    loadOrders();
  }, []);

  function loadOrders() {
    const savedOrders =
      JSON.parse(localStorage.getItem("orders")) || [];

    if (savedOrders.length > 0) {
      setOrders(savedOrders);
    } else {
      const defaultOrders = [
        {
          id: 1,
          customer: "Budi Santoso",
          items: ["Nasi Goreng"],
          total: "15000",
          status: "pending",
          declineReason: "",
        },

        {
          id: 2,
          customer: "Andi Wijaya",
          items: ["Mie Ayam"],
          total: "12000",
          status: "pending",
          declineReason: "",
        },
      ];

      localStorage.setItem(
        "orders",
        JSON.stringify(defaultOrders)
      );

      setOrders(defaultOrders);
    }
  }

  function updateStoreStatus() {
    setStoreOpen(!storeOpen);
  }

  function openOrderModal(order) {
    setSelectedOrder(order);
    setIsModalOpen(true);
  }

  function handleAcceptOrder(orderId) {
    const updatedOrders =
      orders.map((order) =>
        order.id === orderId
          ? {
              ...order,
              status: "processing",
            }
          : order
      );

    setOrders(updatedOrders);

    localStorage.setItem(
      "orders",
      JSON.stringify(updatedOrders)
    );
  }

  function openDeclineModal(orderId) {
    setSelectedOrderId(orderId);
    setShowDeclineModal(true);
  }

  function handleDeclineOrder() {
    if (!declineReason.trim()) {
      alert("Masukkan alasan penolakan");
      return;
    }

    const updatedOrders =
      orders.map((order) =>
        order.id === selectedOrderId
          ? {
              ...order,
              status: "rejected",
              declineReason,
            }
          : order
      );

    setOrders(updatedOrders);

    localStorage.setItem(
      "orders",
      JSON.stringify(updatedOrders)
    );

    setShowDeclineModal(false);
    setDeclineReason("");
    setSelectedOrderId(null);
  }

  const filteredOrders =
    orders.filter(
      (order) => order.status === activeTab
    );

  return (
    <div className="flex min-h-screen bg-[#F2F0F0]">
      <Sidebar />

      <div className="flex-1 ml-64 p-10">
        <Topbar
          storeOpen={storeOpen}
          updateStoreStatus={updateStoreStatus}
        />

        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            Manajemen Pesanan
          </h1>

          <p className="text-gray-500 mt-2">
            Kelola seluruh pesanan masuk
          </p>
        </div>

        {/* TAB */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab("pending")}
            className={`px-5 py-3 rounded-xl font-semibold ${
              activeTab === "pending"
                ? "bg-green-700 text-white"
                : "bg-white"
            }`}
          >
            Pesanan Masuk
          </button>

          <button
            onClick={() =>
              setActiveTab("processing")
            }
            className={`px-5 py-3 rounded-xl font-semibold ${
              activeTab === "processing"
                ? "bg-green-700 text-white"
                : "bg-white"
            }`}
          >
            Sedang Diproses
          </button>

          <button
            onClick={() =>
              setActiveTab("rejected")
            }
            className={`px-5 py-3 rounded-xl font-semibold ${
              activeTab === "rejected"
                ? "bg-green-700 text-white"
                : "bg-white"
            }`}
          >
            Ditolak
          </button>
        </div>

        {/* LIST ORDER */}
        <div className="space-y-5">
          {filteredOrders.map((order) => (
            <OrderCard
              key={order.id}
              customer={order.customer}
              items={order.items}
              status={order.status}
              declineReason={order.declineReason}
              onDetail={() =>
                openOrderModal(order)
              }
              onAccept={() =>
                handleAcceptOrder(order.id)
              }
              onDecline={() =>
                openDeclineModal(order.id)
              }
            />
          ))}
        </div>
      </div>

      {/* DETAIL MODAL */}
      <OrderDetailModal
        isOpen={isModalOpen}
        onClose={() =>
          setIsModalOpen(false)
        }
        order={selectedOrder}
      />

      {/* DECLINE MODAL */}
      {showDeclineModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl p-6 w-[500px]">
            <h2 className="text-xl font-bold mb-4">
              Alasan Penolakan
            </h2>

            <textarea
              rows="5"
              value={declineReason}
              onChange={(e) =>
                setDeclineReason(e.target.value)
              }
              className="w-full border rounded-xl p-4 outline-none"
              placeholder="Masukkan alasan..."
            />

            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={() =>
                  setShowDeclineModal(false)
                }
                className="bg-gray-300 px-5 py-2 rounded-xl"
              >
                Batal
              </button>

              <button
                onClick={handleDeclineOrder}
                className="bg-red-500 text-white px-5 py-2 rounded-xl"
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