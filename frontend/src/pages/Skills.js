const SERVICES = [
  {
    icon: "🌐",
    title: "Network Administration",
    desc: "LAN/WAN setup, DHCP/DNS configuration, switch management, Active Directory, and enterprise IT support.",
    skills: [
      { name: "Network Admin", level: 85 },
      { name: "DHCP / DNS", level: 80 },
      { name: "LAN / WAN Support", level: 80 },
      { name: "Cisco Packet Tracer", level: 70 },
    ],
  },
  {
    icon: "🖥️",
    title: "Systems Administration",
    desc: "Windows Server, Ubuntu Linux, Active Directory management, and Microsoft Dynamics NAV ERP support.",
    skills: [
      { name: "Windows Server", level: 85 },
      { name: "Ubuntu Linux", level: 75 },
      { name: "Active Directory", level: 70 },
      { name: "MS Dynamics NAV", level: 65 },
    ],
  },
  {
    icon: "💻",
    title: "Web Development",
    desc: "Full-stack development with React, Node.js, Express, and MongoDB. REST API design and JWT authentication.",
    skills: [
      { name: "React.js", level: 80 },
      { name: "Node.js / Express", level: 75 },
      { name: "JavaScript ES6+", level: 80 },
      { name: "MongoDB", level: 70 },
    ],
  },
  {
    icon: "🤖",
    title: "AI & Tools",
    desc: "AI prompt engineering, REST API design, Git/GitHub version control, and database management.",
    skills: [
      { name: "AI / Gemini API", level: 70 },
      { name: "REST API Design", level: 75 },
      { name: "Git / GitHub", level: 75 },
      { name: "Database Design", level: 72 },
    ],
  },
];

function Skills() {
  return (
    <section style={{ background: "#111", padding: "80px 0" }}>
      <div className="page">
        <h1 className="section-title">MY <span style={{ color: "var(--accent)" }}>SERVICES</span></h1>
        <div className="divider" />
        <p className="section-sub">What I bring to the table professionally.</p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 28 }}>
          {SERVICES.map((s) => (
            <div key={s.title} style={{
              background: "#1a1a1a", borderRadius: 8, padding: 28,
              border: "1px solid #2a2a2a", transition: "all 0.3s",
            }}
              onMouseOver={e => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.transform = "translateY(-4px)"; }}
              onMouseOut={e  => { e.currentTarget.style.borderColor = "#2a2a2a";        e.currentTarget.style.transform = "translateY(0)"; }}
            >
              <div style={{ fontSize: "2.4rem", marginBottom: 12 }}>{s.icon}</div>
              <h3 style={{ color: "#fff", fontSize: "1rem", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>{s.title}</h3>
              <p style={{ color: "#777", fontSize: "0.87rem", lineHeight: 1.7, marginBottom: 20 }}>{s.desc}</p>

              {s.skills.map((sk) => (
                <div key={sk.name} style={{ marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem", color: "#888", marginBottom: 5 }}>
                    <span>{sk.name}</span>
                    <span style={{ color: "var(--accent)" }}>{sk.level}%</span>
                  </div>
                  <div style={{ height: 5, background: "#2a2a2a", borderRadius: 99 }}>
                    <div style={{ height: "100%", width: `${sk.level}%`, background: "var(--accent)", borderRadius: 99 }} />
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Skills;
