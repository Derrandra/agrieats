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
  
  // Filter rentang tanggal untuk kalender yang lebih interaktif
  const [startDate, setStartDate] = useState("2026-05-01");
  const [endDate, setEndDate] = useState("2026-05-31");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchReportData();
  }, [startDate, endDate]); // Otomatis fetch ulang jika tanggal berubah

  async function fetchReportData() {
    setIsLoading(true);
    try {
      /* // TODO: KONEKSI BACKEND
      const response = await api.get("/kantin/report", {
        params: { start: startDate, end: endDate }
      });
      
      setReportData(response.data.details);
      setSummary({
        totalRevenue: response.data.summary.totalRevenue,
        totalTransactions: response.data.summary.totalTransactions,
        topUmkm: response.data.summary.topUmkm
      });
      */

      // JIKA BACKEND BELUM SIAP
      throw new Error("Backend belum siap");
      
    } catch (error) {
      console.log("Menggunakan fallback data dummy laporan:", error);
      
      // Dummy Data Laporan
      const dummyData = [
        { id: 1, name: "Risol GC", transactions: 450, revenue: 6500000 },
        { id: 2, name: "Cireng BC", transactions: 320, revenue: 4800000 },
        { id: 3, name: "Jus Andra", transactions: 210, revenue: 3150000 },
        { id: 4, name: "Ayam Geprek", transactions: 510, revenue: 10200000 },
      ];
      
      setReportData(dummyData);

      // Kalkulasi manual untuk data dummy
      const totalRev = dummyData.reduce((acc, curr) => acc + curr.revenue, 0);
      const totalTrans = dummyData.reduce((acc, curr) => acc + curr.transactions, 0);
      const top = dummyData.reduce((prev, current) => (prev.revenue > current.revenue) ? prev : current);

      setSummary({ totalRevenue: totalRev, totalTransactions: totalTrans, topUmkm: top.name });
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

    // Membuat Header CSV
    const headers = ["Nama UMKM", "Total Transaksi", "Total Pendapatan (Rp)", "Status Setoran"];
    
    // Memetakan data menjadi baris teks CSV
    const csvRows = reportData.map(item => {
      return `${item.name},${item.transactions},${item.revenue},Selesai`;
    });

    // Menggabungkan header dan baris dengan newline
    const csvString = [headers.join(","), ...csvRows].join("\n");
    
    // Membuat Blob file CSV
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    
    // Membuat tag anchor virtual untuk memicu download
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Laporan_AgriEats_${startDate}_sd_${endDate}.csv`);
    document.body.appendChild(link);
    link.click();
    
    // Membersihkan DOM
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex min-h-screen bg-[#F2F0F0]">
      <SidebarKantin />
      <div className="flex-1 ml-64 p-10">
        <TopbarKantin />

        {/* HEADER */}
        <div className="flex justify-between items-center mb-8 border-b-2 border-gray-300 pb-4">
          <div>
            <h1 className="text-3xl font-bold uppercase">Laporan Penjualan</h1>
            <p className="text-gray-500 mt-1">Pantau performa keuangan seluruh mitra UMKM</p>
          </div>
          <button 
            onClick={handleDownload}
            className="bg-green-700 hover:bg-green-800 text-white px-6 py-3 rounded-xl flex items-center gap-2 font-bold transition-all shadow-sm"
          >
            <Download size={20} />
            Export Laporan
          </button>
        </div>

        {/* FILTER KALENDER */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200 mb-8 flex items-center gap-6">
          <div className="flex items-center gap-3">
            <Calendar size={24} className="text-gray-500" />
            <p className="font-semibold text-gray-700">Filter Periode:</p>
          </div>
          
          <div className="flex items-center gap-3">
            <input 
              type="date" 
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-green-700 font-medium text-gray-700 cursor-pointer" 
            />
            <span className="text-gray-400 font-medium">s/d</span>
            <input 
              type="date" 
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-green-700 font-medium text-gray-700 cursor-pointer" 
            />
          </div>

          {isLoading && <span className="text-gray-400 text-sm italic ml-4">Memuat data...</span>}
        </div>

        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <h2 className="text-gray-500 font-semibold mb-2">Total Pendapatan</h2>
            <p className="text-3xl font-bold text-green-700">Rp {summary.totalRevenue.toLocaleString("id-ID")}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <h2 className="text-gray-500 font-semibold mb-2">Total Transaksi Selesai</h2>
            <p className="text-3xl font-bold text-green-700">{summary.totalTransactions}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <h2 className="text-gray-500 font-semibold mb-2">UMKM Penjualan Tertinggi</h2>
            <p className="text-3xl font-bold text-green-700">{summary.topUmkm}</p>
          </div>
        </div>

        {/* CHART */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 h-[400px] mb-8">
          <h2 className="font-bold text-xl mb-6">Perbandingan Pendapatan UMKM</h2>
          <ResponsiveContainer width="100%" height="85%">
            <BarChart data={reportData} margin={{ top: 10, right: 30, left: 20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tickMargin={10} />
              <YAxis tickFormatter={(val) => `Rp ${val / 1000000}M`} axisLine={false} tickLine={false} />
              <Tooltip formatter={(value) => `Rp ${value.toLocaleString("id-ID")}`} cursor={{ fill: '#f3f4f6' }} />
              <Bar dataKey="revenue" fill="#15803d" radius={[6, 6, 0, 0]} barSize={50} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gray-50 p-5 border-b border-gray-200">
            <h2 className="font-bold text-xl">Rincian Pendapatan per UMKM</h2>
          </div>
          <div className="grid grid-cols-4 bg-green-700 text-white p-4 font-semibold text-center">
            <p>Nama UMKM</p>
            <p>Total Transaksi</p>
            <p>Total Pendapatan</p>
            <p>Status Setoran</p>
          </div>
          {reportData.map((item) => (
            <div key={item.id} className="grid grid-cols-4 items-center p-4 border-b border-gray-100 hover:bg-gray-50 text-center text-gray-700 font-medium">
              <p className="font-bold">{item.name}</p>
              <p>{item.transactions} Pesanan</p>
              <p className="text-green-700 font-bold">Rp {item.revenue.toLocaleString("id-ID")}</p>
              <div>
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-md text-sm border border-green-200">Selesai</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default ReportKantin;