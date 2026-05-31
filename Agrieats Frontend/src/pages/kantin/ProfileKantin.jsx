import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import api from "../../services/api";

import SidebarKantin from "../../components/kantin/SidebarKantin";
import TopbarKantin from "../../components/kantin/TopbarKantin";

function ProfileKantin() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  function handleLogout() {
    // Hapus sesi dari localStorage
    localStorage.removeItem("currentUser");
    localStorage.removeItem("token"); // Hapus token JWT jika ada
    navigate("/");
  }

  useEffect(() => {
    async function loadProfile() {
      try {
        // Tarik data asli dari backend
        const response = await api.get("/api/pengelola/me");
        setUser(response.data);
        
        // Update local storage untuk berjaga-jaga
        localStorage.setItem("currentUser", JSON.stringify(response.data));
      } catch (error) {
        console.error("Gagal mengambil data profil:", error);
        
        // Fallback ke localStorage jika gagal narik data dari server
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        if (currentUser) {
          setUser(currentUser);
        }
      } finally {
        setIsLoading(false);
      }
    }

    loadProfile();
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-[#F2F0F0] items-center justify-center">
        <p className="text-xl font-semibold text-gray-500">Memuat Profil...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen bg-[#F2F0F0] items-center justify-center">
        <p className="text-xl font-semibold text-red-500">Gagal memuat data pengguna.</p>
      </div>
    );
  }

  // Menyesuaikan dengan kolom di database PengelolaKantin
  const displayName = user.nama_pj_usaha || user.username || "";
  
  // Buat inisial untuk avatar dari nama
  const initials = displayName 
    ? displayName.substring(0, 2).toUpperCase() 
    : (user.email ? user.email.substring(0, 2).toUpperCase() : "UP");

  return (
    <div className="flex min-h-screen bg-[#F2F0F0]">
      <SidebarKantin />

      <div className="flex-1 ml-64 p-10">
        <TopbarKantin />

        <div className="bg-white rounded-3xl shadow p-10 animate-fade-in">
          {/* header profil */}
          <div className="flex items-center gap-8">
            <div className="w-40 h-40 rounded-full bg-[#3d603a] flex items-center justify-center text-5xl font-bold text-white shadow-md">
              {initials}
            </div>
            
            <div>
              <h1 className="text-4xl font-bold">{displayName}</h1>
              <p className="text-gray-500 mt-2 text-lg">{user.email}</p>
              <span className="inline-block mt-3 px-4 py-1 bg-green-100 text-green-800 font-semibold rounded-full text-sm">
                Pengelola Kantin
              </span>
            </div>
          </div>

          {/* grid data diri */}
          <div className="grid grid-cols-2 gap-8 mt-12">
            <div>
              <label className="font-semibold text-gray-700">Nama Penanggung Jawab</label>
              <input
                value={user.nama_pj_usaha || ""}
                readOnly
                className="w-full border p-4 rounded-xl mt-2 outline-none bg-gray-50 text-gray-600"
              />
            </div>

            <div>
              <label className="font-semibold text-gray-700">Username Login</label>
              <input
                value={user.username || ""}
                readOnly
                className="w-full border p-4 rounded-xl mt-2 outline-none bg-gray-50 text-gray-600"
              />
            </div>

            <div>
              <label className="font-semibold text-gray-700">Email Utama</label>
              <input
                value={user.email || ""}
                readOnly
                className="w-full border p-4 rounded-xl mt-2 outline-none bg-gray-50 text-gray-600"
              />
            </div>

            <div>
              <label className="font-semibold text-gray-700">Nomor Kontak</label>
              <input
                value={user.kontak_pengelola || ""}
                readOnly
                className="w-full border p-4 rounded-xl mt-2 outline-none bg-gray-50 text-gray-600"
              />
            </div>
          </div>

          {/* data kantin */}
          <div className="mt-8">
            <label className="font-semibold text-gray-700">Nama Unit Kantin Binaan</label>
            <input
              value={user.nama_u_kantin || ""}
              readOnly
              className="w-full border p-4 rounded-xl mt-2 outline-none bg-gray-50 text-gray-600 font-medium"
            />
          </div>

          {/* tombol logout */}
          <div className="mt-12 flex justify-end border-t pt-8">
            <button
              onClick={() => setShowLogoutModal(true)}
              className="bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 px-8 py-3 rounded-xl flex items-center gap-2 font-bold transition-all"
            >
              <LogOut size={20} />
              Keluar dari Sistem
            </button>
          </div>
        </div>
      </div>

      {/* modal konfirmasi logout */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-2xl p-8 w-[420px] shadow-2xl">
            <h2 className="text-2xl font-bold mb-2">Konfirmasi Keluar</h2>
            <p className="text-gray-500">Apakah Anda yakin ingin keluar dari akun sistem pengelola ini?</p>

            <div className="flex justify-end gap-3 mt-8">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-5 py-2.5 rounded-xl transition-all"
              >
                Batal
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold px-5 py-2.5 rounded-xl transition-all"
              >
                Ya, Keluar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfileKantin;