import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Edit2, Save, X } from "lucide-react";
import api from "../../services/api";

import SidebarKantin from "../../components/kantin/SidebarKantin";
import TopbarKantin from "../../components/kantin/TopbarKantin";

function ProfileKantin() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // State untuk mode edit
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    nama_pj_usaha: "",
    kontak_pengelola: ""
  });

  function handleLogout() {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("token");
    localStorage.removeItem("peran");
    navigate("/");
  }

  async function loadProfile() {
    try {
      const response = await api.get("/api/pengelola/me");
      setUser(response.data);
      // Inisialisasi data form saat data berhasil ditarik
      setFormData({
        nama_pj_usaha: response.data.nama_pj_usaha || "",
        kontak_pengelola: response.data.kontak_pengelola || ""
      });
      localStorage.setItem("currentUser", JSON.stringify(response.data));
    } catch (error) {
      console.error("Gagal mengambil data profil:", error);
      const currentUser = JSON.parse(localStorage.getItem("currentUser"));
      if (currentUser) {
        setUser(currentUser);
        setFormData({
          nama_pj_usaha: currentUser.nama_pj_usaha || "",
          kontak_pengelola: currentUser.kontak_pengelola || ""
        });
      }
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadProfile();
  }, []);

  // Fungsi untuk menyimpan perubahan ke backend
  async function handleSave() {
    setIsSaving(true);
    try {
      await api.put("/api/pengelola/me", formData);
      alert("Profil berhasil diperbarui!");
      setIsEditing(false);
      loadProfile(); // Refresh data dari server
    } catch (error) {
      console.error("Gagal menyimpan profil:", error);
      alert(error.response?.data?.detail || "Gagal menyimpan perubahan profil.");
    } finally {
      setIsSaving(false);
    }
  }

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

  const displayName = user.nama_pj_usaha || user.username || "";
  const initials = displayName 
    ? displayName.substring(0, 2).toUpperCase() 
    : (user.email ? user.email.substring(0, 2).toUpperCase() : "UP");

  return (
    <div className="flex min-h-screen bg-[#F2F0F0]">
      <SidebarKantin />

      <div className="flex-1 ml-64 p-10">
        <TopbarKantin />

        <div className="bg-white rounded-3xl shadow p-10 animate-fade-in">
          {/* Header Profil */}
          <div className="flex items-center justify-between border-b pb-8">
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

            {/* Tombol Edit / Aksi */}
            <div>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-bold transition-all"
                >
                  <Edit2 size={20} />
                  Edit Profil
                </button>
              ) : (
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      // Kembalikan form ke data asli jika batal
                      setFormData({
                        nama_pj_usaha: user.nama_pj_usaha || "",
                        kontak_pengelola: user.kontak_pengelola || ""
                      });
                    }}
                    className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 px-6 py-3 rounded-xl font-bold transition-all"
                  >
                    <X size={20} />
                    Batal
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-bold transition-all disabled:opacity-70"
                  >
                    <Save size={20} />
                    {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Grid Data Diri */}
          <div className="grid grid-cols-2 gap-8 mt-12">
            <div>
              <label className="font-semibold text-gray-700">Nama Penanggung Jawab</label>
              <input
                value={isEditing ? formData.nama_pj_usaha : (user.nama_pj_usaha || "")}
                onChange={(e) => setFormData({...formData, nama_pj_usaha: e.target.value})}
                readOnly={!isEditing}
                className={`w-full border p-4 rounded-xl mt-2 outline-none transition-all ${isEditing ? 'bg-white border-green-500 focus:ring-2 focus:ring-green-200' : 'bg-gray-50 text-gray-600'}`}
              />
            </div>

            <div>
              <label className="font-semibold text-gray-700">Nomor Kontak</label>
              <input
                value={isEditing ? formData.kontak_pengelola : (user.kontak_pengelola || "")}
                onChange={(e) => setFormData({...formData, kontak_pengelola: e.target.value})}
                readOnly={!isEditing}
                className={`w-full border p-4 rounded-xl mt-2 outline-none transition-all ${isEditing ? 'bg-white border-green-500 focus:ring-2 focus:ring-green-200' : 'bg-gray-50 text-gray-600'}`}
              />
            </div>

            {/* Username & Email dibiarkan readonly karena untuk keamanan login */}
            <div>
              <label className="font-semibold text-gray-700 flex items-center justify-between">
                Username Login <span className="text-xs text-gray-400 font-normal">*Tidak dapat diubah</span>
              </label>
              <input
                value={user.username || ""}
                readOnly
                className="w-full border p-4 rounded-xl mt-2 outline-none bg-gray-100 text-gray-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="font-semibold text-gray-700 flex items-center justify-between">
                Email Utama <span className="text-xs text-gray-400 font-normal">*Tidak dapat diubah</span>
              </label>
              <input
                value={user.email || ""}
                readOnly
                className="w-full border p-4 rounded-xl mt-2 outline-none bg-gray-100 text-gray-500 cursor-not-allowed"
              />
            </div>
          </div>

          {/* Data Kantin */}
          <div className="mt-8">
            <label className="font-semibold text-gray-700 flex items-center justify-between">
              Nama Unit Kantin Binaan <span className="text-xs text-gray-400 font-normal">*Hubungi Superadmin untuk merubah unit</span>
            </label>
            <input
              value={user.nama_u_kantin || ""}
              readOnly
              className="w-full border p-4 rounded-xl mt-2 outline-none bg-gray-100 text-gray-600 font-medium cursor-not-allowed"
            />
          </div>

          {/* Tombol Logout (Sembunyikan saat mode edit agar fokus) */}
          {!isEditing && (
            <div className="mt-12 flex justify-end border-t pt-8">
              <button
                onClick={() => setShowLogoutModal(true)}
                className="bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 px-8 py-3 rounded-xl flex items-center gap-2 font-bold transition-all"
              >
                <LogOut size={20} />
                Keluar dari Sistem
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal Konfirmasi Logout */}
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