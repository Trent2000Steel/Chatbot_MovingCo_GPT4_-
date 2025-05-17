import { useEffect, useRef, useState } from 'react';
import Head from 'next/head';

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          from: 'bot',
          text: "Hello there! I'm your MovingCo AI Concierge. It's my pleasure to help you plan your upcoming move. Could you share where you're moving from and to, along with your estimated move date and size of your home?"
        }
      ]);
    }
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

    const openaiMessages = [
      { role: "system", content: "You are the MovingCo chatbot. Your job is to close high-quality long-distance moving clients by providing quotes, answering questions, and collecting the $85 deposit to reserve their move. Be calm, clear, and professional." },
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
      fontFamily: 'sans-serif',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh'
    }}>
      <Head>
        <title>MovingCo Chat</title>
      </Head>

      <header style={{ padding: '12px', textAlign: 'center' }}>
        <img
          src="/movingco-header-logo.png"
          alt="MovingCo Logo"
          style={{ width: '100%', maxWidth: '600px', margin: '0 auto', display: 'block' }}
        />
        <div style={{ marginTop: '12px', fontSize: '14px', fontWeight: 'bold' }}>
          MoveSafe Verified™
        </div>
        <div style={{ fontSize: '13px', color: '#555' }}>
          We take the risk. If we can’t deliver what we promised, you get your money back.
          <br />
          No forms. No delays. No surprises.
        </div>
        <div style={{ marginTop: '8px', fontSize: '13px', color: '#333' }}>
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
        width: '100%',
        borderTop: '1px solid #eee'
      }}>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {messages.map((msg, i) => (
            <div key={i} style={{
              backgroundColor: msg.from === 'bot' ? '#f1f1f1' : '#d1e7ff',
              padding: '12px 16px',
              borderRadius: '12px',
              marginBottom: '8px',
              maxWidth: '70%',
              alignSelf: msg.from === 'bot' ? 'flex-start' : 'flex-end'
            }}>
              {msg.text}
            </div>
          ))}
          <div ref={bottomRef}></div>
        </div>

        <form onSubmit={sendMessage} style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Type your message..."
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid #ccc'
            }}
          />
          <button type="submit" disabled={loading} style={{
            padding: '12px 16px',
            borderRadius: '8px',
            backgroundColor: '#0070f3',
            color: '#fff',
            border: 'none'
          }}>
            {loading ? '...' : 'Send'}
          </button>
        </form>
      </main>

      <footer style={{ fontSize: '12px', color: '#666', textAlign: 'center', padding: '12px 0' }}>
        Verified Movers · Flat-Rate Guarantee · Concierge Support · Secure Checkout
        <br />
        <a href="#">Terms of Service</a> | <a href="#">Privacy Policy</a>
      </footer>
    </div>
  );
}
