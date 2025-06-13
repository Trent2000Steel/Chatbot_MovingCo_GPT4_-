// ChatFlow.js

import React, { useState } from "react";
import ChatUI from "./ChatUI";

// Step logic — now a named export
export function getChatMessage(phase, memory) {
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

// Main flow component
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

  const handleUserInput = async (userInput) => {
    if (!userInput) return;

    const userMessage = {
      sender: "user",
      text: userInput,
      timestamp: new Date().toLocaleTimeString()
    };

    const updatedMessages = [...messages, userMessage];
    const updatedMemory = { ...memory };
    if (currentStep.field) {
      updatedMemory[currentStep.field] = userInput;
    }

    setMessages(updatedMessages);
    setInput("");
    setIsThinking(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({
            role: m.sender === "user" ? "user" : "assistant",
            content: m.text
          })),
          userInput
        })
      });

      const data = await response.json();
      const replyText = data.reply || "Sorry, something went wrong.";

      const botMessage = {
        sender: "bot",
        text: replyText,
        timestamp: new Date().toLocaleTimeString()
      };

      setMessages([...updatedMessages, botMessage]);
      setMemory(updatedMemory);
      setPhase(phase + 1);
    } catch (err) {
      console.error("Error calling GPT backend:", err);
    } finally {
      setIsThinking(false);
    }
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
