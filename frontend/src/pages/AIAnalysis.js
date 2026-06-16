import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { getReports, sendChat, deleteReport } from "../Services/api";
import { isAuthenticated } from "../Services/auth";

// ── Quick prompt categories ────────────────────────────
const PROMPT_CATEGORIES = [
  {
    label: "Career",
    color: "#00bcd4",
    prompts: [
      "Give me a career roadmap for an IT professional in Ethiopia",
      "What skills should I learn next as a network administrator?",
      "How can I transition from IT officer to software engineer?",
      "What certifications should I pursue in networking?",
    ],
  },
  {
    label: "Self Analysis",
    color: "#7c3aed",
    prompts: [
      "Analyze my strengths as a full-stack developer",
      "What are common weaknesses for junior IT officers?",
      "How can I improve my productivity and time management?",
      "What habits should a software developer build daily?",
    ],
  },
  {
    label: "Business",
    color: "#f59e0b",
    prompts: [
      "What are the best tech business ideas for Ethiopia in 2026?",
      "How do I start a freelance web development business?",
      "Analyze the AI market opportunity in East Africa",
      "How can I monetize my networking and IT skills?",
    ],
  },
];

// ── Not logged in screen ───────────────────────────────
function NotLoggedIn() {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-main" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", padding: 40 }}>
          <div style={{ fontSize: "4rem", marginBottom: 16 }}>🤖</div>
          <h2 style={{ color: "#fff", marginBottom: 12 }}>AI Analysis</h2>
          <p style={{ color: "#666", marginBottom: 24 }}>Please log in to use AI Analysis.</p>
          <Link to="/login" className="btn btn-primary">Login</Link>
        </div>
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────
export default function AIAnalysis() {
  const [reports, setReports] = useState([]);
  const [prompt,  setPrompt]  = useState("");
  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(false);
  const [tab,     setTab]     = useState("chat");
  const [chat,    setChat]    = useState([]);
  const [activeCat, setActiveCat] = useState(0);
  const bottomRef = useRef(null);

  const auth = isAuthenticated();

  useEffect(() => { if (auth) loadReports(); }, [auth]);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, loading]);

  const loadReports = async () => {
    try { setReports(await getReports()); }
    catch (e) { setError(e.message); }
  };

  const handleSend = async (text) => {
    const msg = (text || prompt).trim();
    if (!msg || loading) return;

    setChat(c => [...c, { role: "user", text: msg, time: new Date() }]);
    setPrompt("");
    setLoading(true);
    setError("");

    try {
      const data = await sendChat({ prompt: msg, type: "analysis" });
      setChat(c => [...c, { role: "ai", text: data.response, time: new Date() }]);
      setReports(r => [data, ...r]);
    } catch (e) {
      setError(e.message);
      setChat(c => [...c, {
        role: "ai",
        text: `❌ Error: ${e.message}`,
        time: new Date(),
        isError: true,
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this report?")) return;
    try {
      await deleteReport(id);
      setReports(reports.filter(r => r._id !== id));
    } catch (e) { setError(e.message); }
  };

  const clearChat = () => {
    if (window.confirm("Clear chat history?")) setChat([]);
  };

  if (!auth) return <NotLoggedIn />;

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-main" style={{ background: "#111", padding: "32px 36px" }}>

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: "1.6rem", fontWeight: 900, color: "#fff", textTransform: "uppercase", letterSpacing: 2 }}>
            🤖 AI <span style={{ color: "var(--accent)" }}>Analysis</span>
          </h1>
          <div style={{ width: 48, height: 3, background: "var(--accent)", borderRadius: 2, margin: "10px 0" }} />
          <p style={{ color: "#666", fontSize: "0.88rem" }}>
            Chat with Gemini AI for career insights, self-analysis, and business advice.
          </p>
        </div>

        {error && (
          <div style={{ background: "rgba(255,82,82,0.1)", border: "1px solid rgba(255,82,82,0.3)", color: "#ff5252", padding: "10px 16px", borderRadius: 6, marginBottom: 16, fontSize: "0.87rem" }}>
            ❌ {error}
          </div>
        )}

        {/* Tabs */}
        <div style={{ display: "flex", gap: 0, marginBottom: 24, borderBottom: "1px solid #2a2a2a" }}>
          {[
            ["chat",    "💬 AI Chat"],
            ["history", `📋 History (${reports.length})`],
          ].map(([key, label]) => (
            <button key={key} onClick={() => setTab(key)} style={{
              padding: "10px 22px", border: "none", background: "none",
              cursor: "pointer", fontWeight: 700, fontSize: "0.82rem",
              textTransform: "uppercase", letterSpacing: 1,
              color:        tab === key ? "var(--accent)" : "#555",
              borderBottom: tab === key ? "2px solid var(--accent)" : "2px solid transparent",
              marginBottom: -1,
            }}>
              {label}
            </button>
          ))}
        </div>

        {/* ── CHAT TAB ────────────────────────────────── */}
        {tab === "chat" && (
          <div style={{ display: "flex", gap: 24, height: "calc(100vh - 300px)", minHeight: 500 }}>

            {/* Left — quick prompts panel */}
            <div style={{ width: 240, flexShrink: 0, display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ fontSize: "0.7rem", color: "#555", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 4 }}>
                Quick Prompts
              </div>

              {/* Category tabs */}
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {PROMPT_CATEGORIES.map((cat, i) => (
                  <button key={cat.label} onClick={() => setActiveCat(i)} style={{
                    padding: "4px 12px", borderRadius: 4, border: `1px solid ${activeCat === i ? cat.color : "#2a2a2a"}`,
                    background: activeCat === i ? cat.color + "20" : "transparent",
                    color: activeCat === i ? cat.color : "#555",
                    fontSize: "0.72rem", fontWeight: 700, cursor: "pointer", letterSpacing: 0.5,
                  }}>
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Prompt buttons */}
              <div style={{ display: "flex", flexDirection: "column", gap: 8, overflowY: "auto" }}>
                {PROMPT_CATEGORIES[activeCat].prompts.map(q => (
                  <button key={q} onClick={() => handleSend(q)} disabled={loading}
                    style={{
                      textAlign: "left", padding: "10px 12px", borderRadius: 6,
                      border: `1px solid #2a2a2a`, background: "#1a1a1a",
                      color: "#888", fontSize: "0.78rem", lineHeight: 1.5,
                      cursor: "pointer", transition: "all 0.2s",
                    }}
                    onMouseOver={e => {
                      e.currentTarget.style.borderColor = PROMPT_CATEGORIES[activeCat].color;
                      e.currentTarget.style.color = "#fff";
                    }}
                    onMouseOut={e => {
                      e.currentTarget.style.borderColor = "#2a2a2a";
                      e.currentTarget.style.color = "#888";
                    }}>
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {/* Right — chat area */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#1a1a1a", borderRadius: 8, border: "1px solid #2a2a2a", overflow: "hidden" }}>

              {/* Chat header */}
              <div style={{ padding: "14px 20px", borderBottom: "1px solid #2a2a2a", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#00e676", boxShadow: "0 0 6px #00e676" }} />
                  <span style={{ color: "#ccc", fontSize: "0.85rem", fontWeight: 700 }}>
                    Gemini AI Assistant
                  </span>
                </div>
                {chat.length > 0 && (
                  <button onClick={clearChat} style={{
                    padding: "4px 12px", borderRadius: 4, border: "1px solid #333",
                    background: "transparent", color: "#555", fontSize: "0.75rem", cursor: "pointer",
                  }}>
                    Clear
                  </button>
                )}
              </div>

              {/* Messages */}
              <div style={{ flex: 1, overflowY: "auto", padding: 20, display: "flex", flexDirection: "column", gap: 16 }}>
                {chat.length === 0 && (
                  <div style={{ textAlign: "center", marginTop: 60 }}>
                    <div style={{ fontSize: "3.5rem", marginBottom: 16 }}>🤖</div>
                    <p style={{ color: "#444", fontSize: "0.9rem", lineHeight: 1.8 }}>
                      Ask me anything about your career,<br />
                      goals, analysis, or business ideas.
                    </p>
                    <p style={{ color: "var(--accent)", fontSize: "0.78rem", marginTop: 8 }}>
                      ← Pick a quick prompt or type below
                    </p>
                  </div>
                )}

                {chat.map((m, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
                    {m.role === "ai" && (
                      <div style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", marginRight: 8, flexShrink: 0, alignSelf: "flex-end" }}>
                        🤖
                      </div>
                    )}
                    <div style={{
                      maxWidth: "72%", padding: "12px 16px", borderRadius: 8,
                      fontSize: "0.88rem", lineHeight: 1.75,
                      background: m.role === "user" ? "var(--accent)" : m.isError ? "rgba(255,82,82,0.1)" : "#252525",
                      color:      m.role === "user" ? "#111" : m.isError ? "#ff5252" : "#ddd",
                      border:     m.role === "ai" ? "1px solid #333" : "none",
                      fontWeight: m.role === "user" ? 600 : 400,
                      whiteSpace: "pre-wrap",
                    }}>
                      {m.text}
                      <div style={{ fontSize: "0.68rem", opacity: 0.5, marginTop: 6, textAlign: m.role === "user" ? "right" : "left" }}>
                        {m.time.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}

                {loading && (
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem" }}>
                      🤖
                    </div>
                    <div style={{ padding: "12px 16px", borderRadius: 8, background: "#252525", border: "1px solid #333" }}>
                      <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                        {[0, 1, 2].map(i => (
                          <div key={i} style={{
                            width: 7, height: 7, borderRadius: "50%", background: "var(--accent)",
                            animation: `bounce 1.2s ${i * 0.2}s infinite`,
                          }} />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              {/* Input area */}
              <div style={{ padding: "14px 16px", borderTop: "1px solid #2a2a2a", display: "flex", gap: 10 }}>
                <input
                  style={{
                    flex: 1, padding: "11px 16px", background: "#252525",
                    border: "1px solid #333", borderRadius: 6, color: "#fff",
                    fontSize: "0.9rem", outline: "none",
                  }}
                  placeholder="Ask AI anything… (Enter to send)"
                  value={prompt}
                  onChange={e => setPrompt(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && !e.shiftKey && handleSend()}
                  onFocus={e  => e.target.style.borderColor = "var(--accent)"}
                  onBlur={e   => e.target.style.borderColor = "#333"}
                  disabled={loading}
                />
                <button
                  onClick={() => handleSend()}
                  disabled={loading || !prompt.trim()}
                  style={{
                    padding: "11px 22px", borderRadius: 6, border: "none",
                    background: loading || !prompt.trim() ? "#2a2a2a" : "var(--accent)",
                    color: loading || !prompt.trim() ? "#444" : "#111",
                    fontWeight: 700, fontSize: "0.85rem", cursor: "pointer",
                    textTransform: "uppercase", letterSpacing: 1, transition: "all 0.2s",
                  }}>
                  {loading ? "…" : "Send"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── HISTORY TAB ─────────────────────────────── */}
        {tab === "history" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {reports.length === 0 ? (
              <div style={{ textAlign: "center", padding: 60, color: "#444", background: "#1a1a1a", borderRadius: 8, border: "1px solid #2a2a2a" }}>
                <div style={{ fontSize: "3rem", marginBottom: 12 }}>🤖</div>
                <p>No AI reports yet. Start a conversation!</p>
              </div>
            ) : reports.map(r => (
              <div key={r._id} style={{ background: "#1a1a1a", borderRadius: 8, border: "1px solid #2a2a2a", overflow: "hidden", transition: "border-color 0.2s" }}
                onMouseOver={e => e.currentTarget.style.borderColor = "#333"}
                onMouseOut={e  => e.currentTarget.style.borderColor = "#2a2a2a"}>

                {/* Prompt */}
                <div style={{ padding: "14px 20px", borderBottom: "1px solid #2a2a2a", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                  <div style={{ display: "flex", gap: 10, alignItems: "flex-start", flex: 1 }}>
                    <span style={{ color: "var(--accent)", fontSize: "0.78rem", fontWeight: 700, background: "rgba(0,188,212,0.1)", padding: "2px 8px", borderRadius: 4, border: "1px solid rgba(0,188,212,0.2)", whiteSpace: "nowrap" }}>
                      YOU
                    </span>
                    <span style={{ color: "#ccc", fontSize: "0.9rem", fontWeight: 600 }}>{r.prompt}</span>
                  </div>
                  <button onClick={() => handleDelete(r._id)}
                    style={{ padding: "4px 10px", borderRadius: 4, border: "1px solid #333", background: "transparent", color: "#555", fontSize: "0.75rem", cursor: "pointer", whiteSpace: "nowrap" }}
                    onMouseOver={e => { e.currentTarget.style.background = "rgba(255,82,82,0.1)"; e.currentTarget.style.color = "#ff5252"; e.currentTarget.style.borderColor = "rgba(255,82,82,0.3)"; }}
                    onMouseOut={e  => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#555"; e.currentTarget.style.borderColor = "#333"; }}>
                    🗑 Delete
                  </button>
                </div>

                {/* Response */}
                <div style={{ padding: "14px 20px" }}>
                  <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <span style={{ color: "#111", fontSize: "0.72rem", fontWeight: 700, background: "var(--accent)", padding: "2px 8px", borderRadius: 4, whiteSpace: "nowrap" }}>
                      AI
                    </span>
                    <pre style={{ color: "#888", fontSize: "0.87rem", lineHeight: 1.75, whiteSpace: "pre-wrap", fontFamily: "inherit", margin: 0, flex: 1 }}>
                      {r.response}
                    </pre>
                  </div>
                  <div style={{ marginTop: 12, fontSize: "0.72rem", color: "#444" }}>
                    {new Date(r.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bounce animation */}
      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40%            { transform: scale(1);   opacity: 1;   }
        }
      `}</style>
    </div>
  );
}
