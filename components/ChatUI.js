import React from "react";

export default function ChatUI({
  messages = [],
  input,
  options = [],
  isThinking,
  handleInputChange,
  handleUserInput
}) {
  return (
    <div style={{ fontFamily: "Arial, sans-serif" }}>
      <div style={{
        minHeight: "320px",
        maxHeight: "480px",
        overflowY: "auto",
        padding: "16px",
        transition: "max-height 0.3s ease"
      }}>
        {messages.map((msg, index) => (
          <div key={index} style={{ marginBottom: "12px", textAlign: msg.sender === "user" ? "right" : "left" }}>
            <div
              style={{
                display: "inline-block",
                padding: "10px 14px",
                borderRadius: "16px",
                backgroundColor: msg.sender === "user" ? "#d0ebff" : "#f1f0f0",
                color: "#333",
                maxWidth: "80%",
                fontSize: "14px",
                whiteSpace: "pre-wrap"
              }}
            >
              {msg.text}
            </div>
            <div style={{ fontSize: "11px", color: "#999", marginTop: "4px" }}>
              {msg.timestamp}
            </div>
          </div>
        ))}
      </div>

      {isThinking && <div style={{ fontStyle: "italic", padding: "8px" }}>...</div>}

      {options.length > 0 && (
        <div style={{ marginBottom: "12px", marginTop: "8px" }}>
          {options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleUserInput(option)}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#1664d4")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "#1e70ff")}
              style={{
                marginRight: "8px",
                marginBottom: "8px",
                padding: "10px 20px",
                borderRadius: "20px",
                backgroundColor: "#1e70ff",
                color: "#fff",
                fontSize: "14px",
                border: "none",
                cursor: "pointer",
                boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
                transition: "background-color 0.2s ease"
              }}
            >
              {option}
            </button>
          ))}
        </div>
      )}

      <div style={{ marginTop: "10px", display: "flex" }}>
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          onKeyDown={(e) => e.key === "Enter" && handleUserInput(input)}
          placeholder="Type your answer..."
          style={{
            flex: 1,
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            fontSize: "14px"
          }}
        />
        <button
          onClick={() => handleUserInput(input)}
          style={{
            padding: "10px 16px",
            marginLeft: "8px",
            borderRadius: "8px",
            backgroundColor: "#1e70ff",
            color: "#fff",
            border: "none",
            cursor: "pointer"
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}