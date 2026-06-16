import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer style={{
      background: "#0a0a0a",
      borderTop: "1px solid #222",
      color: "#555",
    }}>
      {/* Main footer */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "60px 40px 40px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 48 }}>

        {/* Brand */}
        <div>
          <h3 style={{ color: "#fff", fontWeight: 900, fontSize: "1.2rem", textTransform: "uppercase", letterSpacing: 2, marginBottom: 12 }}>
            PORT<span style={{ color: "var(--accent)" }}>FOLIO</span>
          </h3>
          <p style={{ color: "#555", fontSize: "0.87rem", lineHeight: 1.8, maxWidth: 240 }}>
            Building real solutions with code, networking, and AI. Based in Ethiopia.
          </p>
        </div>

        {/* Portfolio Links */}
        <div>
          <h4 style={{ color: "var(--accent)", fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: 2, marginBottom: 20 }}>Navigation</h4>
          <ul style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { to: "/",         label: "Home" },
              { to: "/about",    label: "About" },
              { to: "/skills",   label: "Services" },
              { to: "/projects", label: "Portfolio" },
              { to: "/contact",  label: "Contact" },
            ].map(l => (
              <li key={l.to}>
                <Link to={l.to} style={{ color: "#666", fontSize: "0.88rem", transition: "color 0.2s" }}
                  onMouseOver={e => e.target.style.color = "var(--accent)"}
                  onMouseOut={e  => e.target.style.color = "#666"}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Dashboard Links */}
        <div>
          <h4 style={{ color: "var(--accent)", fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: 2, marginBottom: 20 }}>AI Dashboard</h4>
          <ul style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { to: "/dashboard",     label: "Dashboard" },
              { to: "/challenges",    label: "Challenges" },
              { to: "/goals",         label: "Goals" },
              { to: "/business-plan", label: "Business Plan" },
              { to: "/ai-analysis",   label: "AI Analysis" },
            ].map(l => (
              <li key={l.to}>
                <Link to={l.to} style={{ color: "#666", fontSize: "0.88rem", transition: "color 0.2s" }}
                  onMouseOver={e => e.target.style.color = "var(--accent)"}
                  onMouseOut={e  => e.target.style.color = "#666"}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 style={{ color: "var(--accent)", fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: 2, marginBottom: 20 }}>Contact</h4>
          <ul style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <li style={{ fontSize: "0.87rem", color: "#666" }}>
              <a href="mailto:fikrigemechu@gmail.com" style={{ color: "#666" }}
                onMouseOver={e => e.target.style.color = "var(--accent)"}
                onMouseOut={e  => e.target.style.color = "#666"}>
                📧 fikrigemechu@gmail.com
              </a>
            </li>
            <li style={{ fontSize: "0.87rem", color: "#666" }}>
              <a href="tel:+251926490517" style={{ color: "#666" }}
                onMouseOver={e => e.target.style.color = "var(--accent)"}
                onMouseOut={e  => e.target.style.color = "#666"}>
                📞 +251 926 490 517
              </a>
            </li>
            <li style={{ fontSize: "0.87rem", color: "#666" }}>📍 Addis Ababa, Ethiopia</li>
            <li style={{ fontSize: "0.87rem", color: "#666" }}>🏢 Habesha Cement S.C.</li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: "1px solid #1a1a1a", padding: "20px 40px", maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <p style={{ fontSize: "0.82rem" }}>
          © {new Date().getFullYear()} <strong style={{ color: "#fff" }}>Fikru Gemechu Tadese</strong> — All Rights Reserved
        </p>
        <p style={{ fontSize: "0.78rem", color: "#444" }}>
          Built with ⚛️ React · Node.js · MongoDB · <span style={{ color: "var(--accent)" }}>Gemini AI</span>
        </p>
      </div>
    </footer>
  );
}

export default Footer;
