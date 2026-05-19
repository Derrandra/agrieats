// SAVE REGISTER USER

export function registerUser(userData) {

  // ambil user lama
  const users =
    JSON.parse(localStorage.getItem("users")) || [];

  // tambah user baru
  users.push(userData);

  // simpan lagi
  localStorage.setItem(
    "users",
    JSON.stringify(users)
  );

}

// LOGIN USER

export function loginUser(email, password) {

  const users =
    JSON.parse(localStorage.getItem("users")) || [];

  // cari user
  const user = users.find(
    (user) =>
      user.email === email &&
      user.password === password
  );

  return user;

}

// SAVE LOGIN SESSION

export function saveLogin(user) {

  localStorage.setItem(
    "currentUser",
    JSON.stringify(user)
  );

}

// GET LOGIN USER

export function getCurrentUser() {

  return JSON.parse(
    localStorage.getItem("currentUser")
  );

}

// LOGOUT

export function logoutUser() {

  localStorage.removeItem("currentUser");

}