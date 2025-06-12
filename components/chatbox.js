
import React, { useState, useEffect, useRef } from "react";
import MessageList from "./MessageList";
import InputBox from "./InputBox";

export default function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [step, setStep] = useState(0);
  const [isThinking, setIsThinking] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    // Initial welcome message
    setMessages([
      {
        sender: "system",
        text: "Welcome to MovingCo. Want a real quote without calling or giving your info?",
      },
      {
        sender: "system",
        text: "We’ll guide you step-by-step and quote you right here in chat.",
      },
      {
        sender: "system",
        text: "What state are you moving from?",
        options: ["Texas", "California", "Florida", "How it works"],
      },
    ]);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleUserInput = async (input) => {
    if (!input) return;

    const newMessage = { sender: "user", text: input };
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    setIsThinking(true);

    // Simulate AI thinking delay
    setTimeout(async () => {
      // Intercept "How it works"
      if (input === "How it works") {
        const explain = {
          sender: "system",
          text:
            "We coordinate your move from start to finish using verified movers who show up on time, protect your belongings, and deliver a stress-free experience.",
        };
        const repeat = {
          sender: "system",
          text: "Now back to it — what state are you moving from?",
          options: ["Texas", "California", "Florida", "How it works"],
        };
        setMessages([...updatedMessages, explain, repeat]);
        setIsThinking(false);
        return;
      }

      // Proceed with normal steps
      const response = {
        sender: "system",
        text: `Great — you're moving from ${input}. What's the destination state?`,
        options: ["Texas", "California", "Florida"],
      };

      setMessages([...updatedMessages, response]);
      setIsThinking(false);
      setStep(step + 1);
    }, 1000);
  };

  return (
    <div className="chat-container">
      <MessageList messages={messages} bottomRef={bottomRef} />
      {isThinking && <div className="typing-indicator">...</div>}
      <InputBox onSend={handleUserInput} options={messages[messages.length - 1]?.options} />
    </div>
  );
}
