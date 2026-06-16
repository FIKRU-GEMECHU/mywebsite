const PROJECTS = [
  {
    emoji: "🤖",
    title: "Personal AI Life & Business Assistant",
    desc: "A full-stack AI-powered platform to track daily challenges, set goals, generate business plans, and chat with AI.",
    tags: ["React", "Node.js", "MongoDB", "Gemini AI", "JWT"],
    status: "In Progress",
    statusColor: "#00bcd4",
  },
  {
    emoji: "🌐",
    title: "Portfolio Website",
    desc: "Professional portfolio with React frontend, Node.js backend, auth-protected AI dashboard, and dark UI design.",
    tags: ["React", "Node.js", "CSS", "React Router"],
    status: "Live",
    statusColor: "#00e676",
  },
  {
    emoji: "🖧",
    title: "Network Infrastructure — Habesha Cement",
    desc: "Managed enterprise LAN/WAN infrastructure including DHCP, switch configs, Active Directory, and IT support.",
    tags: ["Networking", "Windows Server", "DHCP", "Active Directory"],
    status: "Professional",
    statusColor: "#ffab40",
  },
  {
    emoji: "📦",
    title: "ERP Support — Microsoft Dynamics NAV",
    desc: "Technical support and customization for MS Dynamics NAV across finance and operations departments.",
    tags: ["ERP", "MS Dynamics NAV", "IT Support"],
    status: "Professional",
    statusColor: "#ffab40",
  },
];

function Projects() {
  return (
    <section style={{ background: "#111", padding: "80px 0" }}>
      <div className="page">
        <h1 className="section-title">MY <span style={{ color: "var(--accent)" }}>PROJECTS</span></h1>
        <div className="divider" />
        <p className="section-sub">A selection of work I've built and contributed to.</p>

        <div className="projects-grid">
          {PROJECTS.map((p) => (
            <div key={p.title} className="project-card">
              <div style={{ padding: "24px 24px 0", fontSize: "2.8rem" }}>{p.emoji}</div>
              <div className="project-card-body">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 10 }}>
                  <h3 style={{ flex: 1 }}>{p.title}</h3>
                  <span style={{
                    fontSize: "0.7rem", fontWeight: 700, padding: "3px 10px",
                    borderRadius: 4, background: p.statusColor + "18",
                    color: p.statusColor, border: `1px solid ${p.statusColor}44`,
                    whiteSpace: "nowrap", letterSpacing: "0.5px",
                  }}>
                    {p.status}
                  </span>
                </div>
                <p>{p.desc}</p>
                <div className="project-tags">
                  {p.tags.map((t) => <span key={t} className="tag">{t}</span>)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Projects;
