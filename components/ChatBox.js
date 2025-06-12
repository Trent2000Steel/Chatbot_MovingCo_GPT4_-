
import React, { useState } from 'react';
import ChatOpener from './ChatOpener';
import EstimateFlow from './EstimateFlow';
import ChatFlow_Closing from './ChatFlow_Closing';
import ChatUI from './ChatUI';

export default function ChatBox() {
  const [phase, setPhase] = useState('opener');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [options, setOptions] = useState([]);
  const [isThinking, setIsThinking] = useState(false);
  const [userData, setUserData] = useState({});

  const handleOpenerComplete = (data) => {
    setUserData(data);
    setMessages(prev => [
      ...prev,
      { sender: 'system', text: 'Thanks! I’m preparing your quote now…' }
    ]);
    setPhase('estimate');
  };

  const handleEstimateComplete = (quoteMessages) => {
    setMessages(prev => [...prev, ...quoteMessages]);
    setPhase('closing');
  };

  const handleInputChange = (e) => setInput(e.target.value);

  const handleUserInput = (text) => {
    if (!text.trim()) return;
    setMessages(prev => [...prev, { sender: 'user', text, timestamp: new Date().toLocaleTimeString() }]);
    setInput('');
  };

  const handleSubmitStripe = () => {
    alert("Stripe checkout placeholder");
  };

  const handleAskMoreQuestions = () => {
    setMessages(prev => [...prev, {
      sender: 'system',
      text: "Let me know what's on your mind!"
    }]);
  };

  const handleEmailQuote = (email) => {
    setMessages(prev => [...prev, {
      sender: 'system',
      text: `✅ Quote sent to ${email}`
    }]);
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

      {phase === 'opener' && <ChatOpener onComplete={handleOpenerComplete} />}
      {phase === 'estimate' && <EstimateFlow userData={userData} onComplete={handleEstimateComplete} />}
      {phase === 'closing' && (
        <ChatFlow_Closing
          onSubmitStripe={handleSubmitStripe}
          onAskMoreQuestions={handleAskMoreQuestions}
          onEmailQuote={handleEmailQuote}
        />
      )}
    </div>
  );
}
