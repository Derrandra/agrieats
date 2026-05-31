import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import api from "../../services/api";
import SidebarKantin from "../../components/kantin/SidebarKantin";
import TopbarKantin from "../../components/kantin/TopbarKantin";
import NotificationModal from "../../components/umkm/modal/NotificationModal";

function DashboardKantin() {
  const navigate = useNavigate();
  
  const [storeOpen, setStoreOpen] = useState(true);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  // State Data User & UMKM
  const [kantinName, setKantinName] = useState("Kantin");
  const [umkmList, setUmkmList] = useState([]);

  // Fungsi untuk mendapatkan tanggal awal bulan dan hari ini secara dinamis
  const getFirstDayOfMonth = () => {
    const date = new Date();
    return new Date(date.getFullYear(), date.getMonth(), 1).toISOString().split('T')[0];
  };
  const getTodayDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  // State untuk filter grafik & summary (Sekarang dinamis mengikuti waktu saat ini)
  const [chartView, setChartView] = useState("daily"); 
  const [startDate, setStartDate] = useState(getFirstDayOfMonth());
  const [endDate, setEndDate] = useState(getTodayDate());
  
  const [chartData, setChartData] = useState([]);
  const [summaryData, setSummaryData] = useState({
    revenue: 0,
    totalSales: 0,
    topKantin: "Memuat...",
  });

  useEffect(() => {
    // Ambil nama unit kantin dari localStorage
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (user && user.nama_u_kantin) {
      setKantinName(user.nama_u_kantin); // Menampilkan "Kantin SSMI" dll
    } else if (user && user.username) {
      setKantinName(user.username);
    }

    fetchUmkmData();
  }, []);

  // Fetch data setiap kali filter tanggal atau view berubah
  useEffect(() => {
    fetchDashboardData();
  }, [chartView, startDate, endDate]);

  async function fetchUmkmData() {
    try {
      const response = await api.get("/api/pengelola/umkm");
      setUmkmList(response.data);
    } catch (error) {
      console.error("Gagal mengambil data UMKM:", error);
    }
  }

  async function fetchDashboardData() {
    try {
      // Mengambil data statistik dari backend berdasarkan filter tanggal
      const response = await api.get("/api/pengelola/statistik", {
        params: { view: chartView, start: startDate, end: endDate }
      });
      
      setChartData(response.data.chart);
      setSummaryData(response.data.summary);
    } catch (error) {
      console.error("Gagal mengambil data dashboard:", error);
      // Fallback jika error agar UI tidak blank
      setSummaryData({ revenue: 0, totalSales: 0, topKantin: "-" });
      setChartData([]);
    }
  }

  const notifications = [
    { id: 1, text: "UMKM Risol GC memperbarui menu" },
    { id: 2, text: "Kontrak Cireng BC akan segera habis" },
  ];

  const reviews = [
    { id: 1, customer: "Budi Santoso", rating: 5, review: "Makanan sangat enak dan pelayanan cepat" },
    { id: 2, customer: "Andi Wijaya", rating: 4, review: "Tempat nyaman dan bersih" },
  ];

  return (
    <div className="flex min-h-screen bg-[#F2F0F0]">
      <SidebarKantin />
      
      <div className="flex-1 ml-64 p-10">
        <TopbarKantin onNotificationClick={() => setIsNotifOpen(true)} />

        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Hello, {kantinName}!</h1>
        </div>

        {/* FILTER TANGGAL */}
        <div className="bg-white rounded-2xl p-5 shadow mb-5 flex items-center gap-4">
          <p className="font-medium text-gray-700">Periode:</p>
          <input 
            type="date" 
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-green-700"
          />
          <span className="text-gray-500 font-medium">-</span>
          <input 
            type="date" 
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-green-700"
          />
        </div>

        {/* CHART GRAFIK PENJUALAN */}
        <div className="bg-white rounded-2xl p-6 shadow h-[400px] mb-5 flex flex-col">
          <div className="flex justify-between items-center mb-5">
            <h2 className="font-semibold text-lg">Grafik Penjualan</h2>

            <div className="flex gap-3">
              <button 
                onClick={() => setChartView("daily")}
                className={`px-5 py-2 rounded-lg font-medium transition-all ${
                  chartView === "daily" 
                    ? "bg-green-700 text-white" 
                    : "border border-gray-300 hover:bg-gray-50 text-gray-700"
                }`}
              >
                Daily
              </button>
              <button 
                onClick={() => setChartView("weekly")}
                className={`px-5 py-2 rounded-lg font-medium transition-all ${
                  chartView === "weekly" 
                    ? "bg-green-700 text-white" 
                    : "border border-gray-300 hover:bg-gray-50 text-gray-700"
                }`}
              >
                Weekly
              </button>
            </div>
          </div>
          
          <div className="flex-1 w-full h-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 30, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: '#6b7280' }} tickMargin={10} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#6b7280' }} axisLine={false} tickLine={false} tickFormatter={(value) => `Rp ${value / 1000}k`} />
                <Tooltip 
                  formatter={(value) => `Rp ${value.toLocaleString("id-ID")}`}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Line type="monotone" dataKey="total" stroke="#15803d" strokeWidth={4} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* SUMMARY (REAL-TIME) */}
        <div className="grid grid-cols-3 gap-5 mb-10">
          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="text-gray-500 font-medium">Total Pendapatan</h2>
            <p className="text-4xl font-bold text-green-700 mt-3">
              Rp {summaryData.revenue.toLocaleString("id-ID")}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="text-gray-500 font-medium">Total Penjualan</h2>
            <p className="text-4xl font-bold text-green-700 mt-3">
              {summaryData.totalSales.toLocaleString("id-ID")}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="text-gray-500 font-medium">Kantin Terlaris</h2>
            <p className="text-4xl font-bold text-green-700 mt-3 truncate">
              {summaryData.topKantin}
            </p>
          </div>
        </div>

        {/* UMKM */}
        <div className="mb-10">
          <div className="flex justify-between items-center mb-5">
            <h1 className="text-2xl font-bold">Manajemen UMKM</h1>
            <p 
              onClick={() => navigate("/kantin/umkm")}
              className="text-gray-500 cursor-pointer hover:text-green-700 font-medium transition-colors"
            >
              Selengkapnya
            </p>
          </div>

          <div className="grid grid-cols-4 gap-5">
            {umkmList.length > 0 ? (
              umkmList.map((item) => (
                <div key={item.id_umkm} className="bg-white rounded-2xl p-4 shadow">
                  <div className="w-full h-40 bg-gray-200 rounded-xl flex items-center justify-center text-gray-400 overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400" alt={item.nama_umkm} className="w-full h-full object-cover" />
                  </div>
                  <h2 className="font-bold mt-3 text-lg">{item.nama_umkm}</h2>
                  <p className="text-gray-500">{item.lokasi}</p>
                </div>
              ))
            ) : (
              <div className="col-span-3 bg-white p-6 rounded-2xl shadow text-gray-500 flex items-center justify-center">
                Belum ada UMKM yang terdaftar di kantin Anda.
              </div>
            )}

            <div 
              onClick={() => navigate("/kantin/umkm/add")}
              className="bg-white border-2 border-dashed border-green-700 rounded-2xl flex flex-col justify-center items-center cursor-pointer hover:scale-105 transition-all min-h-[220px] group"
            >
              <Plus size={50} className="text-green-700 group-hover:scale-110 transition-transform" />
              <p className="font-semibold text-green-700 mt-3">Tambah UMKM</p>
            </div>
          </div>
        </div>

        {/* REVIEW */}
        <div>
            <div className="flex justify-between items-center mb-5">
            <h1 className="text-2xl font-bold">Customer Review</h1>
            <p 
              onClick={() => navigate("/kantin/reviews")} 
              className="text-gray-500 cursor-pointer hover:text-green-700 font-medium transition-colors"
            >
              View All
            </p>
          </div>

          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="bg-white p-5 rounded-2xl shadow">
                <h2 className="font-bold text-lg">{review.customer}</h2>
                <p className="text-yellow-500 my-1">⭐⭐⭐⭐⭐</p>
                <p className="text-gray-600">{review.review}</p>
              </div>
            ))}
          </div>
        </div>
        
      </div>

      <NotificationModal 
        isOpen={isNotifOpen} 
        onClose={() => setIsNotifOpen(false)} 
        notifications={notifications}
      />
    </div>
  );
}

export default DashboardKantin;