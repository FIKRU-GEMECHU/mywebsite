import { useState } from "react";
import { sendChat } from "../Services/api";
import { isAuthenticated } from "../Services/auth";
import { Link } from "react-router-dom";

function AIChat() {
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const authenticated = isAuthenticated();

  const handleSend = async () => {
    const text = message.trim();
    if (!text) return;
    if (!authenticated) { setError("Please log in to use AI chat."); return; }

    setLoading(true);
    setError("");
    const userMsg = { role: "user", text, time: new Date() };
    setHistory((h) => [...h, userMsg]);
    setMessage("");

    try {
      const data = await sendChat({ prompt: text, type: "chat" });
      setHistory((h) => [...h, { role: "ai", text: data.response, time: new Date() }]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => { if (e.key === "Enter") handleSend(); };

  if (!authenticated) {
    return (
      <div className="ai-chat-box">
        <h2>🤖 AI Assistant</h2>
        <p>Please <Link to="/login">log in</Link> to use the AI chat.</p>
      </div>
    );
  }

  return (
    <div className="ai-chat-box">
      <h2>🤖 AI Assistant</h2>

      {error && <p className="error">{error}</p>}

      <div className="chat-input-row">
        <input
          className="form-control"
          type="text"
          placeholder="Ask AI anything..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKey}
          disabled={loading}
        />
        <button className="btn btn-primary" onClick={handleSend} disabled={loading}>
          {loading ? "…" : "Send"}
        </button>
      </div>

      {history.length > 0 && (
        <div className="chat-history">
          {history.map((m, i) => (
            <div key={i} className={`chat-msg ${m.role}`}>
              {m.text}
              <small>{m.time.toLocaleTimeString()}</small>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AIChat;
