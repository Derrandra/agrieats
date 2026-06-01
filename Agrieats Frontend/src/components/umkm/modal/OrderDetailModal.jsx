function OrderDetailModal({ isOpen, onClose, order, onAccept, onDecline, onComplete }) {
  if (!isOpen || !order) return null;

  // Fungsi bantuan untuk memastikan URL gambar valid 
  // (karena dari backend biasanya hanya "/static/images/...")
  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith("http")) return path;
    return `http://localhost:8000${path}`; // Sesuaikan port jika FastAPI jalan di port lain
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
      <div className="bg-white w-full max-w-[550px] rounded-3xl p-8 shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
        
        {/* HEADER */}
        <div className="flex items-center gap-5 mb-6 border-b border-gray-100 pb-6">
          <div className="w-16 h-16 bg-[#15803d] text-white rounded-2xl flex items-center justify-center text-2xl font-bold shadow-md">
            {order.customer.replace("NIM: ", "").substring(0, 2).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{order.customer}</h1>
            <span className={`px-3 py-1 rounded-full text-xs font-bold mt-2 inline-block ${
              order.status === "Menunggu Validasi" ? "bg-yellow-100 text-yellow-700" :
              order.status === "Diproses" ? "bg-blue-100 text-blue-700" :
              order.status === "Selesai" ? "bg-green-100 text-green-700" :
              "bg-red-100 text-red-700"
            }`}>
              {order.status}
            </span>
          </div>
        </div>

        {/* DETAIL MENU */}
        <h2 className="text-xl font-bold mb-4 text-gray-800">Detail Pesanan</h2>
        <div className="space-y-4 mb-6 bg-gray-50 p-5 rounded-2xl border border-gray-100">
          {order.items.map((item, index) => (
            <div key={index} className="flex justify-between items-center text-gray-700">
              <div className="flex gap-3">
                <span className="font-bold text-gray-400">{index + 1}.</span>
                <div>
                  <p className="font-bold">{item.name || "Menu"}</p>
                  <p className="text-sm text-gray-500">{item.qty}x @ Rp {item.price ? Number(item.price).toLocaleString("id-ID") : "-"}</p>
                </div>
              </div>
              <p className="font-bold text-[#15803d]">
                Rp {item.price ? (Number(item.price) * (item.qty || 1)).toLocaleString("id-ID") : "-"}
              </p>
            </div>
          ))}
        </div>

        {/* BUKTI PEMBAYARAN */}
        {order.bukti_pembayaran ? (
          <div className="mb-6">
            <h2 className="text-lg font-bold mb-3 text-gray-800">Bukti Pembayaran</h2>
            <div className="w-full bg-gray-100 rounded-2xl border-2 border-dashed border-gray-300 overflow-hidden flex justify-center items-center p-2">
              <img 
                src={getImageUrl(order.bukti_pembayaran)} 
                alt="Bukti Transfer" 
                className="max-h-60 w-auto object-contain rounded-xl hover:scale-105 transition-transform cursor-pointer"
                onClick={() => window.open(getImageUrl(order.bukti_pembayaran), '_blank')}
                title="Klik untuk memperbesar"
              />
            </div>
          </div>
        ) : (
          <div className="mb-6 bg-yellow-50 text-yellow-700 p-4 rounded-xl text-sm font-medium border border-yellow-200">
            *Pesanan ini menggunakan metode Tunai di Kantin atau belum menyertakan bukti pembayaran.
          </div>
        )}

        {/* ALASAN PENOLAKAN (JIKA ADA) */}
        {order.status === "Ditolak" && order.declineReason && (
          <div className="mb-6 bg-red-50 text-red-700 p-4 rounded-xl text-sm border border-red-200">
            <strong>Alasan Ditolak:</strong> {order.declineReason}
          </div>
        )}

        {/* TOTAL */}
        <div className="flex justify-between items-center mb-8 border-t border-gray-100 pt-6">
          <h1 className="text-xl font-bold text-gray-500">Total Pembayaran</h1>
          <h1 className="text-3xl font-bold text-[#15803d]">
            Rp {Number(order.total).toLocaleString("id-ID")}
          </h1>
        </div>

        {/* BUTTONS */}
        <div className="flex justify-end gap-3">
          
          {/* Tombol Tutup selalu ada */}
          <button
            onClick={onClose}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-bold transition-all"
          >
            Tutup
          </button>

          {/* Tombol aksi khusus status "Menunggu Validasi" */}
          {order.status === "Menunggu Validasi" && (
            <>
              <button
                onClick={() => {
                  onClose();
                  onDecline(order.id);
                }}
                className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-6 py-3 rounded-xl font-bold transition-all"
              >
                Tolak
              </button>
              <button
                onClick={() => {
                  onAccept(order.id);
                }}
                className="bg-[#15803d] hover:bg-green-800 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-md"
              >
                Terima Pesanan
              </button>
            </>
          )}

          {/* Tombol aksi khusus status "Diproses" */}
          {order.status === "Diproses" && (
            <button
              onClick={() => {
                onComplete(order.id);
              }}
              className="bg-[#15803d] hover:bg-green-800 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-md"
            >
              Pesanan Selesai / Siap Diambil
            </button>
          )}

        </div>

      </div>
    </div>
  );
}

export default OrderDetailModal;