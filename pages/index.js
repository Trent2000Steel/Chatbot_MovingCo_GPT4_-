import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    const opening = {
      from: 'bot',
      text: "Welcome to MovingCo. I’m your AI concierge—ready to walk you through your move. Where are you moving from?"
    };
    setMessages([opening]);
  }, []);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  async function sendMessage(e) {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessages = [...messages, { from: 'user', text: input }];
    setMessages(newMessages);
    setLoading(true);

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: input })
    });

    const data = await res.json();
    if (data.reply) {
      setMessages([...newMessages, { from: 'bot', text: data.reply }]);
    } else {
      setMessages([...newMessages, { from: 'bot', text: "Something went wrong." }]);
    }

    setInput('');
    setLoading(false);
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
      background: '#fff'
    }}>
      <Head>
        <title>MovingCo Chat</title>
      </Head>

      {/* HEADER BLOCK */}
      <header style={{
        textAlign: 'center',
        padding: '20px 12px 10px',
        backgroundColor: '#f9f9f9'
      }}>
        <div style={{
          maxWidth: '360px',
          margin: '0 auto',
          background: '#fff',
          padding: '16px',
          borderRadius: '12px',
          boxShadow: '0 2px 6px rgba(0,0,0,0.08)'
        }}>
          <img
            src="/header.png"
            alt="MovingCo Logo"
            style={{ width: '100%', height: 'auto', marginBottom: '16px' }}
          />
          <div style={{ fontSize: '13px', color: '#555', marginTop: '4px' }}>
            24/7 Quotes & Booking, Powered by AI
          </div>
        </div>
      </header>

      {/* CHAT SECTION */}
      <main style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '12px',
        maxWidth: '700px',
        margin: '0 auto',
        width: '100%'
      }}>
        <div style={{
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          paddingBottom: '12px'
        }}>
          {messages.map((msg, i) => (
            <div key={i} style={{
              maxWidth: '75%',
              margin: '6px 0',
              padding: '14px 18px',
              borderRadius: '14px',
              backgroundColor: msg.from === 'bot' ? '#f1f1f1' : '#d1e7ff',
              alignSelf: msg.from === 'bot' ? 'flex-start' : 'flex-end',
              lineHeight: '1.5'
            }}>
              {msg.text}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* INPUT BAR */}
        <form onSubmit={sendMessage} style={{
          display: 'flex',
          gap: '8px',
          paddingTop: '8px'
        }}>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Type your message..."
            style={{
              flex: 1,
              padding: '14px',
              borderRadius: '8px',
              border: '1px solid #ccc',
              fontSize: '16px'
            }}
          />
          <button type="submit" disabled={loading} style={{
            padding: '14px 18px',
            borderRadius: '8px',
            backgroundColor: '#0070f3',
            color: '#fff',
            border: 'none',
            fontSize: '16px'
          }}>
            {loading ? '...' : 'Send'}
          </button>
        </form>
      </main>

      {/* FOOTER */}
      <footer style={{
        textAlign: 'center',
        fontSize: '12px',
        padding: '12px 0',
        color: '#666'
      }}>
        <p>Verified Movers · Flat-Rate Guarantee · Concierge Support · Secure Checkout</p>
        <p><a href="#">Terms of Service</a> | <a href="#">Privacy Policy</a></p>
      </footer>
    </div>
  );
}
