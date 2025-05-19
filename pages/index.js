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
      fontFamily: 'sans-serif',
      backgroundColor: '#f4f4f4'
    }}>
      <Head>
        <title>MovingCo Chat</title>
      </Head>

      <header style={{
        textAlign: 'center',
        padding: '16px 0 10px',
        backgroundColor: '#fff',
        borderBottom: '1px solid #ddd'
      }}>
        <img
          src="/movingco-logo-header.png"
          alt="MovingCo Logo"
          style={{ maxWidth: '300px', width: '90%', height: 'auto', margin: '0 auto' }}
        />
      </header>

      <div style={{
        display: 'flex',
        justifyContent: 'center',
        padding: '24px 16px 12px',
        backgroundColor: '#f4f4f4'
      }}>
        <div style={{
          backgroundColor: '#fff',
          padding: '16px',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
          textAlign: 'center',
          maxWidth: '360px',
          width: '100%'
        }}>
          <img
            src="/movesafe-badge.png"
            alt="MoveSafe Verified"
            style={{ maxWidth: '100%', height: 'auto', marginBottom: '8px' }}
          />
          <div style={{ fontSize: '13px', color: '#444' }}>
            24/7 Quotes & Booking, Powered by AI
          </div>
        </div>
      </div>

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
          backgroundColor: '#fff',
          borderRadius: '12px',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
          padding: '16px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {messages.map((msg, i) => (
            <div key={i} style={{
              maxWidth: '75%',
              margin: '6px 0',
              padding: '14px 18px',
              borderRadius: '14px',
              backgroundColor: msg.from === 'bot' ? '#f1f1f1' : '#0070f3',
              color: msg.from === 'bot' ? '#000' : '#fff',
              alignSelf: msg.from === 'bot' ? 'flex-start' : 'flex-end',
              lineHeight: '1.5',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
            }}>
              {msg.text}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        <form onSubmit={sendMessage} style={{
          display: 'flex',
          gap: '8px',
          paddingTop: '12px'
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
        color: '#666',
        borderTop: '1px solid #ddd',
        backgroundColor: '#f9f9f9'
      }}>
        <p>Verified Movers · Flat-Rate Guarantee · Concierge Support · Secure Checkout</p>
        <p><a href="#">Terms of Service</a> | <a href="#">Privacy Policy</a></p>
      </footer>
    </div>
  );
}