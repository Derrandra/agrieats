import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Store,
  BarChart3,
  MessageSquare,
  User,
} from "lucide-react";

function SidebarKantin() {
  const navigate = useNavigate();
  const location = useLocation();

  const [locationName, setLocationName] = useState("Mencari lokasi...");

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          setLocationName(`Koordinat: ${lat.toFixed(3)}, ${lon.toFixed(3)}`);
        },
        () => {
          setLocationName("Akses lokasi ditolak");
        }
      );
    }
  }, []);

  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-green-800 text-white p-5">
      {/* LOGO */}
      <h1 className="text-3xl font-bold mb-2">AgriEats</h1>
      <p className="text-sm text-gray-300 mb-8">📍 {locationName}</p>

      {/* MENU */}
      <div className="space-y-3">
        
        {/* DASHBOARD */}
        <div
          onClick={() => navigate("/kantin/dashboard")}
          className={`flex items-center gap-3 cursor-pointer p-3 rounded-xl transition-all ${
            location.pathname === "/kantin/dashboard"
              ? "bg-white text-green-800"
              : "hover:bg-green-700"
          }`}
        >
          <LayoutDashboard size={20} />
          <p>Dashboard</p>
        </div>

        {/* UMKM */}
        <div
          onClick={() => navigate("/kantin/umkm")}
          className={`flex items-center gap-3 cursor-pointer p-3 rounded-xl transition-all ${
            location.pathname.includes("/kantin/umkm")
              ? "bg-white text-green-800"
              : "hover:bg-green-700"
          }`}
        >
          <Store size={20} />
          <p>Manajemen UMKM</p>
        </div>

        {/* REPORT */}
        <div
          onClick={() => navigate("/kantin/report")}
          className={`flex items-center gap-3 cursor-pointer p-3 rounded-xl transition-all ${
            location.pathname === "/kantin/report"
              ? "bg-white text-green-800"
              : "hover:bg-green-700"
          }`}
        >
          <BarChart3 size={20} />
          <p>Report</p>
        </div>

        {/* REVIEW */}
        <div
          onClick={() => navigate("/kantin/reviews")}
          className={`flex items-center gap-3 cursor-pointer p-3 rounded-xl transition-all ${
            location.pathname === "/kantin/reviews"
              ? "bg-white text-green-800"
              : "hover:bg-green-700"
          }`}
        >
          <MessageSquare size={20} />
          <p>Reviews</p>
        </div>

        {/* PROFILE */}
        <div
          onClick={() => navigate("/kantin/profile")}
          className={`flex items-center gap-3 cursor-pointer p-3 rounded-xl transition-all ${
            location.pathname === "/kantin/profile"
              ? "bg-white text-green-800"
              : "hover:bg-green-700"
          }`}
        >
          <User size={20} />
          <p>Profile</p>
        </div>

      </div>
    </div>
  );
}

export default SidebarKantin;