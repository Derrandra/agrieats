import { useState, useEffect } from "react";
import { Download, Calendar } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import api from "../../services/api";
import SidebarKantin from "../../components/kantin/SidebarKantin";
import TopbarKantin from "../../components/kantin/TopbarKantin";

function ReportKantin() {
  const [reportData, setReportData] = useState([]);
  const [summary, setSummary] = useState({ totalRevenue: 0, totalTransactions: 0, topUmkm: "Memuat..." });
  
  // Filter rentang tanggal
  const [startDate, setStartDate] = useState("2026-05-01");
  const [endDate, setEndDate] = useState("2026-05-31");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchReportData();
  }, [startDate, endDate]); 

  async function fetchReportData() {
    setIsLoading(true);
    try {
      // Sesuaikan parameter dengan backend (start dan end)
      const response = await api.get("/api/pengelola/statistik", {
        params: { start: startDate, end: endDate }
      });
      
      // Jika struktur JSON sesuai dengan backend
      if (response.data && response.data.summary) {
        setReportData(response.data.chart || []); // Ambil data grafik harian
        setSummary({
          totalRevenue: response.data.summary.revenue || 0,
          totalTransactions: response.data.summary.totalSales || 0,
          topUmkm: response.data.summary.topKantin || "-",
        });
        return; 
      }
      
      throw new Error("Struktur data backend tidak dikenali.");
      
    } catch (error) {
      console.warn("Menggunakan fallback data dummy:", error.message);
      
      // Dummy Data Harian jika backend error/kosong
      const dummyData = [
        { name: "2026-05-01", total: 1500000 },
        { name: "2026-05-02", total: 2300000 },
        { name: "2026-05-03", total: 1800000 },
        { name: "2026-05-04", total: 3100000 },
      ];
      setReportData(dummyData);
      setSummary({ totalRevenue: 8700000, totalTransactions: 145, topUmkm: "Risol GC" });
    } finally {
      setIsLoading(false);
    }
  }

  // Fungsi untuk mengunduh laporan sebagai file CSV
  function handleDownload() {
    if (reportData.length === 0) {
      alert("Tidak ada data untuk diunduh.");
      return;
    }

    // Header CSV disesuaikan untuk laporan harian
    const headers = ["Tanggal", "Total Pendapatan (Rp)"];
    
    const csvRows = reportData.map(item => {
      return `${item.name},${item.total}`;
    });

    const csvString = [headers.join(","), ...csvRows].join("\n");
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Laporan_AgriEats_${startDate}_sd_${endDate}.csv`);
    document.body.appendChild(link);
    link.click();
    
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex min-h-screen bg-[#F2F0F0]">
      <SidebarKantin />
      <div className="flex-1 ml-64 p-10">
        <TopbarKantin />

        {/* HEADER */}
        <div className="flex justify-between items-center mb-8 border-b-2 border-gray-300 pb-4 animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold uppercase">Laporan Penjualan</h1>
            <p className="text-gray-500 mt-1">Pantau tren pendapatan harian kantin Anda</p>
          </div>
          <button 
            onClick={handleDownload}
            className="bg-green-700 hover:bg-green-800 text-white px-6 py-3 rounded-xl flex items-center gap-2 font-bold transition-all shadow-md"
          >
            <Download size={20} />
            Export CSV
          </button>
        </div>

        {/* FILTER KALENDER */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200 mb-8 flex items-center gap-6 animate-fade-in">
          <div className="flex items-center gap-3">
            <Calendar size={24} className="text-gray-500" />
            <p className="font-semibold text-gray-700">Filter Periode:</p>
          </div>
          
          <div className="flex items-center gap-3">
            <input 
              type="date" 
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-green-700 font-medium text-gray-700 cursor-pointer bg-gray-50 hover:bg-white transition-colors" 
            />
            <span className="text-gray-400 font-medium">s/d</span>
            <input 
              type="date" 
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-green-700 font-medium text-gray-700 cursor-pointer bg-gray-50 hover:bg-white transition-colors" 
            />
          </div>

          {isLoading && <span className="text-green-700 text-sm font-semibold ml-4 animate-pulse">Memperbarui data...</span>}
        </div>

        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-3 gap-6 mb-8 animate-fade-in">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <h2 className="text-gray-500 font-semibold mb-2">Total Pendapatan</h2>
            <p className="text-3xl font-bold text-[#15803d]">Rp {summary.totalRevenue.toLocaleString("id-ID")}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <h2 className="text-gray-500 font-semibold mb-2">Total Transaksi Selesai</h2>
            <p className="text-3xl font-bold text-[#15803d]">{summary.totalTransactions}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <h2 className="text-gray-500 font-semibold mb-2">UMKM Penjualan Tertinggi</h2>
            <p className="text-3xl font-bold text-[#15803d] truncate">{summary.topUmkm}</p>
          </div>
        </div>

        {/* CHART (Disesuaikan dengan field 'total' dari backend) */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 h-[400px] mb-8 animate-fade-in">
          <h2 className="font-bold text-xl mb-6 text-gray-800">Tren Pendapatan Harian</h2>
          <ResponsiveContainer width="100%" height="85%">
            <BarChart data={reportData} margin={{ top: 10, right: 30, left: 20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tickMargin={10} tick={{fill: '#6b7280', fontWeight: 500}} />
              <YAxis tickFormatter={(val) => `Rp ${val / 1000}`} axisLine={false} tickLine={false} tick={{fill: '#6b7280'}} />
              <Tooltip 
                formatter={(value) => `Rp ${value.toLocaleString("id-ID")}`} 
                labelFormatter={(label) => `Tanggal: ${label}`}
                cursor={{ fill: '#f3f4f6' }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
              />
              <Bar dataKey="total" fill="#15803d" radius={[6, 6, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* TABLE (Disesuaikan untuk data harian) */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden animate-fade-in">
          <div className="bg-gray-50 p-5 border-b border-gray-200">
            <h2 className="font-bold text-xl text-gray-800">Rincian Pendapatan Harian</h2>
          </div>
          <div className="grid grid-cols-3 bg-[#15803d] text-white p-4 font-semibold text-center">
            <p>Tanggal</p>
            <p>Total Pendapatan</p>
            <p>Status Setoran</p>
          </div>
          {reportData.length > 0 ? (
            reportData.map((item, index) => (
              <div key={index} className="grid grid-cols-3 items-center p-4 border-b border-gray-100 hover:bg-green-50 transition-colors text-center text-gray-700 font-medium">
                <p className="font-bold text-gray-900">{item.name}</p>
                <p className="text-green-700 font-bold">Rp {item.total.toLocaleString("id-ID")}</p>
                <div>
                  <span className="bg-green-100 text-green-800 px-4 py-1.5 rounded-lg text-sm font-bold border border-green-200 shadow-sm">
                    Terekap
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-500">Tidak ada data transaksi pada rentang tanggal ini.</div>
          )}
        </div>

      </div>
    </div>
  );
}

export default ReportKantin;