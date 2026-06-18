const BASE = "https://mywebsite-10.onrender.com/api";

const headers = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

const req = async (endpoint, opts = {}) => {
  const res  = await fetch(`${BASE}${endpoint}`, { headers: headers(), ...opts });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
};

// ── Auth ──────────────────────────────────────────────
export const registerUser    = (body)  => req("/auth/register",                   { method: "POST", body: JSON.stringify(body) });
export const loginUser       = (body)  => req("/auth/login",                      { method: "POST", body: JSON.stringify(body) });
export const getMe           = ()      => req("/auth/me");
export const forgotPassword  = (body)  => req("/auth/forgot-password",            { method: "POST", body: JSON.stringify(body) });
export const verifyResetToken= (token) => req(`/auth/reset-password/${token}`);
export const resetPassword   = (token, body) => req(`/auth/reset-password/${token}`, { method: "POST", body: JSON.stringify(body) });

// ── Challenges ────────────────────────────────────────
export const getChallenges    = ()         => req("/challenges");
export const createChallenge  = (body)     => req("/challenges",      { method: "POST",   body: JSON.stringify(body) });
export const updateChallenge  = (id, body) => req(`/challenges/${id}`,{ method: "PUT",    body: JSON.stringify(body) });
export const deleteChallenge  = (id)       => req(`/challenges/${id}`,{ method: "DELETE" });

// ── Goals ─────────────────────────────────────────────
export const getGoals    = ()         => req("/goals");
export const createGoal  = (body)     => req("/goals",      { method: "POST",   body: JSON.stringify(body) });
export const updateGoal  = (id, body) => req(`/goals/${id}`,{ method: "PUT",    body: JSON.stringify(body) });
export const deleteGoal  = (id)       => req(`/goals/${id}`,{ method: "DELETE" });

// ── Business Plans ────────────────────────────────────
export const getPlans    = ()         => req("/business");
export const createPlan  = (body)     => req("/business",      { method: "POST",   body: JSON.stringify(body) });
export const updatePlan  = (id, body) => req(`/business/${id}`,{ method: "PUT",    body: JSON.stringify(body) });
export const deletePlan  = (id)       => req(`/business/${id}`,{ method: "DELETE" });

// ── AI ────────────────────────────────────────────────
export const getReports   = ()         => req("/ai");
export const sendChat     = (body)     => req("/ai/chat",  { method: "POST",   body: JSON.stringify(body) });
export const deleteReport = (id)       => req(`/ai/${id}`, { method: "DELETE" });
