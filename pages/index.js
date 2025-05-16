
import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  // Auto-sequence intro and first question
  useEffect(() => {
    const intro = { from: 'bot', text: "No forms. No waiting. I’ll give you a real long-distance price range right here in chat." };
    const question1 = { from: 'bot', text: "Where are you moving from?" };

    setMessages([intro]);
    const delay = setTimeout(() => {
      setMessages([intro, question1]);
    }, 1000);

    return () => clearTimeout(delay);
  }, []);

  // Auto-scroll to latest message
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

    const openaiMessages = [
      { role: "system", content: "You are the MovingCo chatbot. Follow the MoveSafe Method™ as described in the backend system prompt." },
      ...newMessages.map(msg => ({
        role: msg.from === 'user' ? 'user' : 'assistant',
        content: msg.text
      }))
    ];

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: openaiMessages })
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
      height: '100vh',
      fontFamily: "'Segoe UI', 'Helvetica Neue', sans-serif",
      fontSize: '17px'
    }}>
      <Head>
        <title>MovingCo Chat</title>
      </Head>

      <header style={{
        textAlign: 'center',
        padding: '16px',
        background: 'linear-gradient(to bottom, #ffffff, #f8f9fa)',
        borderBottom: '1px solid #e0e0e0'
      }}>
        <h1 style={{ fontSize: '24px', margin: 0 }}>MOVINGCO</h1>
        <p style={{ margin: '4px 0' }}>Powered by the MoveSafe Method™</p>
        <div style={{ marginTop: '12px', fontSize: '14px' }}>
          <strong>MoveSafe Verified™</strong>
          <p>We take the risk, not you. Money-back guarantee.</p>
        </div>
      </header>

      <main style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '12px',
        margin: '0 auto',
        width: '100%',
        maxWidth: '700px',
        border: '1px solid #ddd',
        borderRadius: '12px',
        backgroundColor: '#fff',
        boxShadow: '0 0 8px rgba(0,0,0,0.05)',
        overflow: 'hidden'
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

      <section style={{
        textAlign: 'center',
        fontSize: '13px',
        padding: '12px 0',
        color: '#666'
      }}>
        <p>Verified Movers · Flat-Rate Guarantee · Concierge Support · Secure Checkout</p>
      </section>

      <footer style={{
        textAlign: 'center',
        fontSize: '12px',
        paddingBottom: '8px',
        color: '#666'
      }}>
        <p><a href="#">Terms of Service</a> | <a href="#">Privacy Policy</a></p>
      </footer>
    </div>
  );
}
