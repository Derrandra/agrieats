import { useState } from "react";

import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";
import OrderCard from "../components/dashboard/OrderCard";
import OrderDetailModal from "../components/modal/OrderDetailModal";

function Orders() {
  // state status toko
  const [storeOpen, setStoreOpen] = useState(true);

  function updateStoreStatus() {
    setStoreOpen(!storeOpen);
  }

  // state buat modal detail pesanan
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  function openOrderModal(order) {
    setSelectedOrder(order);
    setIsModalOpen(true);
  }

  // dummy data pesanan aktif
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
    {
      id: 3,
      customer: "Citra Lestari",
      items: [
        { name: "Kwetiau", price: "20.000" },
      ],
      total: "20.000",
    },
  ];

  return (
    <div className="flex min-h-screen bg-[#F2F0F0]">
      <Sidebar />

      <div className="flex-1 ml-64 p-10">
        <Topbar storeOpen={storeOpen} updateStoreStatus={updateStoreStatus} />

        {/* header info */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Pesanan Aktif</h1>
          <p className="text-gray-500 mt-2">Kelola seluruh pesanan masuk</p>
        </div>

        {/* list pesanan */}
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

      <OrderDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        order={selectedOrder}
      />
    </div>
  );
}

export default Orders;