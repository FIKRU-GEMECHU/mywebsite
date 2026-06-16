// ── Auth helpers (localStorage) ───────────────────────

export const saveAuth = (data) => {
  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify({
    _id:   data._id,
    name:  data.name,
    email: data.email,
    role:  data.role,
  }));
};

export const getUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user")) || null;
  } catch {
    return null;
  }
};

export const getToken       = ()  => localStorage.getItem("token");
export const isAuthenticated= ()  => !!getToken();
export const isAdmin        = ()  => getUser()?.role === "admin";

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};
