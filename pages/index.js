
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [loading, setLoading] = useState(false);
  const [clickedButtons, setClickedButtons] = useState([]);
  const [activeModal, setActiveModal] = useState(null);
  const messagesEndRef = useRef(null);

  
  const testimonials = [
    {
      img: '/Te1.PNG',
      quote: "We had a lot of concerns moving cross country. MovingCo didn't just calm our nerves — they handled every detail, every question, and never once made us feel like we were bothering them. Incredible service.",
      name: "Emily – California to Texas"
    },
    {
      img: '/Te2.PNG',
      quote: "Every mover showed up exactly on time, and the quote matched the final price. No surprises. That's all I ever wanted.",
      name: "Jason – New York to Florida"
    },
    {
      img: '/Te3.PNG',
      quote: "We weren’t sure if a concierge-style service would be worth it. It was. We had support the whole way through.",
      name: "Monica – Illinois to Arizona"
    },
    {
      img: '/Te4.PNG',
      quote: "We had some valuable antiques we were worried about. Everything was packed with care and arrived perfectly.",
      name: "Thomas – Virginia to Colorado"
    },
    {
      img: '/Te5.PNG',
      quote: "We’d been ghosted by another mover days before our move date. MovingCo came through and made it happen. Life saver.",
      name: "Ashley – Nevada to Oregon"
    }
  ];

  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

const stripeLink = "https://buy.stripe.com/eVqbJ23Px8yx4Ab2aUenS00";

  const generateSessionId = () => Math.random().toString(36).substring(2) + Date.now().toString(36);

  useEffect(() => {
    const existingId = sessionStorage.getItem("sessionId") || generateSessionId();
    sessionStorage.setItem("sessionId", existingId);
    setSessionId(existingId);
    sendMessage("start_chat");
  }, []);

  

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
      <header style={{ background: "#ffffff", textAlign: "center", boxShadow: "0 2px 6px rgba(0, 0, 0, 0.05)", paddingBottom: "6px", borderBottom: "1px solid #ddd" }}>
        <img src="/Movingcompany1.PNG" alt="MovingCo Header" style={{ width: "100%", height: "auto", maxWidth: "600px" }} />
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "12px", marginTop: "20px", padding: "0 20px", maxWidth: "600px", marginLeft: "auto", marginRight: "auto", boxShadow: "0 4px 8px rgba(0,0,0,0.08)" }}>
          <button style={badgeStyle} onClick={() => setActiveModal("movesafe")}>✅ MoveSafe Verified</button>
          <button style={badgeStyle} onClick={() => setActiveModal("flatrate")}>📦 Guaranteed Flat Rate</button>
          <button style={badgeStyle} onClick={() => setActiveModal("support")}>🕓 24/7 Concierge Support</button>
          <button style={badgeStyle} onClick={() => setActiveModal("guarantee")}>💰 Money-Back Guarantee</button>
        </div>
      <p style={{
  textAlign: "center",
  fontSize: "13px",
  color: "#666",
  fontStyle: "italic",
  marginTop: "8px",
  marginBottom: "8px"
}}>

  <strong>Skip the forms. Get a real quote in chat — fast.</strong><br /><br />
  We’ll guide you step-by-step in just a few minutes:<br /><br />
  <strong>1.</strong> Chat now and get your custom quote<br />
  <strong>2.</strong> Reserve your move day with a refundable $85 deposit<br />
  <strong>3.</strong> Lock in your flat rate after a quick MoveSafe Call
</p>

  
</p>

