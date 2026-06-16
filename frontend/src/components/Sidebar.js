import { NavLink, useNavigate } from "react-router-dom";
import { getUser, logout } from "../Services/auth";

const links = [
  { to: "/dashboard",     label: "📊 Dashboard",      },
  { to: "/challenges",    label: "🎯 Challenges",      },
  { to: "/goals",         label: "🏆 Goals",           },
  { to: "/business-plan", label: "📈 Business Plan",   },
  { to: "/ai-analysis",   label: "🤖 AI Analysis",     },
];

function Sidebar() {
  const navigate = useNavigate();
  const user = getUser();

  const handleLogout = () => { logout(); navigate("/login"); };

  return (
    <aside className="sidebar" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
      <div>
        {/* User info */}
        <div style={{ padding: "20px 20px 16px", borderBottom: "1px solid rgba(255,255,255,0.1)", marginBottom: 8 }}>
          <div style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.3rem", marginBottom: 8 }}>
            👤
          </div>
          <div style={{ color: "#fff", fontWeight: 700, fontSize: "0.92rem" }}>{user?.name || "User"}</div>
          <div style={{ color: "#99c5e5", fontSize: "0.75rem", marginTop: 2 }}>{user?.role || "user"}</div>
        </div>

        {/* Nav links */}
        <h3 style={{ color: "#99c5e5", padding: "12px 20px 8px", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: 1 }}>
          Navigation
        </h3>
        <ul style={{ padding: 0, listStyle: "none" }}>
          {links.map((l) => (
            <li key={l.to}>
              <NavLink
                to={l.to}
                className={({ isActive }) => isActive ? "active" : ""}
                style={({ isActive }) => ({
                  display: "block", padding: "11px 20px",
                  color: isActive ? "#fff" : "#99c5e5",
                  background: isActive ? "rgba(255,255,255,0.15)" : "transparent",
                  fontWeight: isActive ? 700 : 500,
                  fontSize: "0.9rem",
                  borderLeft: isActive ? "3px solid #fff" : "3px solid transparent",
                  transition: "all 0.2s",
                  textDecoration: "none",
                })}
              >
                {l.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      {/* Logout at bottom */}
      <div style={{ padding: "16px 20px", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
        <button onClick={handleLogout}
          style={{
            width: "100%", padding: "10px", borderRadius: 8,
            border: "1.5px solid rgba(255,255,255,0.3)", background: "transparent",
            color: "#cde", fontWeight: 600, fontSize: "0.88rem", cursor: "pointer",
            transition: "all 0.2s",
          }}
          onMouseOver={e => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; }}
          onMouseOut={e  => { e.currentTarget.style.background = "transparent"; }}
        >
          🚪 Logout
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
