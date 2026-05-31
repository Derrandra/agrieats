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

import SidebarKantin from "../../components/kantin/SidebarKantin";
import TopbarKantin from "../../components/kantin/TopbarKantin";
import NotificationModal from "../../components/umkm/modal/NotificationModal";

function DashboardKantin() {
  const navigate = useNavigate();
  
  // State untuk status toko dan modal notifikasi
  const [storeOpen, setStoreOpen] = useState(true);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  // State untuk filter grafik & summary
  const [chartView, setChartView] = useState("daily"); 
  const [startDate, setStartDate] = useState("2026-01-01");
  const [endDate, setEndDate] = useState("2026-01-31");
  const [chartData, setChartData] = useState([]);
  
  // State untuk summary cards (Real-time)
  const [summaryData, setSummaryData] = useState({
    revenue: 0,
    totalSales: 0,
    topKantin: "Memuat...",
  });

  function updateStoreStatus() {
    setStoreOpen(!storeOpen);
  }

  // Effect mengambil data (Chart & Summary) setiap kali filter berubah
  useEffect(() => {
    fetchDashboardData();
  }, [chartView, startDate, endDate]);

  async function fetchDashboardData() {
    try {
      /* // TODO: KONEKSI BACKEND
      const chartResponse = await api.get("/kantin/sales-chart", {
        params: { view: chartView, start: startDate, end: endDate }
      });
      setChartData(chartResponse.data);

      const summaryResponse = await api.get("/kantin/summary", {
        params: { start: startDate, end: endDate }
      });
      setSummaryData(summaryResponse.data);
      */

      // FALLBACK DUMMY DATA SEMENTARA
      if (chartView === "daily") {
        setChartData([
          { name: "Senin", total: 450000 },
          { name: "Selasa", total: 300000 },
          { name: "Rabu", total: 550000 },
          { name: "Kamis", total: 400000 },
          { name: "Jumat", total: 700000 },
          { name: "Sabtu", total: 850000 },
          { name: "Minggu", total: 950000 },
        ]);
        setSummaryData({
          revenue: 12500000,
          totalSales: 1250,
          topKantin: "Risol GC",
        });
      } else {
        setChartData([
          { name: "Minggu 1", total: 2100000 },
          { name: "Minggu 2", total: 2400000 },
          { name: "Minggu 3", total: 2800000 },
          { name: "Minggu 4", total: 3200000 },
        ]);
        setSummaryData({
          revenue: 45500000,
          totalSales: 4320,
          topKantin: "Cireng BC",
        });
      }
    } catch (error) {
      console.error("Gagal mengambil data dashboard:", error);
    }
  }

  const notifications = [
    { id: 1, text: "UMKM Risol GC memperbarui menu" },
    { id: 2, text: "Kontrak Cireng BC akan segera habis" },
  ];

  const umkm = [
    {
      id: 1,
      name: "Risol GC",
      category: "Makanan Berat",
      image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
    },
    {
      id: 2,
      name: "Cireng BC",
      category: "Camilan",
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",
    },
    {
      id: 3,
      name: "Jus Andra",
      category: "Minuman",
      image: "https://images.unsplash.com/photo-1553531889-56cc480ac5cb",
    },
  ];

  const reviews = [
    {
      id: 1,
      customer: "Budi Santoso",
      rating: 5,
      review: "Makanan sangat enak dan pelayanan cepat",
    },
    {
      id: 2,
      customer: "Andi Wijaya",
      rating: 4,
      review: "Tempat nyaman dan bersih",
    },
    {
      id: 3,
      customer: "Siti Aminah",
      rating: 5,
      review: "Pilihan makanan lengkap",
    },
  ];

  return (
    <div className="flex min-h-screen bg-[#F2F0F0]">
      <SidebarKantin />
      
      <div className="flex-1 ml-64 p-10">
        <TopbarKantin onNotificationClick={() => setIsNotifOpen(true)} />

        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Hello, Admin!</h1>
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
            <p className="text-4xl font-bold text-green-700 mt-3">
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
            {umkm.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl p-4 shadow">
                <img src={item.image} alt={item.name} className="w-full h-40 object-cover rounded-xl" />
                <h2 className="font-bold mt-3 text-lg">{item.name}</h2>
                <p className="text-gray-500">{item.category}</p>
              </div>
            ))}

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
            <p className="text-gray-500 cursor-pointer hover:text-green-700 font-medium transition-colors">
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

      {/* Modal Notifikasi */}
      <NotificationModal 
        isOpen={isNotifOpen} 
        onClose={() => setIsNotifOpen(false)} 
        notifications={notifications}
      />
    </div>
  );
}

export default DashboardKantin;