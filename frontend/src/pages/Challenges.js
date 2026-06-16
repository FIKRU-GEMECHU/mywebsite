import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { getChallenges, createChallenge, updateChallenge, deleteChallenge } from "../Services/api";
import { isAuthenticated } from "../Services/auth";

const STATUS_CYCLE  = { pending: "in-progress", "in-progress": "done", done: "pending" };
const STATUS_LABEL  = { pending: "Pending", "in-progress": "In Progress", done: "Done ✓" };
const STATUS_COLORS = {
  pending:     { bg: "#fef3c7", color: "#92400e" },
  "in-progress":{ bg: "#dbeafe", color: "#1e40af" },
  done:        { bg: "#d1fae5", color: "#065f46" },
};

export default function Challenges() {
  const [challenges, setChallenges] = useState([]);
  const [form,   setForm]   = useState({ title: "", description: "", dueDate: "" });
  const [error,  setError]  = useState("");
  const [loading,setLoading]= useState(false);
  const [filter, setFilter] = useState("all");

  const auth = isAuthenticated();

  useEffect(() => { if (auth) load(); }, [auth]);

  const load = async () => {
    try { setChallenges(await getChallenges()); }
    catch (e) { setError(e.message); }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setLoading(true);
    try {
      const c = await createChallenge(form);
      setChallenges([c, ...challenges]);
      setForm({ title: "", description: "", dueDate: "" });
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  const handleStatus = async (c) => {
    try {
      const u = await updateChallenge(c._id, { status: STATUS_CYCLE[c.status] });
      setChallenges(challenges.map(x => x._id === u._id ? u : x));
    } catch (e) { setError(e.message); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this challenge?")) return;
    try {
      await deleteChallenge(id);
      setChallenges(challenges.filter(c => c._id !== id));
    } catch (e) { setError(e.message); }
  };

  const filtered = filter === "all" ? challenges : challenges.filter(c => c.status === filter);
  const counts   = { all: challenges.length, pending: 0, "in-progress": 0, done: 0 };
  challenges.forEach(c => counts[c.status]++);

  if (!auth) return (
    <div className="page section">
      <h1>🎯 Challenges</h1>
      <p>Please <Link to="/login">log in</Link> to manage your challenges.</p>
    </div>
  );

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-main">

        <div className="page-header">
          <h1 className="section-title">🎯 Daily Challenges</h1>
          <p style={{ color: "#6b7280" }}>Track and manage your daily challenges.</p>
        </div>

        {error && <p className="error">{error}</p>}

        {/* Add form */}
        <div style={{ background: "#fff", borderRadius: 12, padding: 24, boxShadow: "0 4px 16px rgba(0,0,0,0.07)", marginBottom: 28 }}>
          <h3 style={{ margin: "0 0 16px", color: "var(--primary)" }}>+ Add New Challenge</h3>
          <form onSubmit={handleAdd} style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: 12, alignItems: "end" }}>
            <div>
              <label style={{ display: "block", fontWeight: 600, marginBottom: 6, fontSize: "0.88rem" }}>Title *</label>
              <input className="form-control" placeholder="e.g. Learn React Hooks"
                value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
            </div>
            <div>
              <label style={{ display: "block", fontWeight: 600, marginBottom: 6, fontSize: "0.88rem" }}>Description</label>
              <input className="form-control" placeholder="Optional details"
                value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
            </div>
            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? "Adding…" : "Add"}
            </button>
          </form>
        </div>

        {/* Filter tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {["all", "pending", "in-progress", "done"].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={{
                padding: "6px 16px", borderRadius: 99, border: "none", cursor: "pointer", fontWeight: 600, fontSize: "0.82rem",
                background: filter === f ? "var(--primary)" : "#e5e7eb",
                color:      filter === f ? "#fff" : "#374151",
              }}>
              {f === "all" ? `All (${counts.all})` : `${STATUS_LABEL[f]} (${counts[f]})`}
            </button>
          ))}
        </div>

        {/* List */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: 40, color: "#9ca3af" }}>
              No challenges found. Add one above! 🎯
            </div>
          ) : filtered.map(c => (
            <div key={c._id} style={{
              background: "#fff", borderRadius: 12, padding: "16px 20px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap",
              borderLeft: `4px solid ${STATUS_COLORS[c.status].color}`,
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: "1rem" }}>{c.title}</div>
                {c.description && <div style={{ color: "#6b7280", fontSize: "0.86rem", marginTop: 2 }}>{c.description}</div>}
                {c.dueDate && <div style={{ color: "#9ca3af", fontSize: "0.78rem", marginTop: 4 }}>
                  📅 Due: {new Date(c.dueDate).toLocaleDateString()}
                </div>}
              </div>
              <span style={{
                padding: "4px 12px", borderRadius: 99, fontSize: "0.78rem", fontWeight: 700,
                background: STATUS_COLORS[c.status].bg, color: STATUS_COLORS[c.status].color,
              }}>
                {STATUS_LABEL[c.status]}
              </span>
              <button onClick={() => handleStatus(c)}
                style={{ padding: "6px 14px", borderRadius: 8, border: "1.5px solid var(--primary)", background: "transparent", color: "var(--primary)", fontWeight: 600, fontSize: "0.82rem", cursor: "pointer" }}>
                Next →
              </button>
              <button onClick={() => handleDelete(c._id)}
                style={{ padding: "6px 12px", borderRadius: 8, border: "none", background: "#fee2e2", color: "#dc2626", fontWeight: 600, fontSize: "0.82rem", cursor: "pointer" }}>
                🗑
              </button>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
