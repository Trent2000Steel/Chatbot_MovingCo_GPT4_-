import { useEffect, useRef } from 'react';

export default function ChatUI({ messages, input, setInput, onSend, isTyping, buttonOptions }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      backgroundColor: '#fff',
      fontFamily: 'Inter, sans-serif'
    }}>
      {/* Messages */}
      <div style={{
        flexGrow: 1,
        overflowY: 'auto',
        padding: '1rem',
        WebkitOverflowScrolling: 'touch'
      }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
            backgroundColor: msg.sender === 'user' ? '#d2ebff' : '#f1f1f1',
            borderRadius: '18px',
            padding: '12px 16px',
            marginBottom: '12px',
            maxWidth: '85%',
            fontSize: '1rem',
            lineHeight: '1.5'
          }}>
            {msg.text}
            {msg.sender === 'bot' && msg.options && msg.options.length > 0 && (
              <div style={{ marginTop: '0.75rem', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {msg.options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => onSend(opt)}
                    style={{
                      backgroundColor: '#1e70ff',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '999px',
                      padding: '8px 16px',
                      fontSize: '0.9rem',
                      cursor: 'pointer'
                    }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
        {isTyping && <div style={{ fontSize: '1.25rem', color: '#999', paddingLeft: '12px' }}>...</div>}
        <div ref={bottomRef} />
      </div>

      {/* Sticky input */}
      <div style={{
        padding: '1rem',
        borderTop: '1px solid #ccc',
        display: 'flex',
        backgroundColor: '#fff'
      }}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && onSend()}
          placeholder="Type your message…"
          style={{
            flex: 1,
            padding: '12px',
            fontSize: '1rem',
            borderRadius: '999px',
            border: '1px solid #ccc',
            marginRight: '12px'
          }}
        />
        <button
          onClick={() => onSend()}
          style={{
            backgroundColor: '#1e70ff',
            color: '#fff',
            border: 'none',
            borderRadius: '999px',
            padding: '12px 20px',
            fontSize: '1rem',
            cursor: 'pointer'
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}
