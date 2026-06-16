import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../Services/api";
import { saveAuth } from "../Services/auth";

function Login() {
  const navigate = useNavigate();
  const [form,    setForm]    = useState({ email: "", password: "" });
  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(false);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const data = await loginUser(form);
      saveAuth(data);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally { setLoading(false); }
  };

  return (
    <div style={{ background: "#111", minHeight: "calc(100vh - 65px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
      <div className="auth-page">
        <h1>LOGIN</h1>
        <div className="divider" />

        {error && (
          <div style={{ background: "rgba(255,82,82,0.1)", border: "1px solid rgba(255,82,82,0.3)", color: "#ff5252", padding: "12px 16px", borderRadius: 6, marginBottom: 20, fontSize: "0.88rem" }}>
            ❌ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input className="form-control" type="email" name="email"
              placeholder="your@email.com" value={form.email} onChange={handle} required />
          </div>
          <div className="form-group">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 7 }}>
              <label style={{ margin: 0 }}>Password</label>
              <Link to="/forgot-password" style={{ fontSize: "0.78rem", color: "var(--accent)", fontWeight: 600 }}>
                Forgot Password?
              </Link>
            </div>
            <input className="form-control" type="password" name="password"
              placeholder="••••••••" value={form.password} onChange={handle} required />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}
            style={{ width: "100%", marginTop: 8 }}>
            {loading ? "Signing In…" : "Sign In"}
          </button>
        </form>

        <p>Don't have an account? <Link to="/register">Register here</Link></p>
      </div>
    </div>
  );
}

export default Login;
