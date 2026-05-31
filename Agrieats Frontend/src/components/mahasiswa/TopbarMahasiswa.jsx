import { useState, useEffect } from "react";
import { MapPin, CloudRain, Sun, Cloud } from "lucide-react";

function TopbarMahasiswa({ namaUser = "Luthfi" }) {
  const [cuaca, setCuaca] = useState({ suhu: "--", kondisi: 0 });
  const [lokasi, setLokasi] = useState("Mendeteksi lokasi...");

  useEffect(() => {
    // Mengambil data cuaca real-time di sekitar area IPB Dramaga
    const fetchCuaca = async () => {
      try {
        const res = await fetch("https://api.open-meteo.com/v1/forecast?latitude=-6.5605&longitude=106.7268&current_weather=true");
        const data = await res.json();
        setCuaca({ suhu: data.current_weather.temperature, kondisi: data.current_weather.weathercode });
      } catch (error) {
        console.error("Gagal mengambil cuaca:", error);
      }
    };
    fetchCuaca();

    // Mengambil koordinat perangkat secara real-time
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setLokasi(`${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`),
        () => setLokasi("-6.5605, 106.7268 (Kantin IPB)")
      );
    } else {
      setLokasi("-6.5605, 106.7268 (Kantin IPB)");
    }
  }, []);

  // Menentukan ikon berdasarkan kode cuaca
  const getWeatherIcon = (code) => {
    if (code === 0) return <Sun size={24} className="text-yellow-500" />;
    if (code > 0 && code < 50) return <Cloud size={24} className="text-gray-500" />;
    return <CloudRain size={24} className="text-blue-500" />;
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 px-8 py-5 flex justify-between items-center mb-8">
      <div>
        <p className="text-sm text-gray-500 font-semibold">Hello {namaUser}</p>
        <div className="flex items-center gap-2 mt-1">
          <MapPin size={20} className="text-green-700" />
          <span className="text-sm font-bold text-gray-800">{lokasi}</span>
        </div>
      </div>

      <div className="flex items-center gap-3 border-2 border-gray-200 rounded-xl px-4 py-2 bg-gray-50">
        {getWeatherIcon(cuaca.kondisi)}
        <span className="text-lg font-semibold text-gray-700">{cuaca.suhu}°C</span>
      </div>
    </div>
  );
}

export default TopbarMahasiswa;