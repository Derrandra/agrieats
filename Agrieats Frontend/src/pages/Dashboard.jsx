import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";
import SummaryCard from "../components/dashboard/SummaryCard";
import OrderCard from "../components/dashboard/OrderCard";
import ProductCard from "../components/dashboard/ProductCard";
import OrderDetailModal from "../components/modal/OrderDetailModal";
import NotificationModal from "../components/modal/NotificationModal";

function Dashboard() {
  const navigate = useNavigate();

  const [storeOpen, setStoreOpen] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [orders, setOrders] = useState([]);

  const [summary, setSummary] = useState({
    revenue: "Rp 1.250.000",
    totalOrders: 424,
    incomingOrders: 42,
  });

  const notifications = [
    {
      id: 1,
      title: "Pesanan Baru",
      message: "Budi Santoso membuat pesanan baru",
    },
    {
      id: 2,
      title: "Menu Habis",
      message: "Mie Goreng stok habis",
    },
  ];

  const products = [
    { id: 1, name: "Nasi Goreng", price: "15.000", stock: true },
    { id: 2, name: "Mie Goreng", price: "12.000", stock: false },
    { id: 3, name: "Kwetiau", price: "18.000", stock: true },
    { id: 4, name: "Ayam Geprek", price: "20.000", stock: true },
    { id: 5, name: "Es Teh", price: "5.000", stock: true },
  ];

  useEffect(() => {
    loadDashboardSummary();
    loadOrders();
  }, []);

  function loadOrders() {
    const savedOrders = JSON.parse(localStorage.getItem("orders")) || [];

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
        {
          id: 3,
          customer: "Citra Lestari",
          items: ["Kwetiau"],
          total: "18000",
          status: "pending",
          declineReason: "",
        },
        {
          id: 4,
          customer: "Dina",
          items: ["Seblak"],
          total: "10000",
          status: "pending",
          declineReason: "",
        },
        {
          id: 5,
          customer: "Rizky",
          items: ["Bakso"],
          total: "15000",
          status: "pending",
          declineReason: "",
        },
      ];

      localStorage.setItem("orders", JSON.stringify(defaultOrders));
      setOrders(defaultOrders);
    }
  }

  async function loadDashboardSummary() {
    try {
      /*
      BACKEND NANTI

      const response =
        await api.get("/dashboard/summary");

      setSummary(response.data);
      */
    } catch (error) {
      console.log(error);
    }
  }

  async function updateStoreStatus() {
    setStoreOpen(!storeOpen);

    try {
      await api.put("/store/status", {
        open: !storeOpen,
      });
    } catch (error) {
      console.log(error);
    }
  }

  function openOrderModal(order) {
    setSelectedOrder(order);
    setIsModalOpen(true);
  }

  const pendingOrders = orders.filter((order) => order.status === "pending");
  const newOrdersCount = pendingOrders.length;

  return (
    <div className="flex min-h-screen bg-[#F2F0F0]">
      <Sidebar />

      <div className="flex-1 ml-64 p-10">
        <Topbar
          storeOpen={storeOpen}
          updateStoreStatus={updateStoreStatus}
          onNotificationClick={() => setIsNotifOpen(true)}
        />

        {/* SUMMARY */}
        <div className="grid grid-cols-3 gap-5">
          <SummaryCard title="Total Pendapatan" value={summary.revenue} />
          <SummaryCard title="Total Pesanan" value={summary.totalOrders} />
          <SummaryCard title="Pesanan Masuk" value={newOrdersCount} />
        </div>

        {/* PESANAN AKTIF */}
        <div className="mt-10">
          <div className="flex justify-between items-center mb-5">
            <h1 className="text-2xl font-bold">Pesanan Aktif</h1>

            <div className="flex items-center gap-3">
              <div className="bg-red-500 text-white text-sm px-3 py-1 rounded-full font-semibold">
                {newOrdersCount} Baru
              </div>

              <p
                onClick={() => navigate("/orders")}
                className="text-gray-500 cursor-pointer hover:text-green-700"
              >
                Selengkapnya
              </p>
            </div>
          </div>

          <div className="space-y-5">
            {pendingOrders.slice(0, 5).map((order) => (
              <OrderCard
                key={order.id}
                customer={order.customer}
                items={order.items}
                status={order.status}
                onDetail={() => openOrderModal(order)}
              />
            ))}
          </div>
        </div>

        {/* MANAJEMEN MENU */}
        <div className="mt-10">
          <div className="flex justify-between items-center mb-5">
            <h1 className="text-2xl font-bold">Manajemen Menu</h1>

            <p
              onClick={() => navigate("/menu")}
              className="text-gray-500 cursor-pointer hover:text-green-700"
            >
              Selengkapnya
            </p>
          </div>

          <div className="grid grid-cols-3 gap-5">
            {products.slice(0, 5).map((product) => (
              <ProductCard
                key={product.id}
                name={product.name}
                price={product.price}
                stock={product.stock}
              />
            ))}

            <div
              onClick={() => navigate("/menu/add")}
              className="bg-white rounded-2xl shadow flex flex-col justify-center items-center cursor-pointer hover:scale-105 transition-all border-2 border-dashed border-green-700 min-h-[220px]"
            >
              <div className="text-5xl text-green-700">+</div>
              <p className="font-semibold mt-3">Tambah Menu</p>
            </div>
          </div>
        </div>
      </div>

      <OrderDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        order={selectedOrder}
      />

      <NotificationModal
        isOpen={isNotifOpen}
        onClose={() => setIsNotifOpen(false)}
        notifications={notifications}
      />
    </div>
  );
}

export default Dashboard;