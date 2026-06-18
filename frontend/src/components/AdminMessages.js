import { useEffect, useState } from "react";

function AdminMessages() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    fetch("https://mywebsite-10.onrender.com/api/contacts")
      .then((res) => res.json())
      .then((data) => setMessages(data));
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>📩 Contact Messages</h2>

      {messages.length === 0 ? (
        <p>No messages yet</p>
      ) : (
        messages.map((msg) => (
          <div key={msg._id} style={{ border: "1px solid #ccc", margin: 10, padding: 10 }}>
            <h3>{msg.name}</h3>
            <p>{msg.email}</p>
            <p>{msg.subject}</p>
            <p>{msg.message}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default AdminMessages;