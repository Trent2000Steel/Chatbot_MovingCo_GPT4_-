
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
      text: "Hi, how can I help with your move today?"
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
      fontFamily: '"Segoe UI", "Helvetica Neue", sans-serif',
      fontSize: '14px',
      background: '#fff'
    }}>
      <Head>
        <title>MovingCo Chat</title>
      </Head>

      <header style={{
        padding: '20px 12px 0',
        backgroundColor: '#f9f9f9',
        borderRadius: '0 0 16px 16px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
        textAlign: 'center'
      }}>
        <img
          src="/movinglogo.png"
          alt="MovingCo Logo"
          style={{
            width: '100%',
            maxWidth: '340px',
            height: 'auto',
            margin: '0 auto 12px',
            display: 'block'
          }}
        />
        <div style={{
          fontSize: '13px',
          color: '#555',
          marginBottom: '6px'
        }}>
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
              margin: '6px 0',
              padding: '12px 16px',
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
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid #ccc',
              fontSize: '14px'
            }}
          />
          <button type="submit" disabled={loading} style={{
            padding: '12px 18px',
            borderRadius: '8px',
            backgroundColor: '#0070f3',
            color: '#fff',
            border: 'none',
            fontSize: '14px',
            fontWeight: 'bold',
            boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
          }}>
            {loading ? '...' : 'Send'}
          </button>
        </form>
      </main>

      <footer style={{
        textAlign: 'center',
        fontSize: '11px',
        padding: '12px 0',
        color: '#666'
      }}>
        <p>Verified Movers · Flat-Rate Guarantee · Concierge Support · Secure Checkout</p>
        <p><a href="#">Terms of Service</a> | <a href="#">Privacy Policy</a></p>
      </footer>
    </div>
  );
}
