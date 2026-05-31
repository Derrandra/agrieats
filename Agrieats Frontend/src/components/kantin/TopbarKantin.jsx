import {
  Bell,
  UserCircle
} from "lucide-react";

import { useNavigate } from "react-router-dom";

function TopbarKantin({
  onNotificationClick,
}) {

  const navigate = useNavigate();

  const currentUser =
    JSON.parse(
      localStorage.getItem(
        "currentUser"
      )
    ) || {};

  return (
    <div
      className="
        bg-green-800
        rounded-2xl
        p-5
        shadow
        flex
        justify-between
        items-center
        mb-8
      "
    >
      {/* KIRI */}

      <div>

        <h1
          className="
            text-2xl
            font-bold
            text-white
          "
        >
          Welcome,
          {" "}
          {currentUser.username ||
            "Pengelola"}!
        </h1>

        <p className="text-white">
          Dashboard Pengelola Kantin
        </p>

      </div>

      {/* KANAN */}

      <div
        className="
          flex
          items-center
          gap-5
        "
      >
        <button
          onClick={
            onNotificationClick
          }
        >
          <Bell
            size={24}
            color="white"
            className="
              cursor-pointer
            "
          />
        </button>

        <button
          onClick={() =>
            navigate(
              "/kantin/profile"
            )
          }
        >
          <UserCircle
            size={34}
            color="white"
            className="
              cursor-pointer
            "
          />
        </button>
      </div>
    </div>
  );
}

export default TopbarKantin;