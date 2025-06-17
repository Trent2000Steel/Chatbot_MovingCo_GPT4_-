
import { useEffect, useRef } from 'react';

export default function ChatUI({ messages, input, setInput, onSend, isTyping, buttonOptions }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const formatTime = (date) => {
    const d = new Date(date);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#fff',
      fontFamily: 'Inter, sans-serif'
    }}>
      {/* Fixed Top Bar */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        backgroundColor: '#1e70ff',
        color: '#fff',
        padding: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 1000
      }}>
        <button
          onClick={() => window.history.back()}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#fff',
            fontSize: '18px',
            cursor: 'pointer',
          }}
        >
          ← Back
        </button>
        <div style={{
          fontSize: '18px',
          fontWeight: '600',
          marginLeft: 'auto',
          marginRight: 'auto',
          textAlign: 'center',
        }}>
          Moving<span style={{ fontWeight: '300' }}>.CO</span>
        </div>
        <div style={{ width: '60px' }}></div>
      </div>

      {/* Scrollable Messages */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '80px 1rem 140px',
        WebkitOverflowScrolling: 'touch'
      }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
            backgroundColor: msg.sender === 'user' ? '#d2ebff' : '#f1f1f1',
            borderRadius: '18px',
            padding: '12px 16px',
            marginBottom: '4px',
            maxWidth: '85%',
            fontSize: '1rem',
            lineHeight: '1.5',
            position: 'relative'
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
            <div style={{
              fontSize: '0.75rem',
              color: '#888',
              marginTop: '4px',
              textAlign: msg.sender === 'user' ? 'right' : 'left'
            }}>
              {formatTime(Date.now())}
            </div>
          </div>
        ))}
        {isTyping && (
          <div style={{
            backgroundColor: '#f1f1f1',
            borderRadius: '18px',
            padding: '12px 16px',
            maxWidth: '60px',
            marginBottom: '8px',
            fontSize: '1.5rem',
            color: '#999',
            alignSelf: 'flex-start'
          }}>
            ...
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Fixed Input Bar */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '100%',
        padding: '1rem env(safe-area-inset-left) calc(1.5rem + env(safe-area-inset-bottom)) env(safe-area-inset-right)',
        borderTop: '1px solid #ccc',
        backgroundColor: '#fff',
        zIndex: 1000,
        display: 'flex',
        gap: '0.75rem',
        alignItems: 'center'
      }}>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              onSend();
            }
          }}
          rows={1}
          placeholder="Type your message…"
          style={{
            flex: 1,
            padding: '16px',
            fontSize: '1.05rem',
            lineHeight: '1.4',
            borderRadius: '999px',
            border: '1px solid #ccc',
            resize: 'none',
            overflow: 'hidden',
            maxHeight: '120px',
          }}
        />
        <button
          onClick={() => onSend()}
          style={{
            backgroundColor: '#1e70ff',
            color: '#fff',
            border: 'none',
            borderRadius: '999px',
            padding: '16px 24px',
            fontSize: '1rem',
            cursor: 'pointer',
            height: '56px'
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}
