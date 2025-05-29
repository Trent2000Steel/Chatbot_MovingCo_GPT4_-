import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const generateSessionId = () => Math.random().toString(36).substring(2) + Date.now().toString(36);

  useEffect(() => {
    const existingId = sessionStorage.getItem("sessionId") || generateSessionId();
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
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", fontFamily: "Arial, sans-serif" }}>
      <header style={{ background: "#f8f9fa", textAlign: "center" }}>
        <img src="/Movingcompany1.PNG" alt="MovingCo Logo" style={{ width: "100%", height: "auto" }} />
        <img src="/Movingcompany2.PNG" alt="MoveSafe Verified" style={{ width: "100%", height: "auto" }} />
      </header>

      <main
        className="chat-container"
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          border: "1px solid #ccc",
          margin: "10px"
        }}
      >
        <div className="messages" style={{ flex: 1, overflowY: "auto", padding: "15px", background: "#fafafa" }}>
          {messages.map((msg, idx) =>
            msg.content === "start_chat" ? null : (
              <div key={idx} style={{ margin: "12px 0", textAlign: msg.role === "user" ? "right" : "left" }}>
                <div
                  className="bubble"
                  style={{
                    display: "inline-block",
                    padding: "14px 18px",
                    margin: "6px",
                    borderRadius: "20px",
                    fontSize: "16px",
                    background: msg.role === "user" ? "#cce5ff" : "#e2e3e5",
                    maxWidth: "75%"
                  }}
                >
                  {msg.content}
                </div>
                {msg.buttons && (
                  <div style={{ marginTop: "8px" }}>
                    {msg.buttons.map((btn, bIdx) => (
                      <button
                        key={bIdx}
                        onClick={() => handleButtonClick(btn)}
                        style={{
                          marginRight: "8px",
                          padding: "6px 12px",
                          borderRadius: "6px",
                          border: "none",
                          background: "#0d6efd",
                          color: "#fff",
                          cursor: "pointer",
                          fontSize: "14px"
                        }}
                      >
                        {btn}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSubmit} className="input-area" style={{ display: "flex", padding: "12px", background: "#f0f0f0" }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            style={{ flex: 1, padding: "14px", fontSize: "16px", borderRadius: "6px", border: "1px solid #ccc" }}
          />
          <button type="submit" disabled={loading} style={{ marginLeft: "8px", padding: "14px 20px", borderRadius: "6px", background: "#0d6efd", color: "#fff", border: "none", fontSize: "16px" }}>
            Send
          </button>
        </form>
      </main>

      <footer style={{ padding: "12px", background: "#f8f9fa", textAlign: "center", fontSize: "12px" }}>
        <a href="/terms" style={{ marginRight: "10px" }}>Terms of Service</a> |
        <a href="/privacy" style={{ marginLeft: "10px" }}>Privacy Policy</a>
        <p style={{ marginTop: "6px" }}>&copy; 2025 MovingCo. All rights reserved.</p>
      </footer>
    </div>
  );
}