import { useState } from 'react';

export default function ChatBox() {
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      content: "No forms, no waiting—I’ll give you a real price range right now!\nWhere are you moving from?",
      buttons: ['Texas', 'California', 'New York', 'Other', 'How it works'],
      phase: 1
    }
  ]);
  const [clickedButtons, setClickedButtons] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleButtonClick = async (btnText) => {
    setClickedButtons((prev) => [...prev, btnText]);
    setMessages((prev) => [...prev, { role: 'user', content: btnText }]);

    if (btnText === "How it works") {
      setMessages((prev) => [
        ...prev,
        {
          role: 'bot',
          content:
            "We coordinate your move from start to finish using verified, trusted movers and long-distance transport.\nThese are professionals who show up on time, handle your belongings with care, and deliver a move that’s seamless and stress-free.\n\nEvery move is backed by our MoveSafe Method™—that means:\n✅ Verified Movers\n✅ Flat Rate Guarantee\n✅ Dedicated Coordination\n✅ Money-Back Guarantee\n\nWant to get your custom quote?",
          buttons: ['Texas', 'California', 'New York', 'Other'],
          phase: 2
        }
      ]);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userInput: btnText })
      });
      const data = await res.json();
      setMessages((prev) => [...prev, {
        role: 'bot',
        content: data.message,
        buttons: data.buttons,
        phase: data.phase
      }]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [...prev, { role: 'bot', content: "Something went wrong. Please try again." }]);
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userInput = input.trim();
    setMessages((prev) => [...prev, { role: 'user', content: userInput }]);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userInput })
      });
      const data = await res.json();
      setMessages((prev) => [...prev, {
        role: 'bot',
        content: data.message,
        buttons: data.buttons,
        phase: data.phase
      }]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [...prev, { role: 'bot', content: "Something went wrong. Please try again." }]);
    }
    setLoading(false);
  };

  return (
    <div style={{
      background: 'linear-gradient(to bottom, #f9f9f9, #f1f1f1)',
      padding: '20px',
      borderRadius: '12px',
      maxWidth: '800px',
      margin: '20px auto',
      border: '1px solid #ccc',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
    }}>
      <div style={{ minHeight: '300px', paddingBottom: '20px' }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{
            textAlign: msg.role === 'user' ? 'right' : 'left',
            marginBottom: '14px'
          }}>
            <div style={{
              display: 'inline-block',
              padding: '12px 16px',
              background: msg.role === 'user' ? '#d7ecff' : '#f1f1f1',
              borderRadius: '16px',
              maxWidth: '80%',
              whiteSpace: 'pre-wrap'
            }}>
              {msg.content}
            </div>

            {msg.phase === 999 && (
              <div style={{ marginTop: '16px' }}>
                <a
                  href="https://buy.stripe.com/eVqbJ23Px8yx4Ab2aU"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-block',
                    padding: '12px 24px',
                    background: '#28a745',
                    color: '#fff',
                    fontSize: '16px',
                    borderRadius: '8px',
                    textDecoration: 'none'
                  }}
                >
                  Reserve My Move Now ($85)
                </a>
              </div>
            )}

            {msg.buttons && (
              <div style={{ marginTop: '10px' }}>
                {msg.buttons.map((btn, bIdx) => {
                  const isDisabled = clickedButtons.includes(btn);
                  return (
                    <button
                      key={bIdx}
                      onClick={() => !isDisabled && handleButtonClick(btn)}
                      disabled={isDisabled}
                      style={{
                        margin: '6px 8px 0 0',
                        padding: '8px 14px',
                        borderRadius: '6px',
                        border: 'none',
                        background: '#007bff',
                        color: '#fff',
                        cursor: isDisabled ? 'not-allowed' : 'pointer',
                        opacity: isDisabled ? 0.5 : 1,
                        fontSize: '14px'
                      }}
                    >
                      {btn}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        ))}
        {loading && <div style={{ fontStyle: 'italic', color: '#555' }}>...</div>}
      </div>
      <form onSubmit={handleSubmit} style={{
        display: 'flex',
        paddingTop: '12px',
        borderTop: '1px solid #ccc'
      }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          style={{
            flex: 1,
            padding: '12px',
            borderRadius: '24px',
            border: '1px solid #ccc',
            fontSize: '16px',
            marginRight: '10px'
          }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '10px 18px',
            borderRadius: '24px',
            background: '#007bff',
            color: '#fff',
            border: 'none',
            fontSize: '16px',
            cursor: 'pointer'
          }}
        >
          Send
        </button>
      </form>
    </div>
  );
}