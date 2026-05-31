import { useState, useEffect } from "react";
import { Bell, UserCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Topbar({ storeOpen, updateStoreStatus, onNotificationClick }) {
  const navigate = useNavigate();
  
  // State untuk menyimpan nama user, default-nya "Admin" kalau data kosong
  const [userName, setUserName] = useState("Admin");

  useEffect(() => {
    // Ambil data user yang sedang login
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    
    // Kalau datanya ada, set nama user
    if (currentUser && currentUser.name) {
      setUserName(currentUser.name);
    }
  }, []);

  return (
    <div className="bg-green-800 rounded-2xl p-5 shadow flex justify-between items-center mb-8">
      
      {/* info admin */}
      <div>
        <h1 className="text-2xl font-bold text-white">Welcome, {userName}!</h1>
        <p className="text-white">Dashboard Admin</p>
      </div>

      {/* menu kanan: status toko, notifikasi, dan profil */}
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-3 text-white">
          <p>{storeOpen ? "Toko Buka" : "Toko Tutup"}</p>

          <button
            onClick={updateStoreStatus}
            className={`w-16 h-8 rounded-full flex items-center px-1 transition-all ${
              storeOpen ? "bg-green-400 justify-end" : "bg-red-500 justify-start"
            }`}
          >
            <div className="w-6 h-6 bg-white rounded-full" />
          </button>
        </div>

        <button onClick={onNotificationClick}>
          <Bell size={24} color="white" className="cursor-pointer" />
        </button>

        <button onClick={() => navigate("/profile")}>
          <UserCircle size={34} color="white" className="cursor-pointer" />
        </button>
      </div>
      
    </div>
  );
}

export default Topbar;