import { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const existingId = sessionStorage.getItem("sessionId") || uuidv4();
    sessionStorage.setItem("sessionId", existingId);
    setSessionId(existingId);
    sendMessage("start_chat");
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text) => {
    if (!text) return;
    setLoading(true);
    setMessages((prev) => [...prev, { role: "user", content: text }]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, message: text })
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "bot", content: data.reply, buttons: data.buttons }]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [...prev, { role: "bot", content: "Something went wrong. Please try again." }]);
    }
    setLoading(false);
    setInput("");
  };

  const handleButtonClick = (btnText) => {
    sendMessage(btnText);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage(input.trim());
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <header style={{ padding: "10px", background: "#f0f0f0", textAlign: "center" }}>
        <img src="/Movingcompany1.PNG" alt="MovingCo Logo" style={{ maxWidth: "200px", marginBottom: "10px" }} />
        <img src="/Movingcompany2.PNG" alt="MoveSafe Verified" style={{ maxWidth: "150px", marginBottom: "10px" }} />
      </header>

      <main className="chat-container" style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div className="messages" style={{ flex: 1, overflowY: "auto", padding: "10px", background: "#fafafa" }}>
          {messages.map((msg, idx) => (
            <div key={idx} style={{ margin: "10px 0", textAlign: msg.role === "user" ? "right" : "left" }}>
              <div
                className="bubble"
                style={{
                  display: "inline-block",
                  padding: "12px 16px",
                  margin: "8px",
                  borderRadius: "20px",
                  background: msg.role === "user" ? "#d1e7dd" : "#e2e3e5",
                  maxWidth: "70%"
                }}
              >
                {msg.content}
              </div>
              {msg.buttons && (
                <div style={{ marginTop: "5px" }}>
                  {msg.buttons.map((btn, bIdx) => (
                    <button
                      key={bIdx}
                      onClick={() => handleButtonClick(btn)}
                      style={{
                        marginRight: "5px",
                        padding: "5px 10px",
                        borderRadius: "5px",
                        border: "none",
                        background: "#0d6efd",
                        color: "#fff",
                        cursor: "pointer"
                      }}
                    >
                      {btn}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSubmit} className="input-area" style={{ display: "flex", padding: "10px", background: "#f0f0f0" }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            style={{ flex: 1, padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
          />
          <button type="submit" disabled={loading} style={{ marginLeft: "5px", padding: "10px", borderRadius: "5px", background: "#0d6efd", color: "#fff", border: "none" }}>
            Send
          </button>
        </form>
      </main>

      <footer style={{ padding: "10px", background: "#f0f0f0", textAlign: "center", fontSize: "12px" }}>
        <a href="/terms" style={{ marginRight: "10px" }}>Terms of Service</a> |
        <a href="/privacy" style={{ marginLeft: "10px" }}>Privacy Policy</a>
        <p style={{ marginTop: "5px" }}>&copy; 2025 MovingCo. All rights reserved.</p>
      </footer>
    </div>
  );
}