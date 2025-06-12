
import React, { useEffect, useState } from "react";
import ChatUI from "./ChatUI";
import ChatOpener from "./ChatOpener";
import EstimateFlow from "./EstimateFlow";
import ChatFlow_Closing from "./ChatFlow_Closing";

export default function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [options, setOptions] = useState([]);
  const [isThinking, setIsThinking] = useState(false);
  const [phase, setPhase] = useState("opener");

  useEffect(() => {
    // Inject welcome message once on load
    if (messages.length === 0) {
      addBotMessage("No forms, no waiting — I’ll give you a real price range right now.");
    }
  }, []);

  const addBotMessage = (text) => {
    setMessages((prev) => [...prev, { sender: "bot", text, timestamp: getTime() }]);
  };

  const addUserMessage = (text) => {
    setMessages((prev) => [...prev, { sender: "user", text, timestamp: getTime() }]);
  };

  const getTime = () => {
    return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const handleInputChange = (e) => setInput(e.target.value);

  const handleUserInput = (text) => {
    if (!text.trim()) return;
    addUserMessage(text);
    setInput("");
  };

  const handleOpenerComplete = () => {
    setPhase("estimate");
  };

  const handleQuoteGenerated = () => {
    setPhase("closing");
  };

  const handleSubmitStripe = () => {
    addBotMessage("Great — let’s reserve your move! Redirecting to secure checkout…");
    // Stripe redirect would go here
  };

  const handleAskMoreQuestions = () => {
    addBotMessage("No problem — I’m here to help.");
  };

  const handleEmailQuote = (email) => {
    addBotMessage(`✅ Done! We just sent your estimate to ${email}`);
  };

  return (
    <div>
      <ChatUI
        messages={messages}
        input={input}
        options={options}
        isThinking={isThinking}
        handleInputChange={handleInputChange}
        handleUserInput={handleUserInput}
      />
      {phase === "opener" && (
        <ChatOpener
          onComplete={handleOpenerComplete}
          addBotMessage={addBotMessage}
          addUserMessage={addUserMessage}
        />
      )}
      {phase === "estimate" && (
        <EstimateFlow
          onQuoteReady={handleQuoteGenerated}
          addBotMessage={addBotMessage}
        />
      )}
      {phase === "closing" && (
        <ChatFlow_Closing
          onSubmitStripe={handleSubmitStripe}
          onAskMoreQuestions={handleAskMoreQuestions}
          onEmailQuote={handleEmailQuote}
        />
      )}
    </div>
  );
}
