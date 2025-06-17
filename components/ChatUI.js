
import React from 'react';

const ChatUI = ({ messages, handleUserInput, userInput, setUserInput }) => {
  return (
    <div style={styles.chatContainer}>
      <div style={styles.header}>MovingCo Chat</div>

      <div style={styles.messagesWrapper} id="messages-wrapper">
        {messages.map((msg, idx) => (
          <div key={idx} style={{ ...styles.messageGroup, alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
            <div style={{
              ...styles.bubble,
              backgroundColor: msg.sender === 'user' ? '#1e70ff' : '#f1f1f1',
              color: msg.sender === 'user' ? 'white' : 'black',
              borderRadius: msg.sender === 'user'
                ? '18px 18px 4px 18px'
                : '18px 18px 18px 4px'
            }}>
              {msg.text}
            </div>
            {msg.options && msg.options.length > 0 && (
              <div style={styles.options}>
                {msg.options.map((opt, i) => (
                  <button key={i} style={styles.optionBtn} onClick={() => handleUserInput(opt)}>{opt}</button>
                ))}
              </div>
            )}
          </div>
        ))}
        <div id="bottom-anchor" />
      </div>

      <div style={styles.inputBar}>
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleUserInput(userInput)}
          placeholder="Type your message..."
          style={styles.input}
        />
        <button onClick={() => handleUserInput(userInput)} style={styles.sendBtn}>Send</button>
      </div>
    </div>
  );
};

const styles = {
  chatContainer: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'white',
    fontFamily: 'Inter, sans-serif',
    zIndex: 1000,
  },
  header: {
    height: 50,
    padding: '0 16px',
    fontWeight: 'bold',
    fontSize: 17,
    display: 'flex',
    alignItems: 'center',
    borderBottom: '1px solid #ddd',
    backgroundColor: '#ffffff',
    position: 'fixed',
    top: 0,
    width: '100%',
    zIndex: 1001,
  },
  messagesWrapper: {
    flex: 1,
    marginTop: 50,
    marginBottom: 60,
    padding: '10px 12px',
    overflowY: 'auto',
  },
  messageGroup: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: 12,
    maxWidth: '100%',
  },
  bubble: {
    padding: '8px 14px',
    maxWidth: '80%',
    fontSize: 15,
    lineHeight: 1.4,
    wordBreak: 'break-word',
  },
  options: {
    display: 'flex',
    flexWrap: 'wrap',
    marginTop: 6,
    gap: '8px',
  },
  optionBtn: {
    padding: '6px 14px',
    fontSize: 14,
    borderRadius: 999,
    backgroundColor: '#1e70ff',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
  },
  inputBar: {
    position: 'fixed',
    bottom: 0,
    width: '100%',
    padding: '8px 10px',
    display: 'flex',
    backgroundColor: '#fff',
    borderTop: '1px solid #ddd',
    zIndex: 1001,
  },
  input: {
    flex: 1,
    padding: '10px 14px',
    fontSize: 15,
    borderRadius: 20,
    border: '1px solid #ccc',
    marginRight: 10,
  },
  sendBtn: {
    backgroundColor: '#1e70ff',
    color: 'white',
    border: 'none',
    borderRadius: 20,
    padding: '10px 16px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
};

export default ChatUI;
