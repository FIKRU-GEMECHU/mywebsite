import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { getGoals, createGoal, updateGoal, deleteGoal } from "../Services/api";
import { isAuthenticated } from "../Services/auth";

export default function Goals() {
  const [goals,  setGoals]  = useState([]);
  const [form,   setForm]   = useState({ title: "", description: "", targetDate: "" });
  const [error,  setError]  = useState("");
  const [loading,setLoading]= useState(false);
  const [filter, setFilter] = useState("all");

  const auth = isAuthenticated();

  useEffect(() => { if (auth) load(); }, [auth]);

  const load = async () => {
    try { setGoals(await getGoals()); }
    catch (e) { setError(e.message); }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setLoading(true);
    try {
      const g = await createGoal(form);
      setGoals([g, ...goals]);
      setForm({ title: "", description: "", targetDate: "" });
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  const handleProgress = async (g, val) => {
    try {
      const u = await updateGoal(g._id, { progress: val, completed: val === 100 });
      setGoals(goals.map(x => x._id === u._id ? u : x));
    } catch (e) { setError(e.message); }
  };

  const handleToggle = async (g) => {
    try {
      const u = await updateGoal(g._id, { completed: !g.completed, progress: !g.completed ? 100 : g.progress });
      setGoals(goals.map(x => x._id === u._id ? u : x));
    } catch (e) { setError(e.message); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this goal?")) return;
    try {
      await deleteGoal(id);
      setGoals(goals.filter(g => g._id !== id));
    } catch (e) { setError(e.message); }
  };

  const filtered = filter === "all" ? goals
    : filter === "done"   ? goals.filter(g => g.completed)
    : goals.filter(g => !g.completed);

  const counts = { all: goals.length, active: goals.filter(g => !g.completed).length, done: goals.filter(g => g.completed).length };

  if (!auth) return (
    <div className="page section">
      <h1>🏆 Goals</h1>
      <p>Please <Link to="/login">log in</Link> to manage your goals.</p>
    </div>
  );

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-main">

        <div className="page-header">
          <h1 className="section-title">🏆 Goals</h1>
          <p style={{ color: "#6b7280" }}>Set goals, track progress, and celebrate wins.</p>
        </div>

        {error && <p className="error">{error}</p>}

        {/* Progress summary */}
        <div style={{ display: "flex", gap: 16, marginBottom: 28, flexWrap: "wrap" }}>
          {[
            { label: "Total Goals",    value: counts.all,    color: "#6366f1" },
            { label: "Active",         value: counts.active, color: "#f59e0b" },
            { label: "Completed",      value: counts.done,   color: "#10b981" },
          ].map(s => (
            <div key={s.label} style={{ background: "#fff", borderRadius: 12, padding: "16px 24px", boxShadow: "0 2px 8px rgba(0,0,0,0.07)", textAlign: "center", flex: 1, minWidth: 100, borderTop: `3px solid ${s.color}` }}>
              <div style={{ fontSize: "2rem", fontWeight: 800, color: s.color }}>{s.value}</div>
              <div style={{ color: "#6b7280", fontSize: "0.82rem" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Add form */}
        <div style={{ background: "#fff", borderRadius: 12, padding: 24, boxShadow: "0 4px 16px rgba(0,0,0,0.07)", marginBottom: 28 }}>
          <h3 style={{ margin: "0 0 16px", color: "var(--primary)" }}>+ Add New Goal</h3>
          <form onSubmit={handleAdd} style={{ display: "grid", gridTemplateColumns: "2fr 2fr 1fr auto", gap: 12, alignItems: "end" }}>
            <div>
              <label style={{ display: "block", fontWeight: 600, marginBottom: 6, fontSize: "0.88rem" }}>Title *</label>
              <input className="form-control" placeholder="e.g. Launch my startup"
                value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
            </div>
            <div>
              <label style={{ display: "block", fontWeight: 600, marginBottom: 6, fontSize: "0.88rem" }}>Description</label>
              <input className="form-control" placeholder="Optional"
                value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
            </div>
            <div>
              <label style={{ display: "block", fontWeight: 600, marginBottom: 6, fontSize: "0.88rem" }}>Target Date</label>
              <input className="form-control" type="date"
                value={form.targetDate} onChange={e => setForm({ ...form, targetDate: e.target.value })} />
            </div>
            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? "Adding…" : "Add"}
            </button>
          </form>
        </div>

        {/* Filter tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {["all", "active", "done"].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={{
                padding: "6px 16px", borderRadius: 99, border: "none", cursor: "pointer", fontWeight: 600, fontSize: "0.82rem",
                background: filter === f ? "var(--primary)" : "#e5e7eb",
                color:      filter === f ? "#fff" : "#374151",
              }}>
              {f.charAt(0).toUpperCase() + f.slice(1)} ({counts[f] ?? counts.all})
            </button>
          ))}
        </div>

        {/* Goals list */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: 40, color: "#9ca3af" }}>
              No goals here. Add one above! 🏆
            </div>
          ) : filtered.map(g => (
            <div key={g._id} style={{
              background: "#fff", borderRadius: 12, padding: "18px 22px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              borderLeft: `4px solid ${g.completed ? "#10b981" : "#f59e0b"}`,
              opacity: g.completed ? 0.75 : 1,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: "1rem", textDecoration: g.completed ? "line-through" : "none", color: g.completed ? "#9ca3af" : "inherit" }}>
                    {g.title}
                  </div>
                  {g.description && <div style={{ color: "#6b7280", fontSize: "0.86rem", marginTop: 2 }}>{g.description}</div>}
                  {g.targetDate && <div style={{ color: "#9ca3af", fontSize: "0.78rem", marginTop: 4 }}>
                    🗓 Target: {new Date(g.targetDate).toLocaleDateString()}
                  </div>}

                  {/* Progress bar */}
                  <div style={{ marginTop: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem", color: "#6b7280", marginBottom: 4 }}>
                      <span>Progress</span><span>{g.progress}%</span>
                    </div>
                    <input type="range" min="0" max="100" step="10"
                      value={g.progress}
                      onChange={e => handleProgress(g, Number(e.target.value))}
                      style={{ width: "100%", accentColor: g.completed ? "#10b981" : "#6366f1" }}
                    />
                  </div>
                </div>

                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <button onClick={() => handleToggle(g)}
                    style={{ padding: "6px 14px", borderRadius: 8, border: "none", cursor: "pointer", fontWeight: 600, fontSize: "0.82rem",
                      background: g.completed ? "#fef3c7" : "#d1fae5",
                      color:      g.completed ? "#92400e" : "#065f46" }}>
                    {g.completed ? "Undo" : "✓ Done"}
                  </button>
                  <button onClick={() => handleDelete(g._id)}
                    style={{ padding: "6px 12px", borderRadius: 8, border: "none", background: "#fee2e2", color: "#dc2626", fontWeight: 600, fontSize: "0.82rem", cursor: "pointer" }}>
                    🗑
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
