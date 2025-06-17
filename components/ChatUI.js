
import React, { useEffect, useRef } from 'react';

export default function ChatUI({
  messages,
  handleUserInput,
  userInput,
  setUserInput,
  placeholder,
  buttonOptions,
  onBackClick
}) {
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const formatTime = () => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div style={styles.chatContainer}>
      {/* Header */}
      <div style={styles.header}>
        <button onClick={onBackClick} style={styles.backBtn}>← Back</button>
        <div style={styles.logoText}>Moving<span style={{ color: '#bbdefb' }}>.Chat</span></div>
      </div>

      {/* Messages */}
      <div style={styles.messagesWrapper}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              ...styles.messageGroup,
              alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start',
            }}
          >
            <div
              style={{
                ...styles.bubble,
                backgroundColor: msg.sender === 'user' ? '#1e70ff' : '#f1f1f1',
                color: msg.sender === 'user' ? 'white' : 'black',
                borderRadius: msg.sender === 'user'
                  ? '18px 18px 4px 18px'
                  : '18px 18px 18px 4px'
              }}
            >
              {msg.text}
              {msg.sender === 'bot' && idx === messages.length - 1 && buttonOptions.length > 0 && (
                <div style={styles.options}>
                  {buttonOptions.map((opt, i) => (
                    <button key={i} style={styles.optionBtn} onClick={() => handleUserInput(opt)}>{opt}</button>
                  ))}
                </div>
              )}
            </div>
            <div style={styles.timestamp}>{formatTime()}</div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <div style={styles.inputBar}>
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleUserInput(userInput)}
          placeholder={placeholder}
          style={styles.input}
        />
        <button onClick={() => handleUserInput(userInput)} style={styles.sendBtn}>Send</button>
      </div>
    </div>
  );
}

const styles = {
  chatContainer: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    backgroundColor: '#ffffff',
    fontFamily: 'Inter, sans-serif',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 16px',
    backgroundColor: '#1a73e8',
    color: '#ffffff',
  },
  backBtn: {
    background: 'none',
    border: 'none',
    fontSize: '16px',
    color: '#ffffff',
    cursor: 'pointer',
  },
  logoText: {
    fontWeight: 'bold',
    fontSize: '16px',
    color: '#ffffff',
  },
  messagesWrapper: {
    flex: 1,
    padding: '16px',
    overflowY: 'auto',
  },
  messageGroup: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: 14,
  },
  bubble: {
    padding: '12px 16px',
    fontSize: 15,
    lineHeight: 1.4,
    maxWidth: '80%',
    wordBreak: 'break-word',
  },
  timestamp: {
    fontSize: '11px',
    color: '#888',
    marginTop: '4px',
  },
  options: {
    display: 'flex',
    flexWrap: 'wrap',
    marginTop: 10,
    gap: '8px',
  },
  optionBtn: {
    backgroundColor: '#1e70ff',
    color: 'white',
    padding: '6px 12px',
    borderRadius: 999,
    border: 'none',
    fontSize: 14,
    cursor: 'pointer',
  },
  inputBar: {
    display: 'flex',
    padding: '12px 16px',
    borderTop: '1px solid #ddd',
    backgroundColor: '#fff',
    paddingBottom: 'env(safe-area-inset-bottom)',
  },
  input: {
    flex: 1,
    padding: '10px 14px',
    fontSize: 15,
    borderRadius: 999,
    border: '1px solid #ccc',
    marginRight: 10,
  },
  sendBtn: {
    backgroundColor: '#1e70ff',
    color: 'white',
    border: 'none',
    borderRadius: 999,
    padding: '10px 16px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
};
