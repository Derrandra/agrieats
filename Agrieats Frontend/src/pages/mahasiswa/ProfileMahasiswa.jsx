import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, BookOpen, Phone, Shield, ChevronRight, LogOut } from "lucide-react";
import api from "../../services/api";

import SidebarMahasiswa from "../../components/mahasiswa/SidebarMahasiswa";
import TopbarMahasiswa from "../../components/mahasiswa/TopbarMahasiswa";

function ProfileMahasiswa() {
  const navigate = useNavigate();
  
  // State awal disesuaikan dengan field dasar dari tabel database / form register
  const [userProfile, setUserProfile] = useState({
    name: "Memuat...",
    nim: "-",
    email: "-",
    phone: "-"
  });

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      // TODO: [BACKEND INTEGRATION] Fetch data dari API database 
      // const response = await api.get("/users/profile");
      // setUserProfile(response.data);

      // Simulasi menarik data dari session/localStorage (biasanya di-set saat Login/Register)
      const savedAccount = JSON.parse(localStorage.getItem("user_account"));
      
      if (savedAccount) {
        setUserProfile({
          name: savedAccount.name || savedAccount.namaLengkap || "Pengguna",
          nim: savedAccount.nim || "-",
          email: savedAccount.email || "-",
          phone: savedAccount.phone || savedAccount.noHp || "-"
        });
      } else {
        // Fallback default jika belum ada data login/register (agar UI tidak kosong saat presentasi)
        setUserProfile({
          name: "Luthfi Muharram",
          nim: "G6401231001",
          email: "luthfi_muharram@apps.ipb.ac.id",
          phone: "081234567890"
        });
      }
    } catch (error) {
      console.error("Gagal memuat profil:", error);
    }
  };

  const handleLogout = () => {
    const confirmLogout = window.confirm("Apakah kamu yakin ingin keluar?");
    if (confirmLogout) {
      // Hapus sesi / token login
      // localStorage.removeItem("user_account");
      alert("Berhasil logout!");
      navigate("/"); // Arahkan kembali ke halaman login (sesuaikan rutenya)
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F2F0F0] font-sans">
      <SidebarMahasiswa />

      <div className="flex-1 ml-64 p-10 overflow-hidden">
        {/* Topbar namaUser diambil secara dinamis hanya nama depannya saja */}
        <TopbarMahasiswa namaUser={userProfile.name.split(" ")[0]} />

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Profil Pengguna</h1>
          <p className="text-gray-500 font-medium mt-1">Kelola informasi akun Anda</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
          
          {/* KARTU PROFIL UTAMA (KIRI) */}
          <div className="xl:col-span-1 bg-white p-8 rounded-3xl shadow-sm border border-gray-200 flex flex-col items-center text-center">
            <div className="w-32 h-32 bg-[#15803d]/10 text-[#15803d] rounded-full flex items-center justify-center font-bold text-4xl mb-4 border-2 border-[#15803d]/20 shadow-inner uppercase">
              {/* Mengambil 2 huruf pertama dari nama untuk Avatar */}
              {userProfile.name.substring(0, 2)}
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

            {/* Pengaturan Akun & Keamanan */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Shield size={20} className="text-[#15803d]" /> Pengaturan Akun
              </h3>
              <div className="flex flex-col">
                <button className="flex items-center justify-between py-4 border-b border-gray-100 text-left hover:text-[#15803d] transition-colors group">
                  <div className="flex items-center gap-3">
                    <User size={18} className="text-gray-400 group-hover:text-[#15803d]" />
                    <div>
                      <p className="text-sm font-bold text-gray-700">Edit Profil</p>
                      <p className="text-xs text-gray-400">Perbarui nama, NIM, atau nomor telepon</p>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-gray-400" />
                </button>
                <button className="flex items-center justify-between py-4 border-b border-gray-100 text-left hover:text-[#15803d] transition-colors group">
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
    </div>
  );
}

export default ProfileMahasiswa;