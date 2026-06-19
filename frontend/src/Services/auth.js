
// ── API BASE ──
const BASE = "https://mywebsite-7.onrender.com/api/auth";

// ── AUTH API CALLS ──

export const register = async (data) => {
  const res = await fetch(`${BASE}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const login = async (data) => {
  const res = await fetch(`${BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const forgotPassword = async (email) => {
  const res = await fetch(`${BASE}/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  return res.json();
};

export const resetPassword = async (token, password) => {
  const res = await fetch(`${BASE}/reset-password/${token}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });
  return res.json();
};

export const verifyResetToken = async (token) => {
  const res = await fetch(`${BASE}/reset-password/${token}`);
  return res.json();
};

// ── LOCAL STORAGE HELPERS ──

export const saveAuth = (data) => {
  localStorage.setItem("token", data.token);

  localStorage.setItem(
    "user",
    JSON.stringify({
      _id: data._id,
      name: data.name,
      email: data.email,
      role: data.role,
    })
  );
};

export const getUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user")) || null;
  } catch {
    return null;
  }
};

export const getToken = () => localStorage.getItem("token");

export const isAuthenticated = () => !!getToken();

export const isAdmin = () => getUser()?.role === "admin";

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};