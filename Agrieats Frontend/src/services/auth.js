import api from "./api";

export const loginUser = async (username, password) => {
  try {
    const formData = new URLSearchParams();
    formData.append("username", username); // Bisa diisi NIM, Email, atau Username
    formData.append("password", password);

    const response = await api.post("/api/auth/login", formData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    // Simpan token ke localStorage
    if (response.data.access_token) {
      localStorage.setItem("token", response.data.access_token);
      
      // Simpan peran/role jika backend mengirimkannya
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
  localStorage.removeItem("token");
  localStorage.removeItem("peran");
};

export const isAuthenticated = () => {
  return localStorage.getItem("token") !== null;
};

// GET CURRENT USER (Mendeteksi Mahasiswa, UMKM, atau Pengelola)
export const getCurrentUser = async () => {
  try {
    try {
      // 1. Coba pintu Mahasiswa
      const response = await api.get("/api/mahasiswa/me");
      return { ...response.data, peran: "MAHASISWA" }; 
      
    } catch (errMhs) {
      try {
        // 2. Jika bukan Mahasiswa, coba pintu UMKM
        const response = await api.get("/api/umkm/me");
        return { ...response.data, peran: "UMKM" };

      } catch (errUmkm) {
        // 3. Jika bukan UMKM juga, coba pintu Pengelola Kantin!
        const response = await api.get("/api/pengelola/me");
        return { ...response.data, peran: "PENGELOLA" };
      }
    }
  } catch (error) {
    // Jika ditolak di KETIGA pintu, barulah lempar error ke Login.jsx
    console.error("Gagal mengambil profil (Token tidak valid / Server error):", error);
    throw error;
  }
};