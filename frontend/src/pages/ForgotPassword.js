import { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../Services/api";

export default function ForgotPassword() {
  const [email,   setEmail]   = useState("");
  const [msg,     setMsg]     = useState("");
  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(false);
  const [sent,    setSent]    = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setMsg(""); setLoading(true);
    try {
      const data = await forgotPassword({ email });
      setMsg(data.message);
      setSent(true);
    } catch (err) {
      setError(err.message);
    } finally { setLoading(false); }
  };

  return (
    <div style={{ background: "#111", minHeight: "calc(100vh - 65px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
      <div className="auth-page">

        {/* Icon */}
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <div style={{ fontSize: "3rem" }}>🔐</div>
        </div>

        <h1>FORGOT PASSWORD</h1>
        <div className="divider" />

        {!sent ? (
          <>
            <p style={{ color: "#666", fontSize: "0.88rem", marginBottom: 24, lineHeight: 1.7 }}>
              Enter your registered email address and we'll send you a link to reset your password.
            </p>

            {error && (
              <div style={{ background: "rgba(255,82,82,0.1)", border: "1px solid rgba(255,82,82,0.3)", color: "#ff5252", padding: "12px 16px", borderRadius: 6, marginBottom: 16, fontSize: "0.88rem" }}>
                ❌ {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Email Address</label>
                <input className="form-control" type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required />
              </div>
              <button type="submit" className="btn btn-primary" disabled={loading}
                style={{ width: "100%", marginTop: 8 }}>
                {loading ? "Sending…" : "Send Reset Link"}
              </button>
            </form>
          </>
        ) : (
          /* Success state */
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "3rem", marginBottom: 16 }}>📧</div>
            <div style={{ background: "rgba(0,230,118,0.08)", border: "1px solid rgba(0,230,118,0.25)", color: "#00e676", padding: "16px 20px", borderRadius: 8, marginBottom: 24, fontSize: "0.9rem", lineHeight: 1.7 }}>
              ✅ {msg}
            </div>
            <p style={{ color: "#555", fontSize: "0.85rem", lineHeight: 1.7 }}>
              Check your inbox at <strong style={{ color: "var(--accent)" }}>{email}</strong>.<br />
              The link expires in <strong style={{ color: "#fff" }}>1 hour</strong>.
            </p>
            <p style={{ color: "#444", fontSize: "0.82rem", marginTop: 12 }}>
              Didn't receive it?{" "}
              <button onClick={() => { setSent(false); setMsg(""); }}
                style={{ background: "none", border: "none", color: "var(--accent)", cursor: "pointer", fontWeight: 700, fontSize: "0.82rem" }}>
                Try again
              </button>
            </p>
          </div>
        )}

        <p style={{ marginTop: 20 }}>
          <Link to="/login" style={{ color: "#555", fontSize: "0.85rem" }}>
            ← Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
}
