function OrderCard({
  customer,
  items,
  status,
  declineReason,
  onDetail,
  onAccept,
  onDecline,
  onComplete,
}) {
  return (
    <div className="bg-white p-5 rounded-2xl shadow flex justify-between items-center border border-gray-100">
      
      {/* INFO CUSTOMER */}
      <div className="flex gap-5">
        <img
          src="https://i.pravatar.cc/100"
          alt="customer"
          className="w-24 h-24 rounded-xl object-cover shadow-sm"
        />

        <div>
          <h1 className="text-2xl font-bold mb-2">{customer}</h1>

          <ul className="list-disc ml-5 text-gray-600 font-medium">
            {items.map((item, index) => (
              <li key={index}>
                {typeof item === "string" ? item : item.name}{" "}
                {item.qty && <span className="text-green-700 font-bold">(x{item.qty})</span>}
              </li>
            ))}
          </ul>

          {/* STATUS BADGES */}
          {status === "Menunggu Validasi" && (
            <div className="mt-4">
              <span className="bg-blue-100 text-blue-700 border border-blue-200 px-4 py-1.5 rounded-lg text-sm font-bold">
                Menunggu Validasi
              </span>
            </div>
          )}

          {status === "Diproses" && (
            <div className="mt-4">
              <span className="bg-yellow-100 text-yellow-700 border border-yellow-200 px-4 py-1.5 rounded-lg text-sm font-bold">
                Sedang Diproses
              </span>
            </div>
          )}

          {status === "Selesai" && (
            <div className="mt-4">
              <span className="bg-green-100 text-green-700 border border-green-200 px-4 py-1.5 rounded-lg text-sm font-bold">
                Pesanan Selesai
              </span>
            </div>
          )}

          {status === "Ditolak" && (
            <div className="mt-4">
              <span className="bg-red-100 text-red-600 border border-red-200 px-4 py-1.5 rounded-lg text-sm font-bold">
                Ditolak
              </span>
              <p className="text-red-500 text-sm mt-2 font-medium">
                Alasan: {declineReason || "Ditolak oleh penjual"}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ACTIONS */}
      <div className="flex flex-col gap-3 min-w-[120px]">
        <button
          onClick={onDetail}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-6 py-2 rounded-xl transition-all"
        >
          Detail
        </button>

        {/* MUNCUL DI TAB PESANAN MASUK */}
        {status === "Menunggu Validasi" && (
          <>
            <button
              onClick={onAccept}
              className="bg-[#15803d] hover:bg-[#166534] text-white font-semibold px-6 py-2 rounded-xl transition-all"
            >
              Terima
            </button>

            <button
              onClick={onDecline}
              className="bg-[#ef4444] hover:bg-[#dc2626] text-white font-semibold px-6 py-2 rounded-xl transition-all"
            >
              Tolak
            </button>
          </>
        )}

        {/* MUNCUL DI TAB SEDANG DIPROSES */}
        {status === "Diproses" && (
          <button
            onClick={onComplete}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-xl transition-all shadow-sm"
          >
            Selesaikan
          </button>
        )}
      </div>
    </div>
  );
}

export default OrderCard;