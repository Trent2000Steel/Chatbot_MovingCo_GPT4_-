
// ChatFlowMerged.js

// Step logic

export default function getChatMessage(phase, memory) {
  switch (phase) {
    case 1:
      return {
        message: "No forms, no waiting — I’ll give you a real price range right now. Where are you moving from?",
        field: "origin",
        placeholder: "City, State (e.g. Dallas, TX)"
      };
    case 2:
      return {
        message: "Where to?",
        field: "destination",
        placeholder: "City, State (e.g. Phoenix, AZ)"
      };
    case 3:
      return {
        message: "When are you moving?",
        field: "moveDate",
        placeholder: "Example: Aug 1, next weekend, or I'm flexible"
      };
    case 4:
      return {
        message: "What matters most to you about this move?",
        field: "priority",
        placeholder: "For example: timing, cost, safety, or fragile items"
      };
    case 5:
      return {
        message: "What type of place are you moving from?",
        field: "placeType",
        options: ["House", "Apartment", "Storage Unit", "Other"]
      };
    case 6:
      return {
        message: "And what size roughly?",
        field: "placeSize",
        options: ["1 Bedroom", "2 Bedrooms", "3 Bedrooms", "4+ Bedrooms"]
      };
    case 7:
      return {
        message: "Any stairs, elevators, or long walks to the truck?",
        field: "obstacles",
        options: ["Stairs", "Elevator", "Long Walk", "Nope"]
      };
    case 8:
      return {
        message: "Would you like to include packing in your estimate?",
        field: "packing",
        options: ["Yes, include packing", "No, I’ll pack myself"]
      };
    case 9:
      return {
        message: "Any fragile, heavy, or high-value items?",
        field: "specialItems",
        placeholder: "TVs, antiques, artwork, safes, gym equipment, etc."
      };
    default:
      return {
        message: "Thanks! Quoting your move now...",
        field: null
      };
  }
}


// UI component

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
        padding: "16px",
        transition: "all 0.3s ease"
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


// Flow logic

import React, { useState } from "react";
import getChatMessage from "./Chatsteps"; // fixed case to match actual file name
import ChatUI from "./ChatUI";

export default function ChatFlow() {
  const [phase, setPhase] = useState(1);
  const [memory, setMemory] = useState({});
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isThinking, setIsThinking] = useState(false);

  const currentStep = getChatMessage(phase, memory);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleUserInput = (userInput) => {
    if (!userInput) return;
    const updatedMessages = [
      ...messages,
      { sender: "user", text: userInput, timestamp: new Date().toLocaleTimeString() }
    ];

    const updatedMemory = { ...memory };
    if (currentStep.field) {
      updatedMemory[currentStep.field] = userInput;
    }

    setMessages(updatedMessages);
    setInput("");
    setIsThinking(true);

    setTimeout(() => {
      const nextPhase = phase + 1;
      const nextStep = getChatMessage(nextPhase, updatedMemory);
      const botMessage = nextStep.message || "Okay.";
      setMessages([
        ...updatedMessages,
        { sender: "bot", text: botMessage, timestamp: new Date().toLocaleTimeString() }
      ]);
      setMemory(updatedMemory);
      setPhase(nextPhase);
      setIsThinking(false);
    }, 600);
  };

  return (
    <ChatUI
      messages={messages}
      input={input}
      options={currentStep.options || []}
      isThinking={isThinking}
      handleInputChange={handleInputChange}
      handleUserInput={handleUserInput}
    />
  );
}