</header>

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
        <img
          src={testimonials[currentTestimonial].img}
          alt="Customer Testimonial"
          style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', marginBottom: '10px' }}
        />
        <p style={{ fontStyle: 'italic', maxWidth: '600px', margin: '0 auto' }}>
          “{testimonials[currentTestimonial].quote}”
        </p>
        <p style={{ fontWeight: 'bold', marginTop: '8px' }}>
          — {testimonials[currentTestimonial].name}
        </p>
        <p style={{ fontSize: '20px', color: '#000', margin: '8px 0' }}>★★★★★</p>
      </div>

    </main>
    <footer style={{
  textAlign: 'center',
  padding: '24px 12px',
  backgroundColor: '#f9f9f9',
  fontSize: '14px',
  color: '#666'
}}>
  <div style={{ marginBottom: '10px' }}>
    <a href="/about" style={{ margin: '0 12px', color: '#666', textDecoration: 'none' }}>About Us</a>
    <a href="/how-it-works" style={{ margin: '0 12px', color: '#666', textDecoration: 'none' }}>How It Works</a>
    <a href="/faq" style={{ margin: '0 12px', color: '#666', textDecoration: 'none' }}>FAQ</a>
    <a href="/privacy" style={{ margin: '0 12px', color: '#666', textDecoration: 'none' }}>Privacy Policy</a>
    <a href="/terms" style={{ margin: '0 12px', color: '#666', textDecoration: 'none' }}>Terms of Service</a>
    <a href="/contact" style={{ margin: '0 12px', color: '#666', textDecoration: 'none' }}>Contact</a>
  </div>
  <p style={{ fontSize: '13px', color: '#999' }}>
    &copy; 2025 MovingCo. All rights reserved.
  </p>
</footer>
  

      {activeModal && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)", display: "flex",
          alignItems: "center", justifyContent: "center", zIndex: 9999
        }}>
          <div style={{
            background: "#fff", padding: "30px", borderRadius: "10px",
            maxWidth: "90%", width: "400px", textAlign: "center", boxShadow: "0 6px 20px rgba(0,0,0,0.3)"
          }}>
            <h2 style={{ marginBottom: "16px" }}>
              {{
                movesafe: "MoveSafe Verified",
                flatrate: "Guaranteed Flat Rate",
                support: "24/7 Concierge Support",
                guarantee: "Money-Back Guarantee"
              }[activeModal]}
            </h2>
            <p style={{ fontSize: "15px", lineHeight: "1.5" }}>
              {{
                movesafe: "Every move we coordinate goes through licensed, vetted professionals using the MoveSafe Method™. That includes verified crews, smart quoting, real human review, and concierge-level support. But we go further: every customer receives fresh, single-use moving protection—no reused pads or dirty blankets from someone else's move. It's your move, your materials, and your peace of mind.",
                flatrate: "We start by giving you a real estimate—right here in chat. It’s powered by AI trained on thousands of recent moves across the U.S. If the range looks good, you’ll place a small, refundable $85 deposit to reserve your date. Then, you’ll submit photos and hop on a MoveSafe Call with our live, experienced staff. After reviewing everything, we’ll lock in your Guaranteed Flat Rate — no hidden fees, no surprises. Don’t like the final number? No problem. We’ll return your deposit. The price you accept is the price you pay. Period.",
                support: "MovingCo blends real-time AI support with experienced, U.S.-based coordinators to guide you every step of the way. Whether you're booking, preparing, or mid-move, you'll always have access to clear answers and calm, expert support. From your first question to final delivery, our concierge team keeps communication smooth, expectations clear, and your move on track. That’s the MoveSafe Method™ — combining smart tools and human touch to give you total confidence.",
                guarantee: "Your deposit is fully refundable — no tricks, no fine print. After your photo review and MoveSafe Call, we’ll send you a Guaranteed Flat Rate. Don’t love it? Don’t move forward. We’ll return your deposit. Every time. Because trust starts before the truck shows up."
              }[activeModal]}
            </p>
            <button onClick={() => setActiveModal(null)} style={{ marginTop: "20px", padding: "10px 20px", background: "#0d6efd", color: "#fff", border: "none", borderRadius: "6px", fontSize: "14px" }}>
              Close
            </button>
          </div>
        </div>
      )}

      

      
    </div>
  );
}