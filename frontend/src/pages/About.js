import { Link } from "react-router-dom";
import profile from "../components/fikru.jpg";

function About() {
  return (
    <section style={{ background: "#111", padding: "80px 0" }}>
      <div className="page">
        <h1 className="section-title">ABOUT <span style={{ color: "var(--accent)" }}>ME</span></h1>
        <div className="divider" />

        <div className="about-grid">
          <div>
            <img src={profile} alt="Fikru Gemechu Tadese" className="about-photo" />
          </div>

          <div>
            <h2 style={{ color: "#fff", fontSize: "1.6rem", marginBottom: 4 }}>
              Fikru Gemechu <span style={{ color: "var(--accent)" }}>Tadese</span>
            </h2>
            <p style={{ color: "var(--accent)", fontSize: "0.88rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 20 }}>
              Junior IT Officer · Network Administrator · Web Developer
            </p>
            <p style={{ color: "#999", lineHeight: 1.9, marginBottom: 24 }}>
              I am a Computer Science graduate currently working as a
              <strong style={{ color: "#fff" }}> Junior IT Officer at Habesha Cement</strong>.
              Passionate about building scalable software, managing enterprise networks,
              and applying artificial intelligence to solve real business problems in Ethiopia.
            </p>

            <ul className="info-list" style={{ marginBottom: 32 }}>
              <li><span>🎓 Education</span> BSc Computer Science</li>
              <li><span>💼 Role</span> Junior IT Officer / Network Admin</li>
              <li><span>🏢 Company</span> Habesha Cement S.C.</li>
              <li><span>📍 Location</span> Addis Ababa / Holeta, Ethiopia</li>
              <li><span>📧 Email</span> fikrigemechu@gmail.com</li>
              <li><span>📞 Phone</span> +251 926 490 517</li>
            </ul>

            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              <Link to="/contact" className="btn btn-primary">Hire Me</Link>
              <Link to="/projects" className="btn btn-outline">My Projects</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
