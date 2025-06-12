
import React, { useState, useEffect } from "react";
import ChatUI from "./ChatUI";

const openerSteps = [
  { phase: 1, message: "Where are you moving from?", type: "text" },
  { phase: 2, message: "Where to?", type: "text" },
  { phase: 3, message: "What’s your move date? (e.g., Aug 13, 2025 — or just say 'ASAP' or 'within 30 days')", type: "text" },
  { phase: 4, message: "What matters most to you about this move?", type: "text" },
  { phase: 5, message: "What type of place are you moving from?", type: "text" },
  { phase: 6, message: "And what size roughly?", type: "text" },
  { phase: 7, message: "Any stairs, elevators, or long walks to the truck?", type: "text" },
  { phase: 8, message: "What help do you need?", type: "text" },
  { phase: 9, message: "Any fragile, heavy, or high-value items?", type: "text" }
];

export default function ChatFlow() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [phase, setPhase] = useState(1);
  const [moveDetails, setMoveDetails] = useState({});
  const [isThinking, setIsThinking] = useState(false);
  const [quoteDelivered, setQuoteDelivered] = useState(false);
  const [showCTA, setShowCTA] = useState(false);

  useEffect(() => {
    if (phase === 1) {
      const welcomeMessage = {
        sender: "bot",
        text: "No forms, no waiting — I’ll give you a real price range right now. Let’s start.",
        timestamp: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
      };
      setMessages([welcomeMessage]);
    }

    const currentStep = openerSteps.find((s) => s.phase === phase);
    if (currentStep && phase <= 9) {
      const questionMessage = {
        sender: "bot",
        text: currentStep.message,
        timestamp: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
      };
      setMessages((prev) => [...prev, questionMessage]);
    }
  }, [phase]);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleUserInput = async (userText) => {
    if (!userText.trim()) return;

    const timestamp = new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
    const userMessage = { sender: "user", text: userText, timestamp };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsThinking(true);

    const keyMap = {
      1: "origin",
      2: "destination",
      3: "date",
      4: "importance",
      5: "homeType",
      6: "size",
      7: "obstacles",
      8: "help",
      9: "specialItems"
    };

    const currentKey = keyMap[phase];
    setMoveDetails((prev) => ({ ...prev, [currentKey]: userText }));

    if (phase < 9) {
      setPhase((prev) => prev + 1);
      setIsThinking(false);
      return;
    }

    const recapMessages = [
      { sender: "bot", text: `Okay — I’ve got your ${moveDetails.size || "unknown size"} ${moveDetails.homeType || "home"} move from ${moveDetails.origin} to ${moveDetails.destination} on ${moveDetails.date}.`, timestamp },
      { sender: "bot", text: "Let me run your quote real quick…", timestamp },
      { sender: "bot", text: "Checking route availability, fuel rates, and mover options…", timestamp },
      { sender: "bot", text: "Filtering movers with 4.5 stars or higher…", timestamp },
      { sender: "bot", text: "Calculating your live quote…", timestamp }
    ];
    setMessages((prev) => [...prev, ...recapMessages]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ moveDetails })
      });

      const data = await res.json();

      const quoteMessage = {
        sender: "bot",
        text: data.reply || "Here’s your quote!",
        timestamp
      };

      setMessages((prev) => [...prev, quoteMessage]);
      setQuoteDelivered(true);
      setShowCTA(true);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Sorry, something went wrong while generating your quote.",
          timestamp
        }
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  useEffect(() => {
    if (quoteDelivered && showCTA) {
      const ctaMessage = {
        sender: "bot",
        text: "Would you like to reserve your move with an $85 deposit (100% refundable)?",
        timestamp: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
      };
      setMessages((prev) => [...prev, ctaMessage]);
    }
  }, [quoteDelivered, showCTA]);

  return (
    <ChatUI
      messages={messages}
      input={input}
      options={showCTA ? ["✅ Yes, Reserve My Move", "🤔 I Have More Questions First"] : []}
      isThinking={isThinking}
      handleInputChange={handleInputChange}
      handleUserInput={handleUserInput}
    />
  );
}
