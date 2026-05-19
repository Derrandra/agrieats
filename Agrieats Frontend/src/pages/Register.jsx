import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../services/auth";

function Register() {
  const navigate = useNavigate();

  // state buat form register
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  // handle submit pendaftaran
  function handleRegister(event) {
    event.preventDefault();

    const newUser = {
      name,
      email,
      password,
      phone,
      address,
    };

    // simpan data user baru
    registerUser(newUser);

    // arahkan ke halaman login
    navigate("/");
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-[#F2F0F0] py-10">
      <div className="bg-white p-10 rounded-3xl shadow-xl w-[500px]">
        
        {/* judul & deskripsi */}
        <h1 className="text-4xl font-bold text-green-700 mb-2">AgriEats</h1>
        <p className="text-gray-500 mb-8">Register akun UMKM</p>

        <form onSubmit={handleRegister} className="space-y-5">
          <input
            type="text"
            placeholder="Nama Lengkap"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border p-3 rounded-xl outline-none"
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border p-3 rounded-xl outline-none"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border p-3 rounded-xl outline-none"
          />

          <input
            type="text"
            placeholder="Nomor HP"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border p-3 rounded-xl outline-none"
          />

          <textarea
            placeholder="Alamat"
            rows="4"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full border p-3 rounded-xl outline-none resize-none"
          />

          <button
            type="submit"
            className="w-full bg-green-700 hover:bg-green-800 text-white py-3 rounded-xl font-semibold"
          >
            Sign Up
          </button>
        </form>

        <p className="text-center mt-6 text-gray-500">
          Sudah punya akun?
          <Link to="/" className="text-green-700 font-semibold ml-2">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;