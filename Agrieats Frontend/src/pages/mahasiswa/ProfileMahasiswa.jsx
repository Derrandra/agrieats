import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, BookOpen, Phone, Shield, ChevronRight, LogOut, X, Save, KeyRound } from "lucide-react";
import api from "../../services/api";

import SidebarMahasiswa from "../../components/mahasiswa/SidebarMahasiswa";
import TopbarMahasiswa from "../../components/mahasiswa/TopbarMahasiswa";

function ProfileMahasiswa() {
  const navigate = useNavigate();
  
  const [userProfile, setUserProfile] = useState({
    name: "Memuat...",
    nim: "-",
    email: "-",
    phone: "-"
  });

  // State untuk Modal Edit Profil
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", email: "", phone: "" });
  const [isSaving, setIsSaving] = useState(false);

  // State untuk Modal Edit Password
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const response = await api.get("/api/mahasiswa/me");
      const data = response.data;
      
      setUserProfile({
        name: data.username || data.nama_mahasiswa || "Mahasiswa",
        nim: data.nim || data.id_akun || "-",
        email: data.email || "-",
        phone: data.telepon || "-"
      });
    } catch (error) {
      console.error("Gagal memuat profil dari API:", error);
      
      const savedAccount = JSON.parse(localStorage.getItem("currentUser"));
      if (savedAccount) {
        setUserProfile({
          name: savedAccount.username || savedAccount.nama_mahasiswa || "Mahasiswa",
          nim: savedAccount.nim || savedAccount.id_akun || "-",
          email: savedAccount.email || "-",
          phone: savedAccount.telepon || "-"
        });
      } else {
        setUserProfile({
          name: "Pengguna Tidak Dikenal",
          nim: "-",
          email: "-",
          phone: "-"
        });
      }
    }
  };

  const handleLogout = () => {
    const confirmLogout = window.confirm("Apakah kamu yakin ingin keluar dari Agrieats?");
    if (confirmLogout) {
      localStorage.removeItem("access_token"); 
      localStorage.removeItem("token"); 
      localStorage.removeItem("currentUser");
      
      alert("Berhasil logout!");
      navigate("/"); 
    }
  };

  // Fungsi untuk membuka modal Edit Profil
  const openEditModal = () => {
    setEditForm({
      name: userProfile.name,
      email: userProfile.email,
      phone: userProfile.phone
    });
    setIsEditModalOpen(true);
  };

  // Fungsi untuk menyimpan perubahan Profil
  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      const payload = {
        username: editForm.name,
        email: editForm.email,
        telepon: editForm.phone
      };

      await api.put("/api/mahasiswa/me", payload);

      setUserProfile(prev => ({
        ...prev,
        name: editForm.name,
        email: editForm.email,
        phone: editForm.phone
      }));

      const currentUser = JSON.parse(localStorage.getItem("currentUser")) || {};
      localStorage.setItem("currentUser", JSON.stringify({
        ...currentUser,
        username: editForm.name,
        email: editForm.email,
        telepon: editForm.phone
      }));

      alert("Profil berhasil diperbarui!");
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Gagal menyimpan profil:", error);
      alert(error.response?.data?.detail || "Terjadi kesalahan saat memperbarui profil.");
    } finally {
      setIsSaving(false);
    }
  };

  // Fungsi untuk menyimpan perubahan Password
  const handleUpdatePassword = async () => {
    if (!passwordForm.oldPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      alert("Harap isi semua kolom kata sandi!");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("Kata sandi baru dan konfirmasi tidak cocok!");
      return;
    }

    setIsUpdatingPassword(true);
    try {
      const payload = {
        old_password: passwordForm.oldPassword,
        new_password: passwordForm.newPassword
      };

      await api.put("/api/mahasiswa/password", payload);

      alert("Kata sandi berhasil diperbarui!");
      setIsPasswordModalOpen(false);
      setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" }); // Reset form
    } catch (error) {
      console.error("Gagal memperbarui kata sandi:", error);
      alert(error.response?.data?.detail || "Kata sandi lama salah atau terjadi kesalahan.");
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const namaDepan = userProfile.name !== "Memuat..." && userProfile.name !== "Pengguna Tidak Dikenal" 
    ? userProfile.name.split(" ")[0] 
    : "Mahasiswa";

  return (
    <div className="flex min-h-screen bg-[#F2F0F0] font-sans relative">
      <SidebarMahasiswa />

      <div className="flex-1 ml-64 p-10 overflow-hidden">
        <TopbarMahasiswa namaUser={namaDepan} />

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Profil Pengguna</h1>
          <p className="text-gray-500 font-medium mt-1">Kelola informasi akun Anda</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
          
          {/* KARTU PROFIL UTAMA (KIRI) */}
          <div className="xl:col-span-1 bg-white p-8 rounded-3xl shadow-sm border border-gray-200 flex flex-col items-center text-center">
            <div className="w-32 h-32 bg-[#15803d]/10 text-[#15803d] rounded-full flex items-center justify-center font-bold text-4xl mb-4 border-2 border-[#15803d]/20 shadow-inner uppercase">
              {userProfile.name !== "Memuat..." ? userProfile.name.substring(0, 2) : "??"}
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-1">{userProfile.name}</h2>
            <p className="text-sm font-semibold text-[#15803d] bg-green-50 px-3 py-1 rounded-full mb-6 border border-green-100">
              Akun Mahasiswa
            </p>

            <div className="w-full border-t border-gray-100 pt-6 flex flex-col gap-4 text-left text-sm text-gray-600">
              <div className="flex items-center gap-3">
                <BookOpen size={18} className="text-gray-400 shrink-0" />
                <div>
                  <p className="text-xs text-gray-400 font-medium">NIM</p>
                  <p className="font-semibold text-gray-700">{userProfile.nim}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-gray-400 shrink-0" />
                <div>
                  <p className="text-xs text-gray-400 font-medium">Email</p>
                  <p className="font-semibold text-gray-700">{userProfile.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={18} className="text-gray-400 shrink-0" />
                <div>
                  <p className="text-xs text-gray-400 font-medium">No. Telepon / WhatsApp</p>
                  <p className="font-semibold text-gray-700">{userProfile.phone}</p>
                </div>
              </div>
            </div>
          </div>

          {/* DETAIL PENGATURAN (KANAN) */}
          <div className="xl:col-span-2 flex flex-col gap-6">

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Shield size={20} className="text-[#15803d]" /> Pengaturan Akun
              </h3>
              <div className="flex flex-col">
                <button 
                  onClick={openEditModal}
                  className="flex items-center justify-between py-4 border-b border-gray-100 text-left hover:text-[#15803d] transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <User size={18} className="text-gray-400 group-hover:text-[#15803d]" />
                    <div>
                      <p className="text-sm font-bold text-gray-700">Edit Profil</p>
                      <p className="text-xs text-gray-400">Perbarui nama, email, atau nomor telepon</p>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-gray-400" />
                </button>
                
                {/* Tombol yang akan membuka modal Perbarui Kata Sandi */}
                <button 
                  onClick={() => setIsPasswordModalOpen(true)}
                  className="flex items-center justify-between py-4 border-b border-gray-100 text-left hover:text-[#15803d] transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <Shield size={18} className="text-gray-400 group-hover:text-[#15803d]" />
                    <div>
                      <p className="text-sm font-bold text-gray-700">Perbarui Kata Sandi</p>
                      <p className="text-xs text-gray-400">Ganti password akun kamu secara berkala</p>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-gray-400" />
                </button>
              </div>
            </div>

            {/* Tombol Logout */}
            <button 
              onClick={handleLogout}
              className="mt-4 bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 py-4 rounded-2xl font-bold text-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <LogOut size={20} />
              Keluar (Logout)
            </button>

          </div>
        </div>
      </div>

      {/* MODAL EDIT PROFIL */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">Edit Profil</h2>
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-400 hover:text-red-500 transition-colors bg-gray-50 hover:bg-red-50 p-2 rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 flex flex-col gap-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">NIM (Tidak dapat diubah)</label>
                <input 
                  type="text" 
                  value={userProfile.nim}
                  disabled
                  className="w-full bg-gray-100 border border-gray-200 rounded-xl p-3 text-gray-500 font-medium cursor-not-allowed"
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Nama Lengkap</label>
                <input 
                  type="text" 
                  value={editForm.name}
                  onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                  placeholder="Masukkan nama lengkap"
                  className="w-full bg-white border border-gray-300 rounded-xl p-3 text-gray-800 outline-none focus:border-[#15803d] focus:ring-1 focus:ring-[#15803d] transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
                <input 
                  type="email" 
                  value={editForm.email}
                  onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                  placeholder="contoh@apps.ipb.ac.id"
                  className="w-full bg-white border border-gray-300 rounded-xl p-3 text-gray-800 outline-none focus:border-[#15803d] focus:ring-1 focus:ring-[#15803d] transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">No. Telepon / WhatsApp</label>
                <input 
                  type="text" 
                  value={editForm.phone}
                  onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                  placeholder="081234567890"
                  className="w-full bg-white border border-gray-300 rounded-xl p-3 text-gray-800 outline-none focus:border-[#15803d] focus:ring-1 focus:ring-[#15803d] transition-all"
                />
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 flex gap-3">
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors"
              >
                Batal
              </button>
              <button 
                onClick={handleSaveProfile}
                disabled={isSaving}
                className="flex-1 py-3 bg-[#15803d] text-white font-bold rounded-xl hover:bg-green-800 transition-colors flex justify-center items-center gap-2 shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isSaving ? "Menyimpan..." : <><Save size={18} /> Simpan</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL PERBARUI KATA SANDI */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">Perbarui Kata Sandi</h2>
              <button 
                onClick={() => setIsPasswordModalOpen(false)}
                className="text-gray-400 hover:text-red-500 transition-colors bg-gray-50 hover:bg-red-50 p-2 rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 flex flex-col gap-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Kata Sandi Saat Ini</label>
                <input 
                  type="password" 
                  value={passwordForm.oldPassword}
                  onChange={(e) => setPasswordForm({...passwordForm, oldPassword: e.target.value})}
                  placeholder="Masukkan kata sandi lama"
                  className="w-full bg-white border border-gray-300 rounded-xl p-3 text-gray-800 outline-none focus:border-[#15803d] focus:ring-1 focus:ring-[#15803d] transition-all"
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Kata Sandi Baru</label>
                <input 
                  type="password" 
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                  placeholder="Buat kata sandi baru"
                  className="w-full bg-white border border-gray-300 rounded-xl p-3 text-gray-800 outline-none focus:border-[#15803d] focus:ring-1 focus:ring-[#15803d] transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Konfirmasi Kata Sandi Baru</label>
                <input 
                  type="password" 
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                  placeholder="Ulangi kata sandi baru"
                  className="w-full bg-white border border-gray-300 rounded-xl p-3 text-gray-800 outline-none focus:border-[#15803d] focus:ring-1 focus:ring-[#15803d] transition-all"
                />
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 flex gap-3">
              <button 
                onClick={() => {
                  setIsPasswordModalOpen(false);
                  setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" }); // Reset form saat batal
                }}
                className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors"
              >
                Batal
              </button>
              <button 
                onClick={handleUpdatePassword}
                disabled={isUpdatingPassword}
                className="flex-1 py-3 bg-[#15803d] text-white font-bold rounded-xl hover:bg-green-800 transition-colors flex justify-center items-center gap-2 shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isUpdatingPassword ? "Menyimpan..." : <><KeyRound size={18} /> Simpan Sandi</>}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default ProfileMahasiswa;