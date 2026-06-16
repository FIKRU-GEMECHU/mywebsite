import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { getPlans, createPlan, deletePlan } from "../Services/api";
import { isAuthenticated } from "../Services/auth";

export default function BusinessPlan() {
  const [plans,  setPlans]  = useState([]);
  const [idea,   setIdea]   = useState("");
  const [error,  setError]  = useState("");
  const [loading,setLoading]= useState(false);
  const [expanded, setExpanded] = useState(null);

  const auth = isAuthenticated();

  useEffect(() => { if (auth) load(); }, [auth]);

  const load = async () => {
    try { setPlans(await getPlans()); }
    catch (e) { setError(e.message); }
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!idea.trim()) return;
    setLoading(true); setError("");
    try {
      const p = await createPlan({ idea });
      setPlans([p, ...plans]);
      setIdea("");
      setExpanded(p._id);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this business plan?")) return;
    try {
      await deletePlan(id);
      setPlans(plans.filter(p => p._id !== id));
      if (expanded === id) setExpanded(null);
    } catch (e) { setError(e.message); }
  };

  if (!auth) return (
    <div className="page section">
      <h1>📈 Business Plan Generator</h1>
      <p>Please <Link to="/login">log in</Link> to generate business plans.</p>
    </div>
  );

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-main">

        <div className="page-header">
          <h1 className="section-title">📈 Business Plan Generator</h1>
          <p style={{ color: "#6b7280" }}>Describe your idea and get a structured business plan instantly.</p>
        </div>

        {error && <p className="error">{error}</p>}

        {/* Input card */}
        <div style={{ background: "#fff", borderRadius: 12, padding: 28, boxShadow: "0 4px 16px rgba(0,0,0,0.07)", marginBottom: 32 }}>
          <h3 style={{ margin: "0 0 16px", color: "var(--primary)" }}>💡 Enter Your Business Idea</h3>
          <form onSubmit={handleGenerate}>
            <textarea className="form-control"
              rows={5}
              placeholder="e.g. An online platform that connects local farmers with urban consumers for fresh produce delivery in Ethiopia..."
              value={idea}
              onChange={e => setIdea(e.target.value)}
              required
              style={{ marginBottom: 14 }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ color: "#9ca3af", fontSize: "0.82rem" }}>
                💡 Tip: Be specific — include your target market, problem, and solution.
              </span>
              <button className="btn btn-primary" type="submit" disabled={loading}
                style={{ minWidth: 160 }}>
                {loading ? "⏳ Generating…" : "🚀 Generate Plan"}
              </button>
            </div>
          </form>
        </div>

        {/* Plans list */}
        <h3 style={{ margin: "0 0 16px", color: "var(--primary)" }}>
          📋 Your Plans ({plans.length})
        </h3>

        {plans.length === 0 ? (
          <div style={{ textAlign: "center", padding: 48, color: "#9ca3af", background: "#fff", borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
            No plans yet. Generate your first one above! 📈
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {plans.map(p => (
              <div key={p._id} style={{ background: "#fff", borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.07)", overflow: "hidden" }}>

                {/* Plan header */}
                <div style={{ padding: "16px 22px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", borderBottom: expanded === p._id ? "1px solid #e5e7eb" : "none" }}
                  onClick={() => setExpanded(expanded === p._id ? null : p._id)}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "1rem" }}>💡 {p.idea}</div>
                    <div style={{ color: "#9ca3af", fontSize: "0.78rem", marginTop: 2 }}>
                      {new Date(p.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <span style={{ fontSize: "0.82rem", color: "#6b7280" }}>
                      {expanded === p._id ? "▲ Hide" : "▼ View Plan"}
                    </span>
                    <button onClick={e => { e.stopPropagation(); handleDelete(p._id); }}
                      style={{ padding: "5px 10px", borderRadius: 8, border: "none", background: "#fee2e2", color: "#dc2626", fontWeight: 600, fontSize: "0.8rem", cursor: "pointer" }}>
                      🗑
                    </button>
                  </div>
                </div>

                {/* Expanded plan content */}
                {expanded === p._id && (
                  <div style={{ padding: "20px 24px" }}>
                    <pre style={{
                      whiteSpace: "pre-wrap", fontFamily: "inherit", lineHeight: 1.8,
                      fontSize: "0.9rem", color: "#374151",
                      background: "#f8fafc", padding: 20, borderRadius: 8,
                      borderLeft: "4px solid var(--primary)",
                    }}>
                      {p.generatedPlan}
                    </pre>
                    <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
                      <button onClick={() => {
                        navigator.clipboard.writeText(p.generatedPlan);
                        alert("Plan copied to clipboard!");
                      }} className="btn btn-outline btn-sm">
                        📋 Copy Plan
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
