function OrderCard({
  customer,
  items,
  status,
  declineReason,
  onDetail,
  onAccept,
  onDecline,
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
                {typeof item === "string" ? item : item.name}
              </li>
            ))}
          </ul>

          {/* STATUS BADGES */}
          {status === "processing" && (
            <div className="mt-4">
              <span className="bg-yellow-100 text-yellow-700 border border-yellow-200 px-4 py-1.5 rounded-lg text-sm font-bold">
                Sedang Diproses
              </span>
            </div>
          )}

          {status === "rejected" && (
            <div className="mt-4">
              <span className="bg-red-100 text-red-600 border border-red-200 px-4 py-1.5 rounded-lg text-sm font-bold">
                Ditolak
              </span>
              <p className="text-red-500 text-sm mt-2 font-medium">
                Alasan: {declineReason}
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

        {status === "pending" && (
          <>
            <button
              onClick={onAccept}
              className="bg-[#15803d] hover:bg-[#166534] text-white font-semibold px-6 py-2 rounded-xl transition-all"
            >
              Accept
            </button>

            <button
              onClick={onDecline}
              className="bg-[#ef4444] hover:bg-[#dc2626] text-white font-semibold px-6 py-2 rounded-xl transition-all"
            >
              Decline
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default OrderCard;