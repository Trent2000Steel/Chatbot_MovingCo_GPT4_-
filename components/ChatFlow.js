
import React, { useState } from "react";
import getChatMessage from "./Chatsteps";
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
      placeholder={currentStep.placeholder}
    />
  );
}
