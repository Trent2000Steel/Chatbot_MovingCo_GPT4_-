import React, { useEffect, useRef } from 'react';

export default function ChatUI({ messages, inputValue, onChange, onSend, options, onOptionClick, placeholder, onBackClick }) {
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div style={styles.container}>

      {/* Header */}
      <div style={styles.header}>
        <button onClick={onBackClick} style={styles.backButton}>← Back</button>
        <img src="/Header.png" alt="Logo" style={styles.logo} />
      </div>

      {/* Chat area */}
      <div style={styles.chatBox}>
        {messages.map((msg, index) => (
          <div key={index} style={msg.role === 'user' ? styles.userBubbleWrapper : styles.botBubbleWrapper}>
            <div style={msg.role === 'user' ? styles.userBubble : styles.botBubble}>
              {msg.text}
              {msg.role === 'bot' && msg.options && (
                <div style={styles.optionsContainer}>
                  {msg.options.map((option, i) => (
                    <button
                      key={i}
                      className="chat-option"
                      style={styles.optionButton}
                      onClick={() => onOptionClick(option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div style={styles.timestamp}>{msg.timestamp}</div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Input area */}
      <div style={styles.inputArea}>
        <input
          type="text"
          value={inputValue}
          onChange={onChange}
          placeholder={placeholder}
          style={styles.input}
          onKeyDown={(e) => e.key === 'Enter' && onSend()}
        />
        <button onClick={onSend} style={styles.sendButton}>Send</button>
      </div>

    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    fontFamily: 'Inter, sans-serif',
    backgroundColor: '#ffffff',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px',
    borderBottom: '1px solid #eee',
    position: 'relative',
  },
  backButton: {
    background: 'none',
    border: 'none',
    fontSize: '16px',
    cursor: 'pointer',
    color: '#1e70ff',
    marginRight: 'auto',
  },
  logo: {
    height: '40px',
    margin: '0 auto',
  },
  chatBox: {
    flex: 1,
    overflowY: 'auto',
    padding: '16px',
    backgroundColor: '#f8f8f8',
  },
  userBubbleWrapper: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: '8px',
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  botBubbleWrapper: {
    display: 'flex',
    justifyContent: 'flex-start',
    marginBottom: '8px',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  userBubble: {
    backgroundColor: '#d6ecff',
    padding: '12px 16px',
    borderRadius: '20px',
    maxWidth: '75%',
  },
  botBubble: {
    backgroundColor: '#e5e5ea',
    padding: '12px 16px',
    borderRadius: '20px',
    maxWidth: '75%',
  },
  timestamp: {
    fontSize: '11px',
    color: '#999',
    marginTop: '4px',
  },
  inputArea: {
    display: 'flex',
    padding: '12px',
    borderTop: '1px solid #ddd',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    padding: '10px 14px',
    borderRadius: '999px',
    border: '1px solid #ccc',
    outline: 'none',
    fontSize: '16px',
  },
  sendButton: {
    marginLeft: '10px',
    padding: '10px 16px',
    backgroundColor: '#1e70ff',
    color: 'white',
    border: 'none',
    borderRadius: '999px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  optionsContainer: {
    marginTop: '10px',
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
  },
  optionButton: {
    backgroundColor: '#1e70ff',
    color: 'white',
    padding: '8px 14px',
    border: 'none',
    borderRadius: '999px',
    cursor: 'pointer',
    fontSize: '14px',
  },
};
