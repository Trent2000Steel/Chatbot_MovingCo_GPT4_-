import React, { useState, useEffect, useRef } from 'react';
import styles from '../styles/Chat.module.css';

const chatSteps = [
  {
    id: 1,
    question: "Where are you moving from?",
    type: "text",
    field: "origin",
    placeholder: "City, State (e.g. Dallas, TX)"
  },
  {
    id: 2,
    question: "Where to?",
    type: "text",
    field: "destination",
    placeholder: "City, State (e.g. Phoenix, AZ)"
  },
  {
    id: 3,
    question: "What’s your move date?",
    type: "text",
    field: "date",
    placeholder: "MM/DD/YYYY or 'Not sure yet'"
  },
  {
    id: 4,
    question: "What matters most to you about this move?",
    type: "text",
    field: "priority",
    placeholder: "Timing, cost, fragile items…"
  },
  {
    id: 5,
    question: "What type of place are you moving from?",
    type: "buttons",
    field: "placeType",
    options: ["House", "Apartment", "Storage Unit", "Other"]
  },
  {
    id: 6,
    question: "Any stairs, elevators, or long walks to the truck?",
    type: "buttons",
    field: "access",
    options: ["Stairs", "Elevator", "Long Walk", "Nope"]
  },
  {
    id: 7,
    question: "What help do you need?",
    type: "buttons",
    field: "helpLevel",
    options: ["Load + Unload", "Include Packing", "Just Transport", "I’ll explain"]
  },
  {
    id: 8,
    question: "Any fragile, heavy, or high-value items?",
    type: "text",
    field: "specialItems",
    placeholder: "TVs, pianos, antiques, etc."
  }
];

export default function ChatFlow() {
  const [stepIndex, setStepIndex] = useState(0);
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [memory, setMemory] = useState({});
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (stepIndex < chatSteps.length) {
      const nextStep = chatSteps[stepIndex];
      setMessages(prev => [...prev, { from: 'bot', text: nextStep.question, options: nextStep.options }]);
    } else {
      runEstimate();
    }
  }, [stepIndex]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleUserInput = async (input) => {
    const currentStep = chatSteps[stepIndex];
    const newMemory = { ...memory, [currentStep.field]: input };

    setMessages(prev => [...prev, { from: 'user', text: input }]);
    setMemory(newMemory);
    setUserInput('');
    setStepIndex(prev => prev + 1);
  };

  const runEstimate = async () => {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ memory })
    });
    const data = await response.json();
    setMessages(prev => [
      ...prev,
      { from: 'bot', text: "Okay, here's a quick summary of your move:" },
      { from: 'bot', text: `From: ${memory.origin}\nTo: ${memory.destination}\nDate: ${memory.date}\nSpecial items: ${memory.specialItems || 'None listed'}` },
      { from: 'bot', text: "Let me calculate your quote..." },
      { from: 'bot', text: data.reply },
      { from: 'bot', text: "Would you like to reserve your move with an $85 deposit?" },
    ]);
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.chatBox}>
        {messages.map((msg, idx) => (
          <div key={idx} className={msg.from === 'bot' ? styles.botBubble : styles.userBubble}>
            {msg.text}
            {msg.options && (
              <div className={styles.buttonRow}>
                {msg.options.map((option, i) => (
                  <button key={i} className={styles.optionButton} onClick={() => handleUserInput(option)}>
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>
      {stepIndex < chatSteps.length && chatSteps[stepIndex].type === 'text' && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (userInput.trim()) {
              handleUserInput(userInput.trim());
            }
          }}
          className={styles.inputForm}
        >
          <input
            type="text"
            placeholder={chatSteps[stepIndex].placeholder}
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            className={styles.textInput}
          />
          <button type="submit" className={styles.sendButton}>Send</button>
        </form>
      )}
    </div>
  );
}