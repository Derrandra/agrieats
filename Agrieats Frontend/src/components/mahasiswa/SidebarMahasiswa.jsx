import { useLocation, useNavigate } from "react-router-dom";
import { Home, FileText, Clock, User, LayoutGrid, Store } from "lucide-react";

function SidebarMahasiswa() {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { name: "Home", icon: <Home size={20} />, path: "/home" },
    { name: "Katalog UMKM", icon: <Store size={20} />, path: "/katalog-umkm" },
    { name: "Katalog Menu", icon: <LayoutGrid size={20} />, path: "/katalog-menu" },
    { name: "Order", icon: <FileText size={20} />, path: "/order" },
    { name: "History", icon: <Clock size={20} />, path: "/history" },
    { name: "Profile", icon: <User size={20} />, path: "/profile-mahasiswa" },
  ];

  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-green-800 text-white p-5 z-50">
      {/* logo */}
      <h1 className="text-3xl font-bold mb-2">AgriEats</h1>
      <p className="text-sm text-gray-300 mb-8">Student Portal</p>

      {/* list menu */}
      <div className="space-y-3">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <div
              key={item.name}
              onClick={() => navigate(item.path)}
              className={`flex items-center gap-3 cursor-pointer p-3 rounded-xl transition-all ${
                isActive
                  ? "bg-white text-green-800"
                  : "hover:bg-green-700"
              }`}
            >
              {item.icon}
              <p>{item.name}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default SidebarMahasiswa;