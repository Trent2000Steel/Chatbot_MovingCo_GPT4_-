
import React, { useState, useEffect } from "react";
import ChatUI from "./ChatUI";
import opener from "./ChatOpener";
import estimate from "./EstimateFlow";
import closer from "./ChatFlow_Closing";

export default function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [options, setOptions] = useState([]);
  const [isThinking, setIsThinking] = useState(false);
  const [sessionId] = useState(() => Date.now().toString());

  useEffect(() => {
    const initialMessages = [
      { sender: "bot", text: "No forms, no waiting — I’ll give you a real price. Where are you moving from?", timestamp: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }) }
    ];
    setMessages(initialMessages);
  }, []);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleUserInput = async (userText) => {
    if (!userText.trim()) return;

    const userMessage = {
      sender: "user",
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setOptions([]);
    setIsThinking(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, userInput: userText }),
      });

      const data = await res.json();

      const botMessage = {
        sender: "bot",
        text: data.message,
        timestamp: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
      };

      setMessages([...updatedMessages, botMessage]);
      setOptions(data.buttons || []);
    } catch (err) {
      setMessages([...updatedMessages, {
        sender: "bot",
        text: "Oops, something went wrong. Please try again.",
        timestamp: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
      }]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <ChatUI
      messages={messages}
      input={input}
      options={options}
      isThinking={isThinking}
      handleInputChange={handleInputChange}
      handleUserInput={handleUserInput}
    />
  );
}
