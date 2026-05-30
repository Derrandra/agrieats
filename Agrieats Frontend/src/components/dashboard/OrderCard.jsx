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
    <div className="bg-white p-5 rounded-2xl shadow flex justify-between items-center">
      
      {/* INFO CUSTOMER */}
      <div className="flex gap-5">
        <img
          src="https://i.pravatar.cc/100"
          alt="customer"
          className="w-24 h-24 rounded-xl object-cover"
        />

        <div>
          <h1 className="text-2xl font-bold mb-2">{customer}</h1>

          <ul className="list-disc ml-5 text-gray-600">
            {items.map((item, index) => (
              <li key={index}>
                {typeof item === "string" ? item : item.name}
              </li>
            ))}
          </ul>

          {/* STATUS PROCESSING */}
          {status === "processing" && (
            <div className="mt-3">
              <span className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-lg text-sm font-semibold">
                Sedang Diproses
              </span>
            </div>
          )}

          {/* STATUS REJECTED */}
          {status === "rejected" && (
            <div className="mt-3">
              <span className="bg-red-100 text-red-600 px-4 py-2 rounded-lg text-sm font-semibold">
                Ditolak
              </span>
              <p className="text-red-500 text-sm mt-2">
                Alasan: {declineReason}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ACTION */}
      <div className="flex flex-col gap-3">
        <button
          onClick={onDetail}
          className="bg-gray-200 hover:bg-gray-300 px-6 py-2 rounded-xl"
        >
          Detail
        </button>

        {/* PENDING */}
        {status === "pending" && (
          <>
            <button
              onClick={onAccept}
              className="bg-green-700 hover:bg-green-800 text-white px-6 py-2 rounded-xl"
            >
              Accept
            </button>

            <button
              onClick={onDecline}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-xl"
            >
              Decline
            </button>
          </>
        )}

        {/* PROCESSING */}
        {status === "processing" && (
          <button
            disabled
            className="bg-yellow-500 text-white px-6 py-2 rounded-xl cursor-default"
          >
            Diproses
          </button>
        )}

        {/* REJECTED */}
        {status === "rejected" && (
          <button
            disabled
            className="bg-red-500 text-white px-6 py-2 rounded-xl cursor-default"
          >
            Ditolak
          </button>
        )}
      </div>
    </div>
  );
}

export default OrderCard;