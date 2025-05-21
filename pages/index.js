
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

      // recap detection trigger
      const isRecap = reply.toLowerCase().includes("here's what i got") || reply.toLowerCase().includes("recap:");

      if (isRecap) {
        setTimeout(() => {
          setMessages((prev) => [...prev, { from: "bot", text: "Give me a sec—I’m checking pricing history and top-rated carrier availability for your route…" }]);
          setTimeout(() => {
            getQuoteOnly(formattedMessages);
          }, 2000);
        }, 800);
      }

    } catch {
      setMessages([...messages, { from: "bot", text: "Something went wrong." }]);
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
              content: "Now give me a confident quote range with the MoveSafe Method and a testimonial. Keep it under 3 sentences.",
            },
          ],
        }),
      });

      const data = await res.json();
      const quote = data.reply || "Something went wrong retrieving the quote.";
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: quote },
        { from: "bot", text: "[CTA] Yes, Reserve My Move | I Have More Questions First" }
      ]);
    } catch {
      setMessages((prev) => [...prev, { from: "bot", text: "Something went wrong retrieving the quote." }]);
    }
  };

  const handleCtaClick = async (choice) => {
    const newMessages = [...messages, { from: "user", text: choice }, { from: "bot", text: "..." }];
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
    } catch {
      setMessages([...messages, { from: "bot", text: "Something went wrong." }]);
    }

    setLoading(false);
  };

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Head>
        <title>MovingCo Chat</title>
      </Head>

      <main style={{ flex: 1, maxWidth: "800px", margin: "0 auto", width: "100%", padding: "16px", display: "flex", flexDirection: "column" }}>
        <div style={{ flex: 1, overflowY: "auto", paddingBottom: "16px" }}>
          {messages.map((msg, i) => (
            <div key={i} style={{
              alignSelf: msg.from === "bot" ? "flex-start" : "flex-end",
              background: msg.from === "bot" ? "#f1f1f1" : "#d0ebff",
              padding: "12px 16px",
              borderRadius: "18px",
              margin: "8px 0",
              maxWidth: "80%",
              fontSize: "15px",
              position: "relative"
            }}>
              {msg.text.includes("[CTA]") ? msg.text.replace("[CTA]", "").trim() : msg.text}
              {msg.text.includes("[CTA]") && (
                <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
                  <button
                    onClick={() => handleCtaClick("Yes, Reserve My Move")}
                    style={{
                      padding: "10px 16px",
                      borderRadius: "8px",
                      backgroundColor: "#28a745",
                      color: "#fff",
                      border: "none",
                      fontSize: "14px",
                      cursor: "pointer"
                    }}
                  >
                    Yes, Reserve My Move
                  </button>
                  <button
                    onClick={() => handleCtaClick("I Have More Questions First")}
                    style={{
                      padding: "10px 16px",
                      borderRadius: "8px",
                      backgroundColor: "#ffc107",
                      color: "#000",
                      border: "none",
                      fontSize: "14px",
                      cursor: "pointer"
                    }}
                  >
                    I Have More Questions First
                  </button>
                </div>
              )}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        <form onSubmit={sendMessage} style={{ display: "flex", gap: "10px", padding: "10px 0" }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
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

      <footer style={{ textAlign: "center", fontSize: "12px", color: "#666", padding: "10px 0" }}>
        <p>Verified Movers · Flat-Rate Guarantee · Concierge Support · Secure Checkout</p>
        <p><a href="#">Terms of Service</a> | <a href="#">Privacy Policy</a></p>
      </footer>
    </div>
  );
}
