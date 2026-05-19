import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";
import SummaryCard from "../components/dashboard/SummaryCard";
import OrderCard from "../components/dashboard/OrderCard";
import ProductCard from "../components/dashboard/ProductCard";
import OrderDetailModal from "../components/modal/OrderDetailModal";

function Dashboard() {
  const navigate = useNavigate();

  const [storeOpen, setStoreOpen] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  async function updateStoreStatus() {
    setStoreOpen(!storeOpen);

    try {
      // TODO: integrasi update status toko (PUT /store/status)
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

  // TODO: nanti ganti pakai data asli dari backend (GET /orders)
  const orders = [
    {
      id: 1,
      customer: "Budi Santoso",
      items: [
        { name: "Nasi Goreng", price: "15.000" },
        { name: "Mie Goreng", price: "12.000" },
      ],
      total: "27.000",
    },
    {
      id: 2,
      customer: "Andi Wijaya",
      items: [
        { name: "Ayam Geprek", price: "18.000" },
        { name: "Es Jeruk", price: "8.000" },
      ],
      total: "26.000",
    },
  ];

  // dummy data buat menu
  const products = [
    { id: 1, name: "Nasi Goreng", price: "15.000", stock: true },
    { id: 2, name: "Mie Goreng", price: "12.000", stock: false },
    { id: 3, name: "Kwetiau", price: "18.000", stock: true },
  ];

  return (
    <div className="flex min-h-screen bg-[#F2F0F0]">
      <Sidebar />

      <div className="flex-1 ml-64 p-10">
        <Topbar 
          storeOpen={storeOpen} 
          updateStoreStatus={updateStoreStatus} 
        />

        {/* Ringkasan */}
        <div className="grid grid-cols-3 gap-5">
          <SummaryCard title="Total Pendapatan" value="Rp 1.250.000" />
          <SummaryCard title="Total Pesanan" value="424" />
          <SummaryCard title="Pesanan Masuk" value="42" />
        </div>

        {/* Pesanan Aktif */}
        <div className="mt-10">
          <div className="flex justify-between items-center mb-5">
            <h1 className="text-2xl font-bold">Pesanan Aktif</h1>
            <p
              onClick={() => navigate("/orders")}
              className="text-gray-500 cursor-pointer hover:text-green-700"
            >
              Selengkapnya
            </p>
          </div>

          <div className="space-y-5">
            {orders.map((order) => (
              <OrderCard
                key={order.id}
                customer={order.customer}
                items={order.items.map((item) => item.name)}
                onDetail={() => openOrderModal(order)}
              />
            ))}
          </div>
        </div>

        {/* Manajemen Menu */}
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
            {products.map((product) => (
              <ProductCard
                key={product.id}
                name={product.name}
                price={product.price}
                stock={product.stock}
              />
            ))}
            <ProductCard isAddCard={true} />
          </div>
        </div>
      </div>

      <OrderDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        order={selectedOrder}
      />
    </div>
  );
}

export default Dashboard;