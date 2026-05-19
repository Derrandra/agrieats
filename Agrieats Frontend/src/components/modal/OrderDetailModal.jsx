function OrderDetailModal({

  isOpen,
  onClose,
  order,

}) {

  if (!isOpen) return null;
  return (

    // BACKDROP
    <div
      className="
        fixed
        inset-0
        bg-black/50
        flex
        justify-center
        items-center
        z-50
      "
    >

      {/* MODAL BOX */}
      <div
        className="
          bg-white
          w-150
          rounded-2xl
          p-8
          shadow-2xl
        "
      >

        {/* HEADER */}
        <div className="flex items-center gap-5 mb-6">

          <img
            src="https://i.pravatar.cc/100"
            alt="customer"
            className="
              w-20
              h-20
              rounded-xl
              object-cover
            "
          />

          <div>
            <h1 className="text-3xl font-bold"> {order.customer} </h1>
            <p className="text-gray-500"> @customer123 </p>
          </div>

        </div>

        {/* DETAIL */}
        <h2 className="text-2xl font-bold mb-5"> Detail Pesanan </h2>
        <div className="space-y-4 mb-8">

          {
            order.items.map((item, index) => (

              <div
                key={index}

                className="
                  flex
                  justify-between
                  border-b
                  pb-3
                "
              >
                <p> {index + 1}. {item.name} </p>
                <p> Rp {item.price} </p>
              </div>
            ))
          }

        </div>

        {/* TOTAL */}
        <div
          className="
            flex
            justify-between
            items-center
            mb-8
          "
        >
          <h1 className="text-3xl font-bold"> Total </h1>
          <h1 className="text-3xl font-bold text-green-700"> Rp {order.total} </h1>
        </div>

        {/* BUTTON */}

        <div className="flex justify-end gap-4">

          <button

            onClick={onClose}

            className="
              bg-red-500
              hover:bg-red-600
              text-white
              px-6
              py-3
              rounded-xl
            "
          >

            Decline

          </button>

          <button

            onClick={onClose}

            className="
              bg-green-700
              hover:bg-green-800
              text-white
              px-6
              py-3
              rounded-xl
            "
          >

            Accept

          </button>
        </div>
      </div>
    </div>
  );
}

export default OrderDetailModal;