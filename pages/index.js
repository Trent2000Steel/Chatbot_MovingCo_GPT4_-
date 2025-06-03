
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [loading, setLoading] = useState(false);
  const [clickedButtons, setClickedButtons] = useState([]);
  const [clickedButtons, setClickedButtons] = useState([]);
  const messagesEndRef = useRef(null);

  const stripeLink = "https://buy.stripe.com/eVqbJ23Px8yx4Ab2aUenS00";

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
        body: JSON.stringify({ sessionId, userInput: text })
      });
      const data = await res.json();

      setTimeout(() => {
        setMessages((prev) => [...prev, { role: "bot", content: data.message, buttons: data.buttons, phase: data.phase }]);
        setLoading(false);
      }, 800);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [...prev, { role: "bot", content: "Something went wrong. Please try again." }]);
      setLoading(false);
    }
    setInput("");
  };

  const handleButtonClick = (btnText) => {
    setClickedButtons((prev) => [...prev, btnText]);
    setClickedButtons((prev) => [...prev, btnText]);
    sendMessage(btnText);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage(input.trim());
    }
  };

  const renderMessage = (msg, idx) => {
    return (
      <div key={idx} style={{ margin: "12px 0", textAlign: msg.role === "user" ? "right" : "left" }}>
        <div
          style={{
            display: "inline-block",
            padding: "14px 18px",
            margin: "6px",
            borderRadius: "20px",
            fontSize: "16px",
            background: msg.role === "user" ? "#cce5ff" : "#e2e3e5",
            maxWidth: "75%",
            whiteSpace: "pre-wrap"
          }}
        >
          {msg.content}
        </div>
        {msg.phase === 999 && (
          <div style={{ marginTop: "12px", textAlign: "center" }}>
            <a
              href={stripeLink}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-block",
                padding: "12px 24px",
                borderRadius: "6px",
                background: "#28a745",
                color: "#fff",
                fontSize: "16px",
                textDecoration: "none",
                boxShadow: "0 6px 12px rgba(0,0,0,0.3)",
                transition: "transform 0.1s",
              }}
            >
              Reserve My Move Now ($85)
            </a>
          </div>
        )}
        {msg.buttons && (
          <div style={{ marginTop: "8px" }}>
            {msg.buttons.map((btn, bIdx) => {
              const isDisabled = clickedButtons.includes(btn); (
              <button
                key={bIdx}
                onClick={() => !isDisabled && handleButtonClick(btn)} disabled={isDisabled}
                style={{
                  marginRight: "8px",
                  marginTop: "4px",
                  padding: "6px 12px",
                  borderRadius: "6px",
                  border: "none",
                  background: btn.includes("How It Works") ? "#6c757d" : "#0d6efd",
                  color: "#fff",
                  cursor: isDisabled ? "not-allowed" : "pointer", opacity: isDisabled ? 0.5 : 1,
                  fontSize: "14px",
                  boxShadow: "0 6px 12px rgba(0,0,0,0.3)",
                  transition: "transform 0.1s",
                }}
                onMouseDown={(e) => e.currentTarget.style.transform = "scale(0.95)"}
                onMouseUp={(e) => e.currentTarget.style.transform = "scale(1)"}
                onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
              >
                {btn}
              </button>
                );
              })          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", fontFamily: "Arial, sans-serif" }}>
      <header style={{ background: "#f8f9fa", textAlign: "center" }}>
        <img src="/Movingcompany1.PNG" alt="MovingCo Header" style={{ width: "100%", height: "auto", maxWidth: "600px" }} />
      </header>

      <main
        className="chat-container"
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          border: "1px solid #ccc",
          borderRadius: "10px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          margin: "10px"
        }}
      >
        <div className="messages" style={{ flex: 1, overflowY: "auto", padding: "15px", background: "#fafafa" }}>
          {messages.map((msg, idx) => msg.content === "start_chat" ? null : renderMessage(msg, idx))}
          {loading && (
            <div style={{ margin: "12px 0", textAlign: "left", fontStyle: "italic", color: "#666" }}>...</div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSubmit} className="input-area" style={{ display: "flex", padding: "12px", background: "#f0f0f0", borderTop: "1px solid #ccc" }}>
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
