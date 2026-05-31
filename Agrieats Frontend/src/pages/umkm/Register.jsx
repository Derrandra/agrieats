import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../../services/auth";

function Register() {
  const navigate = useNavigate();

  const [role, setRole] = useState("UMKM");

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [phone, setPhone] = useState("");

  const [namaUMKM, setNamaUMKM] = useState("");
  const [lokasi, setLokasi] = useState("");

  const [namaKantin, setNamaKantin] = useState("");
  const [namaPJ, setNamaPJ] = useState("");

  function handleRegister(e) {
    e.preventDefault();

    const newUser = {
      id: Date.now(),

      username,
      email,
      password,

      role,

      phone,

      image:
        "https://ui-avatars.com/api/?name=" +
        encodeURIComponent(username),
    };

    if (role === "UMKM") {
      newUser.namaUMKM = namaUMKM;
      newUser.lokasi = lokasi;
    }

    if (role === "PENGELOLA") {
      newUser.namaKantin = namaKantin;
      newUser.namaPJ = namaPJ;
    }

    registerUser(newUser);

    navigate("/");
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-[#F2F0F0] py-10">

      <div className="bg-white p-10 rounded-3xl shadow-xl w-[550px]">

        <h1 className="text-4xl font-bold text-green-700 mb-2">
          AgriEats
        </h1>

        <p className="text-gray-500 mb-8">
          Register Akun
        </p>

        <form
          onSubmit={handleRegister}
          className="space-y-5"
        >

          <select
            value={role}
            onChange={(e) =>
              setRole(e.target.value)
            }
            className="w-full border p-3 rounded-xl"
          >
            <option value="UMKM">
              UMKM
            </option>

            <option value="PENGELOLA">
              Pengelola Kantin
            </option>
          </select>

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) =>
              setUsername(e.target.value)
            }
            className="w-full border p-3 rounded-xl"
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            className="w-full border p-3 rounded-xl"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            className="w-full border p-3 rounded-xl"
          />

          <input
            type="text"
            placeholder="No HP"
            value={phone}
            onChange={(e) =>
              setPhone(e.target.value)
            }
            className="w-full border p-3 rounded-xl"
          />

          {role === "UMKM" && (
            <>
              <input
                type="text"
                placeholder="Nama UMKM"
                value={namaUMKM}
                onChange={(e) =>
                  setNamaUMKM(
                    e.target.value
                  )
                }
                className="w-full border p-3 rounded-xl"
              />

              <input
                type="text"
                placeholder="Lokasi"
                value={lokasi}
                onChange={(e) =>
                  setLokasi(
                    e.target.value
                  )
                }
                className="w-full border p-3 rounded-xl"
              />
            </>
          )}

          {role === "PENGELOLA" && (
            <>
              <input
                type="text"
                placeholder="Nama Kantin"
                value={namaKantin}
                onChange={(e) =>
                  setNamaKantin(
                    e.target.value
                  )
                }
                className="w-full border p-3 rounded-xl"
              />

              <input
                type="text"
                placeholder="Nama Penanggung Jawab"
                value={namaPJ}
                onChange={(e) =>
                  setNamaPJ(
                    e.target.value
                  )
                }
                className="w-full border p-3 rounded-xl"
              />
            </>
          )}

          <button
            type="submit"
            className="
              w-full
              bg-green-700
              text-white
              py-3
              rounded-xl
            "
          >
            Register
          </button>
        </form>

        <p className="text-center mt-6">
          Sudah punya akun?

          <Link
            to="/"
            className="text-green-700 ml-2"
          >
            Login
          </Link>
        </p>

      </div>

    </div>
  );
}

export default Register;