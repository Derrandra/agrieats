function OrderDetailModal({ isOpen, onClose, order, onAccept, onDecline }) {
  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white w-[500px] rounded-3xl p-8 shadow-2xl">
        
        {/* HEADER */}
        <div className="flex items-center gap-5 mb-6">
          <img
            src="https://i.pravatar.cc/100"
            alt="customer"
            className="w-20 h-20 rounded-xl object-cover"
          />
          <div>
            <h1 className="text-3xl font-bold">{order.customer}</h1>
            <p className="text-gray-500">@{order.customer.toLowerCase().replace(" ", "")}</p>
          </div>
        </div>

        {/* DETAIL */}
        <h2 className="text-2xl font-bold mb-5">Detail Pesanan</h2>
        <div className="space-y-4 mb-8">
          {order.items.map((item, index) => (
            <div key={index} className="flex justify-between border-b pb-3 text-gray-700">
              <p>
                {index + 1}. {item.name || item}
              </p>
              <p className="font-semibold">
                Rp {item.price ? Number(item.price).toLocaleString("id-ID") : "-"}
              </p>
            </div>
          ))}
        </div>

        {/* TOTAL */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Total</h1>
          <h1 className="text-3xl font-bold text-green-700">
            Rp {Number(order.total).toLocaleString("id-ID")}
          </h1>
        </div>

        {/* BUTTONS */}
        <div className="flex justify-end gap-4">
          {/* Tombol aksi hanya muncul jika status masih pending */}
          {order.status === "pending" ? (
            <>
              <button
                onClick={() => {
                  onClose();
                  onDecline(order.id);
                }}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-semibold transition-all"
              >
                Decline
              </button>
              <button
                onClick={() => {
                  onClose();
                  onAccept(order.id);
                }}
                className="bg-green-700 hover:bg-green-800 text-white px-6 py-3 rounded-xl font-semibold transition-all"
              >
                Accept
              </button>
            </>
          ) : (
            <button
              onClick={onClose}
              className="bg-gray-200 hover:bg-gray-300 px-6 py-3 rounded-xl font-semibold transition-all"
            >
              Tutup
            </button>
          )}
        </div>

      </div>
    </div>
  );
}

export default OrderDetailModal;