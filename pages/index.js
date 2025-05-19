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
      text: 'Hi, how can I help with your move today?'
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
      fontFamily: 'Segoe UI, Helvetica Neue, sans-serif',
      background: '#fff'
    }}>
      <Head>
        <title>MovingCo Chat</title>
      </Head>

      <header style={{
        textAlign: 'center',
        padding: '12px 8px',
        background: '#fafafa',
        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.06)'
      }}>
        <div style={{
          maxWidth: '500px',
          margin: '0 auto',
          borderRadius: '12px',
          overflow: 'hidden',
          backgroundColor: '#fff'
        }}>
          <img
            src="/movinglogo.png"
            alt="MovingCo Logo"
            style={{
              width: '100%',
              height: 'auto',
              maxHeight: '360px',
              objectFit: 'contain'
            }}
          />
        </div>
        <div style={{ fontSize: '13px', marginTop: '6px', color: '#333' }}>
          24/7 Quotes & Booking, Powered by AI
        </div>
      </header>

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
              margin: '8px 0',
              padding: '14px 18px',
              borderRadius: '16px',
              fontSize: '15px',
              backgroundColor: msg.from === 'bot' ? '#f1f1f1' : '#d1e7ff',
              alignSelf: msg.from === 'bot' ? 'flex-start' : 'flex-end',
              lineHeight: '1.5'
            }}>
              {msg.text}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

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
