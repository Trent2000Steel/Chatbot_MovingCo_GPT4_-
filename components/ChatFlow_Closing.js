
// components/ChatFlow_Closing.js

import React, { useState } from 'react';

export default function ChatFlow_Closing({ onSubmitStripe, onAskMoreQuestions, onEmailQuote }) {
  const [stage, setStage] = useState('initial');
  const [email, setEmail] = useState('');
  const [userQuestion, setUserQuestion] = useState('');

  const handleAskMore = () => {
    setStage('questions');
    onAskMoreQuestions();
  };

  const handleEmailFlow = () => {
    setStage('emailPrompt');
  };

  const handleEmailSubmit = () => {
    if (!email.includes('@')) return;
    fetch('/api/sendToTelegram', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        summary: '1-bedroom move from McKinney, TX to Phoenix, AZ on Aug 13',
        quote: '$2200–$2800 flat',
        intent: 'COOLDOWN EMAIL REQUEST',
      }),
    });
    setStage('emailSent');
    onEmailQuote(email);
  };

  return (
    <div className="chat-closing">
      {stage === 'initial' && (
        <>
          <div className="bot-message">
            Your live quote is: <strong>$2200 – $2800 flat</strong><br />
            (Rates may change. This is a live estimate.)
          </div>
          <div className="bot-message">
            Here’s how it works: You pay a <strong>$85 deposit</strong> to reserve your MoveSafe Call.
            After the call, you’ll get a final flat-rate offer. Fully refundable if you don’t go forward.
          </div>
          <div className="bot-message">
            Would you like to reserve your move?
          </div>
          <div className="options">
            <button onClick={onSubmitStripe}>Yes, Reserve My Move</button>
            <button onClick={handleAskMore}>I Have More Questions First</button>
          </div>
        </>
      )}

      {stage === 'questions' && (
        <>
          <div className="bot-message">
            Of course — I’m here to help. Ask me anything about your quote or the process.
            Just a reminder: I can't provide legal advice, insurance guarantees, or imply we’re the carrier. I'm your move concierge. 🙂
          </div>
          <input
            type="text"
            value={userQuestion}
            onChange={(e) => setUserQuestion(e.target.value)}
            placeholder="Type your question here"
          />
          <button onClick={handleEmailFlow}>I’m still not ready — email me the quote</button>
        </>
      )}

      {stage === 'emailPrompt' && (
        <>
          <div className="bot-message">
            Totally understand — sometimes it helps to think it over.
            What’s the best email to send your quote to?
          </div>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button onClick={handleEmailSubmit}>Send My Quote</button>
        </>
      )}

      {stage === 'emailSent' && (
        <div className="bot-message">
          ✅ Done! We just sent your estimate to {email}.
        </div>
      )}
    </div>
  );
}
