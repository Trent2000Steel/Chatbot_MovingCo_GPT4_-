import { useState, useEffect, useRef } from "react";

export default function Home() {
    const initialMessages = [
    { from: "bot", text: "No forms, no waiting—I’ll give you a real price range right here in chat." },
    { from: "bot", text: "Tell me about your move." }
  ];

const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [loading, setLoading] = useState(false);
  const [clickedButtons, setClickedButtons] = useState([]);
  const [activeModal, setActiveModal] = useState(null);
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

      if (data.phase === 9 && data.estimate) {
        fetch("https://api.telegram.org/botXXX/sendMessage", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: "8040084234",
            text: `🧠 New Quote:\n${data.estimate}\nSession: ${sessionId}`
          })
        });
      }

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
      <div key={idx} style={{ margin: "12px 0", textAlign: msg.role === "user" ? "right" : "left", position: "relative" }}>
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
          <div style={{
            position: "absolute",
            bottom: 0,
            left: msg.role === "user" ? "auto" : "-8px",
            right: msg.role === "user" ? "-8px" : "auto",
            width: 0,
            height: 0,
            borderTop: "8px solid transparent",
            borderBottom: "8px solid transparent",
            borderLeft: msg.role === "user" ? "8px solid #cce5ff" : "none",
            borderRight: msg.role === "user" ? "none" : "8px solid #e2e3e5"
          }} />
        </div>
        <span style={{ fontSize: "10px", color: "#888", marginTop: "4px", display: "block" }}>
          {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
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
              const isDisabled = clickedButtons.includes(btn);
              const bounceStyle = msg.phase === 1 ? {
                animation: `bounce 0.6s ease-in-out ${bIdx * 0.15}s 1`
              } : {};

              return (
                <button
                  key={bIdx}
                  onClick={() => !isDisabled && handleButtonClick(btn)}
                  disabled={isDisabled}
                  style={{
                    marginRight: "8px",
                    marginTop: "4px",
                    padding: "6px 12px",
                    borderRadius: "6px",
                    border: "none",
                    background: btn.includes("How It Works") ? "#6c757d" : "#0d6efd",
                    color: "#fff",
                    cursor: isDisabled ? "not-allowed" : "pointer",
                    opacity: isDisabled ? 0.5 : 1,
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
            })}
          </div>
        )}
      </div>
    );
  };

  const badgeStyle = {
  flex: "1 1 140px",
  minWidth: "130px",
  maxWidth: "180px",
  padding: "10px 16px",
  fontSize: "14px",
  background: "#fff",
  border: "1px solid #ccc",
  borderRadius: "8px",
  cursor: "pointer",
  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  transition: "transform 0.1s ease-in-out",
};

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", fontFamily: "Arial, sans-serif" }}>
      <header style={{ background: "#ffffff", textAlign: "center", boxShadow: "0 2px 6px rgba(0, 0, 0, 0.05)", paddingBottom: "10px", borderBottom: "1px solid #ddd" }}>
        <img src="/Movingcompany1.PNG" alt="MovingCo Header" style={{ width: "100%", height: "auto", maxWidth: "600px" }} />
        
<div style={{ padding: "20px", textAlign: "center", background: "#ffffff", fontSize: "18px", lineHeight: "1.6" }}>
  <h2 style={{ fontSize: "24px", marginBottom: "10px" }}>Skip the forms. Get a real quote in chat — fast.</h2>
  <p>We’ll guide you step-by-step in just a few minutes:</p>
  <ol style={{ textAlign: "left", display: "inline-block", marginTop: "10px", fontSize: "16px", lineHeight: "1.8" }}>
    <li>Chat now and get your custom quote</li>
    <li>Reserve your move day with a refundable $85 deposit</li>
    <li>Lock in your flat rate after a quick MoveSafe Call</li>
  </ol>
</div>


      <main className="chat-container" style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", border: "1px solid #ccc", borderRadius: "10px", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)", margin: "10px" }}>
        <div className="messages" style={{ flex: 1, overflowY: "auto", padding: "15px", background: "linear-gradient(to bottom, #f9f9f9, #f0f0f0)"}}>
          {messages.map((msg, idx) => msg.content === "start_chat" ? null : renderMessage(msg, idx))}
          {loading && (
            <div style={{ margin: "12px 0", textAlign: "left", fontStyle: "italic", color: "#666" }}>...</div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSubmit} className="input-area" style={{ display: "flex", padding: "12px", background: "#f0f0f0", borderTop: "1px solid #ccc" }}>
          <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type your message..." style={{ flex: 1, padding: "12px", fontSize: "16px", borderRadius: "24px", outline: "none", marginRight: "10px", border: "1px solid #ccc" }} />
          <button type="submit" disabled={loading} style={{ marginLeft: "8px", padding: "10px 16px", borderRadius: "24px", cursor: "pointer", background: "#0d6efd", color: "#fff", border: "none", fontSize: "16px" }}>Send</button>
        </form>
      
      <div id="testimonial-bar" style={{ backgroundColor: '#e6f2ff', padding: '20px', textAlign: 'center', marginTop: '20px' }}>
        <img id="testimonial-img" src="/Te1.PNG" alt="Customer Testimonial" style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', marginBottom: '10px' }} />
        <p id="testimonial-text" style={{ maxWidth: '600px', margin: '0 auto', fontStyle: 'italic' }}>We had a lot of concerns moving cross country. MovingCo didn't just calm our nerves — they handled every detail, every question, and never once made us feel like we were bothering them. Incredible service.</p>
      </div>

      <script dangerouslySetInnerHTML={{
        __html: `
          const testimonials = [
            { img: '/Te1.PNG', text: "We had a lot of concerns moving cross country. MovingCo didn't just calm our nerves — they handled every detail, every question, and never once made us feel like we were bothering them. Incredible service." },
            { img: '/Te2.PNG', text: "Every mover showed up exactly on time, and the quote matched the final price. No surprises. That's all I ever wanted." },
            { img: '/Te3.PNG', text: "We weren’t sure if a concierge-style service would be worth it. It was. We had support the whole way through." },
            { img: '/Te4.PNG', text: "We had some valuable antiques we were worried about. Everything was packed with care and arrived perfectly." },
            { img: '/Te5.PNG', text: "We’d been ghosted by another mover days before our move date. MovingCo came through and made it happen. Life saver." }
          ];
          let current = 0;
          setInterval(() => {
            current = (current + 1) % testimonials.length;
            document.getElementById('testimonial-img').src = testimonials[current].img;
            document.getElementById('testimonial-text').textContent = testimonials[current].text;
          }, 6000);
        `
      }} />

    </main>
    <footer style={{ textAlign: 'center', padding: '20px', backgroundColor: '#f9f9f9', position: 'relative', bottom: 0, width: '100%' }}>
      <p style={{ fontSize: '14px', color: '#666' }}>
        &copy; 2025 MovingCo. All rights reserved. | <a href="/privacy" style={{ color: '#666' }}>Privacy Policy</a>
      </p>
    </footer>
  

      

      
    </div>
  );
}
export default Home;
