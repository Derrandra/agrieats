function NotificationModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const notifications = [
    { id: 1, text: "Pesanan baru masuk" },
    { id: 2, text: "Menu berhasil diperbarui" },
    { id: 3, text: "Pesanan #102 selesai" },
  ];

  return (
    <div 
      className="fixed inset-0 bg-black/30 z-50" 
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="absolute right-10 top-20 bg-white rounded-2xl shadow-xl w-[350px] p-5"
      >
        <h1 className="font-bold text-xl mb-4">Notifikasi</h1>

        <div className="space-y-3">
          {notifications.map((item) => (
            <div key={item.id} className="p-3 bg-gray-100 rounded-xl">
              {item.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default NotificationModal;