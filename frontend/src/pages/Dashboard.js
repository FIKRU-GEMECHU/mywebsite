import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import AIChat from "../components/AIChat";
import { getChallenges, getGoals, getPlans, getReports } from "../Services/api";
import { getUser, isAuthenticated, logout } from "../Services/auth";

function StatCard({ icon, label, value, to, color }) {
  return (
    <Link to={to} style={{ textDecoration: "none" }}>
      <div style={{
        background: "#fff", borderRadius: 12, padding: "24px 28px",
        boxShadow: "0 4px 16px rgba(0,0,0,0.07)", flex: 1, minWidth: 160,
        borderTop: `4px solid ${color}`, transition: "transform 0.2s",
        cursor: "pointer",
      }}
        onMouseOver={e => e.currentTarget.style.transform = "translateY(-4px)"}
        onMouseOut={e  => e.currentTarget.style.transform = "translateY(0)"}
      >
        <div style={{ fontSize: "2rem", marginBottom: 8 }}>{icon}</div>
        <div style={{ fontSize: "2.4rem", fontWeight: 800, color }}>{value}</div>
        <div style={{ color: "#6b7280", fontSize: "0.88rem", marginTop: 4 }}>{label}</div>
      </div>
    </Link>
  );
}

function Dashboard() {
  const navigate = useNavigate();
  const user = getUser();
  const [stats, setStats]     = useState({ challenges: 0, goals: 0, plans: 0, ai: 0 });
  const [recent, setRecent]   = useState({ challenges: [], goals: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) { navigate("/login"); return; }
    fetchAll();
  }, [navigate]);

  const fetchAll = async () => {
    try {
      const [challenges, goals, plans, reports] = await Promise.all([
        getChallenges(), getGoals(), getPlans(), getReports(),
      ]);
      setStats({
        challenges: challenges.length,
        goals:      goals.length,
        plans:      plans.length,
        ai:         reports.length,
      });
      setRecent({
        challenges: challenges.slice(0, 3),
        goals:      goals.slice(0, 3),
      });
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => { logout(); navigate("/login"); };

  const statusColor = { pending: "#f59e0b", "in-progress": "#3b82f6", done: "#10b981" };

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <div className="dashboard-main">

        {/* Header row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
          <div>
            <h1 style={{ fontSize: "1.9rem", margin: 0 }}>
              👋 Welcome back, <span style={{ color: "var(--primary)" }}>{user?.name}</span>
            </h1>
            <p style={{ color: "#6b7280", marginTop: 4 }}>
              {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>
          <button className="btn btn-outline btn-sm" onClick={handleLogout}>🚪 Logout</button>
        </div>

        <hr style={{ borderColor: "#e5e7eb", margin: "20px 0 28px" }} />

        {/* Stat cards */}
        {loading ? (
          <p style={{ color: "#6b7280" }}>Loading dashboard…</p>
        ) : (
          <>
            <div style={{ display: "flex", gap: 20, flexWrap: "wrap", marginBottom: 36 }}>
              <StatCard icon="🎯" label="Challenges"    value={stats.challenges} to="/challenges"    color="#f59e0b" />
              <StatCard icon="🏆" label="Goals"         value={stats.goals}      to="/goals"         color="#10b981" />
              <StatCard icon="📈" label="Business Plans"value={stats.plans}      to="/business-plan" color="#6366f1" />
              <StatCard icon="🤖" label="AI Reports"    value={stats.ai}         to="/ai-analysis"   color="#0ea5e9" />
            </div>

            {/* Recent activity */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 32 }}>

              {/* Recent challenges */}
              <div style={{ background: "#fff", borderRadius: 12, padding: 24, boxShadow: "0 4px 16px rgba(0,0,0,0.07)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <h3 style={{ margin: 0, color: "var(--primary)" }}>🎯 Recent Challenges</h3>
                  <Link to="/challenges" style={{ fontSize: "0.82rem", color: "var(--primary-light)" }}>View all →</Link>
                </div>
                {recent.challenges.length === 0 ? (
                  <p style={{ color: "#9ca3af", fontSize: "0.9rem" }}>No challenges yet. <Link to="/challenges">Add one →</Link></p>
                ) : recent.challenges.map((c) => (
                  <div key={c._id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #f3f4f6" }}>
                    <span style={{ fontSize: "0.92rem", fontWeight: 500 }}>{c.title}</span>
                    <span style={{ fontSize: "0.75rem", fontWeight: 700, padding: "2px 10px", borderRadius: 99, background: statusColor[c.status] + "22", color: statusColor[c.status] }}>
                      {c.status}
                    </span>
                  </div>
                ))}
              </div>

              {/* Recent goals */}
              <div style={{ background: "#fff", borderRadius: 12, padding: 24, boxShadow: "0 4px 16px rgba(0,0,0,0.07)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <h3 style={{ margin: 0, color: "var(--primary)" }}>🏆 Recent Goals</h3>
                  <Link to="/goals" style={{ fontSize: "0.82rem", color: "var(--primary-light)" }}>View all →</Link>
                </div>
                {recent.goals.length === 0 ? (
                  <p style={{ color: "#9ca3af", fontSize: "0.9rem" }}>No goals yet. <Link to="/goals">Add one →</Link></p>
                ) : recent.goals.map((g) => (
                  <div key={g._id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #f3f4f6" }}>
                    <span style={{ fontSize: "0.92rem", fontWeight: 500, textDecoration: g.completed ? "line-through" : "none", color: g.completed ? "#9ca3af" : "inherit" }}>
                      {g.title}
                    </span>
                    <span style={{ fontSize: "0.75rem", fontWeight: 700, padding: "2px 10px", borderRadius: 99,
                      background: g.completed ? "#d1fae5" : "#fef3c7",
                      color:      g.completed ? "#065f46" : "#92400e" }}>
                      {g.completed ? "Done" : "Active"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick links */}
            <div style={{ background: "#fff", borderRadius: 12, padding: 24, boxShadow: "0 4px 16px rgba(0,0,0,0.07)", marginBottom: 32 }}>
              <h3 style={{ margin: "0 0 16px", color: "var(--primary)" }}>⚡ Quick Actions</h3>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <Link to="/challenges"    className="btn btn-primary btn-sm">+ New Challenge</Link>
                <Link to="/goals"         className="btn btn-primary btn-sm">+ New Goal</Link>
                <Link to="/business-plan" className="btn btn-primary btn-sm">+ Generate Plan</Link>
                <Link to="/ai-analysis"   className="btn btn-primary btn-sm">+ Ask AI</Link>
              </div>
            </div>
          </>
        )}

        {/* AI Chat */}
        <AIChat />

      </div>
    </div>
  );
}

export default Dashboard;
