import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { verifyResetToken, resetPassword } from "../Services/api";
import { saveAuth } from "../Services/auth";

export default function ResetPassword() {
  const { token }  = useParams();
  const navigate   = useNavigate();

  const [status,   setStatus]   = useState("checking"); // checking | valid | invalid | success
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [confirm,  setConfirm]  = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const [strength, setStrength] = useState(0);

  // Verify token on mount
  useEffect(() => {
    const check = async () => {
      try {
        const data = await verifyResetToken(token);
        if (data.valid) { setEmail(data.email); setStatus("valid"); }
        else setStatus("invalid");
      } catch {
        setStatus("invalid");
      }
    };
    check();
  }, [token]);

  // Password strength checker
  const checkStrength = (val) => {
    let score = 0;
    if (val.length >= 6)  score++;
    if (val.length >= 10) score++;
    if (/[A-Z]/.test(val)) score++;
    if (/[0-9]/.test(val)) score++;
    if (/[^A-Za-z0-9]/.test(val)) score++;
    setStrength(score);
  };

  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong", "Very Strong"];
  const strengthColor = ["", "#ff5252", "#ffab40", "#ffd740", "#69f0ae", "#00e676"];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirm) return setError("Passwords do not match");
    if (password.length < 6)  return setError("Password must be at least 6 characters");

    setLoading(true);
    try {
      const data = await resetPassword(token, { password });
      saveAuth(data);
      setStatus("success");
      setTimeout(() => navigate("/dashboard"), 2500);
    } catch (err) {
      setError(err.message);
    } finally { setLoading(false); }
  };

  return (
    <div style={{ background: "#111", minHeight: "calc(100vh - 65px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
      <div className="auth-page">

        {/* ── Checking ── */}
        {status === "checking" && (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: 16 }}>⏳</div>
            <p style={{ color: "#666" }}>Verifying reset link…</p>
          </div>
        )}

        {/* ── Invalid ── */}
        {status === "invalid" && (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "3rem", marginBottom: 16 }}>⛔</div>
            <h1 style={{ marginBottom: 8 }}>LINK EXPIRED</h1>
            <div className="divider divider-center" />
            <p style={{ color: "#666", marginBottom: 24, lineHeight: 1.7 }}>
              This reset link is invalid or has expired.<br />
              Reset links are valid for <strong style={{ color: "#fff" }}>1 hour</strong>.
            </p>
            <Link to="/forgot-password" className="btn btn-primary">
              Request New Link
            </Link>
            <p style={{ marginTop: 16 }}>
              <Link to="/login" style={{ color: "#555", fontSize: "0.85rem" }}>← Back to Login</Link>
            </p>
          </div>
        )}

        {/* ── Success ── */}
        {status === "success" && (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "3rem", marginBottom: 16 }}>🎉</div>
            <h1 style={{ marginBottom: 8 }}>PASSWORD RESET!</h1>
            <div className="divider divider-center" />
            <div style={{ background: "rgba(0,230,118,0.08)", border: "1px solid rgba(0,230,118,0.25)", color: "#00e676", padding: "14px 18px", borderRadius: 8, marginBottom: 20, fontSize: "0.9rem" }}>
              ✅ Your password has been reset successfully!
            </div>
            <p style={{ color: "#666", fontSize: "0.88rem" }}>
              Redirecting to your dashboard…
            </p>
          </div>
        )}

        {/* ── Valid — show form ── */}
        {status === "valid" && (
          <>
            <div style={{ textAlign: "center", marginBottom: 8 }}>
              <div style={{ fontSize: "2.5rem" }}>🔑</div>
            </div>
            <h1>NEW PASSWORD</h1>
            <div className="divider" />

            <p style={{ color: "#666", fontSize: "0.86rem", marginBottom: 20 }}>
              Setting password for <strong style={{ color: "var(--accent)" }}>{email}</strong>
            </p>

            {error && (
              <div style={{ background: "rgba(255,82,82,0.1)", border: "1px solid rgba(255,82,82,0.3)", color: "#ff5252", padding: "12px 16px", borderRadius: 6, marginBottom: 16, fontSize: "0.88rem" }}>
                ❌ {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>New Password</label>
                <input className="form-control" type="password"
                  placeholder="Min 6 characters"
                  value={password}
                  onChange={e => { setPassword(e.target.value); checkStrength(e.target.value); }}
                  minLength={6} required />
                {/* Strength bar */}
                {password.length > 0 && (
                  <div style={{ marginTop: 8 }}>
                    <div style={{ height: 4, background: "#2a2a2a", borderRadius: 99, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${(strength / 5) * 100}%`, background: strengthColor[strength], borderRadius: 99, transition: "all 0.3s" }} />
                    </div>
                    <div style={{ fontSize: "0.72rem", color: strengthColor[strength], marginTop: 4 }}>
                      {strengthLabel[strength]}
                    </div>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>Confirm Password</label>
                <input className="form-control" type="password"
                  placeholder="Repeat new password"
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  minLength={6} required />
                {confirm && password !== confirm && (
                  <div style={{ fontSize: "0.75rem", color: "#ff5252", marginTop: 5 }}>
                    ❌ Passwords do not match
                  </div>
                )}
                {confirm && password === confirm && confirm.length > 0 && (
                  <div style={{ fontSize: "0.75rem", color: "#00e676", marginTop: 5 }}>
                    ✅ Passwords match
                  </div>
                )}
              </div>

              <button type="submit" className="btn btn-primary" disabled={loading}
                style={{ width: "100%", marginTop: 8 }}>
                {loading ? "Resetting…" : "Reset Password"}
              </button>
            </form>

            <p style={{ marginTop: 16 }}>
              <Link to="/login" style={{ color: "#555", fontSize: "0.85rem" }}>← Back to Login</Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
