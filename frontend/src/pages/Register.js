import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../Services/api";
import { saveAuth } from "../Services/auth";

function Register() {
  const navigate = useNavigate();
  const [form,    setForm]    = useState({ name: "", email: "", password: "" });
  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(false);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const data = await registerUser(form);
      saveAuth(data);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally { setLoading(false); }
  };

  return (
    <div style={{ background: "#111", minHeight: "calc(100vh - 65px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
      <div className="auth-page">
        <h1>REGISTER</h1>
        <div className="divider" />

        {error && (
          <div style={{ background: "rgba(255,82,82,0.1)", border: "1px solid rgba(255,82,82,0.3)", color: "#ff5252", padding: "12px 16px", borderRadius: 6, marginBottom: 20, fontSize: "0.88rem" }}>
            ❌ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input className="form-control" type="text" name="name"
              placeholder="Fikru Gemechu" value={form.name} onChange={handle} required />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input className="form-control" type="email" name="email"
              placeholder="your@email.com" value={form.email} onChange={handle} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input className="form-control" type="password" name="password"
              placeholder="Min 6 characters" value={form.password} onChange={handle} minLength={6} required />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}
            style={{ width: "100%", marginTop: 8 }}>
            {loading ? "Creating Account…" : "Create Account"}
          </button>
        </form>

        <p>Already have an account? <Link to="/login">Sign in here</Link></p>
      </div>
    </div>
  );
}

export default Register;
