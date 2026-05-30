import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, ShoppingBag, ClipboardList, User } from "lucide-react";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  // state buat nampilin status lokasi
  const [locationName, setLocationName] = useState("Mencari lokasi...");

  // ambil koordinat user pas sidebar dirender
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;

          // TODO: nanti diganti jadi hit API backend buat reverse geocoding
          // api.post("/location", { lat, lon })
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
      {/* logo */}
      <h1 className="text-3xl font-bold mb-2">AgriEats</h1>
      <p className="text-sm text-gray-300 mb-8">📍 {locationName}</p>

      {/* list menu */}
      <div className="space-y-3">
        <div
          onClick={() =>
            navigate("/dashboard")
          }

          className={`flex items-center gap-3 cursor-pointer p-3 rounded-xl
            ${
              location.pathname === "/dashboard"
              ? "bg-green-700"
              : "hover:bg-green-700"
            }
          `}
        >

          <LayoutDashboard size={20} /> <p>Dashboard</p> </div>

        <div
          onClick={() => navigate("/menu")}
          className={`flex items-center gap-3 cursor-pointer p-3 rounded-xl transition-all ${
            location.pathname === "/menu" ? "bg-white text-green-800" : "hover:bg-green-700"
          }`}
        >
          <ShoppingBag size={20} />
          <p>Menu</p>
        </div>

        <div
          onClick={() => navigate("/orders")}
          className={`flex items-center gap-3 cursor-pointer p-3 rounded-xl transition-all ${
            location.pathname === "/orders" ? "bg-white text-green-800" : "hover:bg-green-700"
          }`}
        >
          <ClipboardList size={20} />
          <p>Orders</p>
        </div>

        <div 
          onClick={() => navigate("/profile")}
          className="flex items-center gap-3 cursor-pointer p-3 rounded-xl hover:bg-green-700 transition-all">
          <User size={20} />
          <p>Profile</p>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;