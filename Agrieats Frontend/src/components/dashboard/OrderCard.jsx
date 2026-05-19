function OrderCard({ customer, items, onDetail }) {
  return (
    <div className="bg-white p-5 rounded-2xl shadow flex justify-between items-center">
      
      {/* info pelanggan */}
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
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* tombol action */}
      <div className="flex flex-col gap-3">
        <button
          onClick={onDetail}
          className="bg-gray-200 hover:bg-gray-300 px-6 py-2 rounded-xl"
        >
          Detail
        </button>
        
        <button className="bg-green-700 hover:bg-green-800 text-white px-6 py-2 rounded-xl">
          Accept
        </button>
      </div>
      
    </div>
  );
}

export default OrderCard;