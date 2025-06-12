
import React, { useState, useEffect } from "react";
import ChatUI from "./ChatUI";
import opener from "./ChatOpener";
import estimate from "./EstimateFlow";
import closer from "./ChatFlow_Closing";
import runChat from "./chat";

export default function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [options, setOptions] = useState([]);
  const [isThinking, setIsThinking] = useState(false);

  useEffect(() => {
    // Load initial messages from the opener phase
    const initialMessages = opener.messages || [];
    setMessages(initialMessages);
    setOptions(opener.options || []);
  }, []);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleUserInput = async (userText) => {
    if (!userText.trim()) return;

    const userMessage = { sender: "user", text: userText, timestamp: new Date().toLocaleTimeString() };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setOptions([]);
    setIsThinking(true);

    const { reply, nextOptions } = await runChat({
      messages: updatedMessages,
      input: userText,
      opener,
      estimate,
      closer
    });

    const botMessage = { sender: "bot", text: reply, timestamp: new Date().toLocaleTimeString() };
    setMessages([...updatedMessages, botMessage]);
    setOptions(nextOptions || []);
    setIsThinking(false);
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
