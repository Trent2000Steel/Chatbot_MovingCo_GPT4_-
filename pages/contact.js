import { useState } from "react";

export default function Contact() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !phone || !message) return alert("Please fill out all fields.");

    const telegramMessage = `
📨 New Contact Form Submission:
Email: ${email}
Phone: ${phone}
Message: ${message}
    `;

    try {
      await fetch("https://api.telegram.org/bot<YOUR_BOT_TOKEN>/sendMessage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: "<YOUR_CHAT_ID>",
          text: telegramMessage
        }),
      });
      setSubmitted(true);
      setEmail("");
      setPhone("");
      setMessage("");
    } catch (err) {
      console.error("Failed to send Telegram message", err);
      alert("Something went wrong. Please try again later.");
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "40px auto", padding: "0 20px", fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ textAlign: "center", marginBottom: "10px" }}>Need to reach us?</h2>
      <p style={{ textAlign: "center", fontSize: "15px", color: "#555", marginBottom: "30px" }}>
        Our team handles all estimates, move setup, and customer support directly through our secure chat assistant.
        It’s the fastest and most accurate way to get help—no waiting, no emails back and forth.
        <br /><br />
        Still need to send us a message? Use the form below and we’ll review it as soon as possible.
      </p>

      {submitted ? (
        <p style={{ textAlign: "center", color: "green", fontWeight: "bold" }}>Thanks! Your message has been sent.</p>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <input
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ padding: "12px", borderRadius: "6px", border: "1px solid #ccc", fontSize: "15px" }}
          />
          <input
            type="tel"
            placeholder="Your phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            style={{ padding: "12px", borderRadius: "6px", border: "1px solid #ccc", fontSize: "15px" }}
          />
          <textarea
            placeholder="Your message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            rows={5}
            style={{ padding: "12px", borderRadius: "6px", border: "1px solid #ccc", fontSize: "15px" }}
          />
          <button
            type="submit"
            style={{
              background: "#0d6efd",
              color: "#fff",
              padding: "12px",
              borderRadius: "6px",
              border: "none",
              fontSize: "16px",
              cursor: "pointer",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            }}
          >
            Send Message
          </button>
        </form>
      )}
    </div>
  );
}
