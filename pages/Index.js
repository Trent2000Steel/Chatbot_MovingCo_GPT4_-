import { useState } from 'react'
import Head from 'next/head'

export default function Home() {
  const [messages, setMessages] = useState([
    { from: 'bot', text: "No forms. No waiting. I’ll give you a real quote right here in chat. Just tell me about your move." }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

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
      fontFamily: 'sans-serif'
    }}>
      <Head>
        <title>MovingCo Chat</title>
      </Head>

      <header style={{
        textAlign: 'center',
        padding: '24px',
        background: 'linear-gradient(to bottom, #ffffff, #f8f9fa)',
        borderBottom: '1px solid #e0e0e0'
      }}>
        <h1>MOVINGCO</h1>
        <p>Powered by the MoveSafe Method™</p>
        <div style={{ marginTop: '12px', fontSize: '14px' }}>
          <strong>MoveSafe Verified™</strong>
          <p>We take the risk, not you. Money-back guarantee.</p>
        </div>
      </header>

      <main style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        padding: '16px',
        border: '1px solid #ddd',
        margin: '20px auto',
        width: '100%',
        maxWidth: '700px',
        borderRadius: '12px',
        backgroundColor: '#fff',
        boxShadow: '0 0 8px rgba(0,0,0,0.05)'
      }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            maxWidth: '70%',
            margin: '10px',
            padding: '12px 16px',
            borderRadius: '12px',
            backgroundColor: msg.from === 'bot' ? '#f1f1f1' : '#d1e7ff',
            alignSelf: msg.from === 'bot' ? 'flex-start' : 'flex-end'
          }}>
            {msg.text}
          </div>
        ))}
        <form onSubmit={sendMessage} style={{
         
