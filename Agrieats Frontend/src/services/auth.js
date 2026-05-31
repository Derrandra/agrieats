import api from "./api";

export const loginUser = async (username, password) => {
  try {
    // FastAPI (OAuth2PasswordRequestForm) butuh format form-data, bukan JSON
    const formData = new URLSearchParams();
    formData.append("username", username); // Bisa diisi NIM (mahasiswa) atau Email/ID (UMKM)
    formData.append("password", password);

    const response = await api.post("/api/auth/login", formData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    // Simpan token ke localStorage (Sesuai setelan interceptor di api.js)
    if (response.data.access_token) {
      localStorage.setItem("token", response.data.access_token);
      
      // Simpan peran/role jika backend mengirimkannya untuk routing halaman
      if (response.data.peran) {
        localStorage.setItem("peran", response.data.peran);
      }
    }
    
    return response.data;
  } catch (error) {
    console.error("Login Error:", error.response?.data || error.message);
    throw error;
  }
};

export const logoutUser = () => {
  // Hapus token dari browser saat logout
  localStorage.removeItem("token");
  localStorage.removeItem("peran");
};

export const isAuthenticated = () => {
  // Cek apakah ada token di browser
  return localStorage.getItem("token") !== null;
};

// GET CURRENT USER (Cerdas: Coba Mahasiswa dulu, kalau gagal coba UMKM)
export const getCurrentUser = async () => {
  try {
    try {
      // Cek apakah user ini adalah Mahasiswa
      const response = await api.get("/api/mahasiswa/me");
      
      // Kembalikan data dan sisipkan label 'peran' agar Login.jsx tahu harus pindah ke halaman mana
      return { ...response.data, peran: "MAHASISWA" }; 
      
    } catch (errMhs) {
      
      // Jika gagal (berarti dia bukan mahasiswa), cek apakah dia UMKM
      const response = await api.get("/api/umkm/me");
      
      // Kembalikan data dan sisipkan label 'peran'
      return { ...response.data, peran: "UMKM" };
    }
  } catch (error) {
    // Jika ditolak di kedua pintu, berarti token tidak valid atau ada masalah server
    console.error("Gagal mengambil profil:", error);
    throw error;
  }
};

// 5. REGISTER (Opsional/Bisa disesuaikan nanti)
// export const registerUser = async (userData) => {
//   const response = await api.post("/api/auth/register", userData);
//   return response.data;
// }