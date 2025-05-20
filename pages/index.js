
import { useState, useEffect, useRef } from "react";
import Head from "next/head";

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    async function startChat() {
      setLoading(true);
      const history = [{ role: "user", content: "START_CHAT" }];
      setMessages([{ from: "bot", text: "..." }]);
      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: history }),
        });
        const data = await res.json();
        setMessages([{ from: "bot", text: data.reply || "Welcome to MovingCo." }]);
      } catch {
        setMessages([{ from: "bot", text: "Something went wrong loading the chat." }]);
      }
      setLoading(false);
    }
    startChat();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const injectMessage = (text) => {
    setMessages((prev) => [...prev, { from: "bot", text }]);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessages = [...messages, { from: "user", text: input }, { from: "bot", text: "..." }];
    setMessages(newMessages);
    setLoading(true);

    const formattedMessages = newMessages
      .filter((msg) => msg.text && msg.from)
      .map((msg) => ({
        role: msg.from === "bot" ? "assistant" : "user",
        content: msg.text,
      }));

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: formattedMessages }),
      });

      const data = await res.json();
      const reply = data.reply || "Something went wrong.";
      const updated = [...newMessages.slice(0, -1), { from: "bot", text: reply }];
      setMessages(updated);

      if (reply.includes("Here's the recap")) {
        // pacing message
        setTimeout(() => {
          injectMessage("Give me a sec—I’m checking route pricing and mover availability...");
          setTimeout(() => {
            getQuoteOnly(formattedMessages);
          }, 2000);
        }, 500);
      }
    } catch {
      const fallback = [...messages, { from: "bot", text: "Something went wrong." }];
      setMessages(fallback);
    }

    setInput("");
    setLoading(false);
  };

  const getQuoteOnly = async (msgHistory) => {
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            ...msgHistory,
            {
              role: "user",
              content: "Give me a confident quote based on the move details above. Include MoveSafe Method benefits and a short testimonial. Keep it under 3 short sentences.",
            },
          ],
        }),
      });

      const data = await res.json();
      const quote = data.reply || "Something went wrong retrieving the quote.";
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: quote },
        { from: "bot", text: "[CTA] Yes, Reserve My Move | I Have More Questions First" },
      ]);
    } catch {
      setMessages((prev) => [...prev, { from: "bot", text: "Something went wrong retrieving the quote." }]);
    }
  };

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      minHeight: "100vh",
      fontFamily: "'Segoe UI', 'Helvetica Neue', sans-serif",
      backgroundColor: "#fff"
    }}>
      <Head>
        <title>MovingCo Chat</title>
      </Head>

      <div style={{
        width: "100%",
        maxHeight: "65vh",
        display: "flex",
        justifyContent: "center",
        padding: "16px",
        boxSizing: "border-box"
      }}>
        <img
          src="/movinglogo.png"
          alt="MovingCo Logo and Guarantee"
          style={{
            maxHeight: "100%",
            maxWidth: "100%",
            objectFit: "contain",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
          }}
        />
      </div>

      <main style={{
        flex: 1,
        maxWidth: "800px",
        margin: "0 auto",
        width: "100%",
        padding: "0 16px",
        display: "flex",
        flexDirection: "column"
      }}>
        <div style={{
          flex: 1,
          overflowY: "auto",
          paddingBottom: "16px"
        }}>
          {messages.map((msg, i) => (
            <div key={i} style={{
              alignSelf: msg.from === "bot" ? "flex-start" : "flex-end",
              background: msg.from === "bot" ? "#f1f1f1" : "#d0ebff",
              color: "#000",
              padding: "12px 16px",
              borderRadius: "18px",
              margin: "8px 0",
              maxWidth: "80%",
              fontSize: "15px"
            }}>
              {msg.text}
              {msg.text.includes('[CTA]') && (
                <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => handleCtaClick("Yes, Reserve My Move")}
                    style={{
                      padding: '10px 16px',
                      borderRadius: '8px',
                      backgroundColor: '#28a745',
                      color: '#fff',
                      border: 'none',
                      fontSize: '14px'
                    }}
                  >
                    Yes, Reserve My Move
                  </button>
                  <button
                    onClick={() => handleCtaClick("I Have More Questions First")}
                    style={{
                      padding: '10px 16px',
                      borderRadius: '8px',
                      backgroundColor: '#ffc107',
                      color: '#000',
                      border: 'none',
                      fontSize: '14px'
                    }}
                  >
                    I Have More Questions First
                  </button>
                </div>
              )
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        <form onSubmit={sendMessage} style={{
          display: "flex",
          padding: "8px 0",
          gap: "10px"
        }}>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Type your message..."
            style={{
              flex: 1,
              padding: "14px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              fontSize: "16px"
            }}
          />
          <button type="submit" disabled={loading} style={{
            padding: "14px 18px",
            borderRadius: "8px",
            backgroundColor: "#0070f3",
            color: "#fff",
            border: "none",
            fontSize: "16px"
          }}>
            {loading ? "..." : "Send"}
          </button>
        </form>
      </main>

      <footer style={{
        textAlign: "center",
        fontSize: "12px",
        color: "#666",
        padding: "10px 0"
      }}>
        <p>Verified Movers · Flat-Rate Guarantee · Concierge Support · Secure Checkout</p>
        <p><a href="#">Terms of Service</a> | <a href="#">Privacy Policy</a></p>
      </footer>
    </div>
  );
}


function handleCtaClick(option) {
  const event = new Event('submit', { bubbles: true, cancelable: true });
  const form = document.querySelector('form');
  const input = document.querySelector('input[type="text"]');
  input.value = option;
  form.dispatchEvent(event);
}
