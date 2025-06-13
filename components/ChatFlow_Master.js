
const openerSteps = [
  {
    phase: 1,
    message: "Where are you moving from?",
    type: "text"
  },
  {
    phase: 2,
    message: "Where to?",
    type: "text"
  },
  {
    phase: 3,
    message: "What’s your move date? (e.g., Aug 13, 2025 — or just say 'ASAP' or 'within 30 days')",
    type: "text"
  },
  {
    phase: 4,
    message: "What matters most to you about this move?",
    type: "text"
  },
  {
    phase: 5,
    message: "What type of place are you moving from?",
    options: ["House", "Apartment", "Storage Unit", "Other"]
  },
  {
    phase: 6,
    message: "And what size roughly?",
    type: "text"
  },
  {
    phase: 7,
    message: "Any stairs, elevators, or long walks to the truck?",
    options: ["Stairs", "Elevator", "Long Walk", "Nope"]
  },
  {
    phase: 8,
    message: "What help do you need?",
    options: ["Load + Unload", "Include Packing", "Just Transport", "I’ll explain"]
  },
  {
    phase: 9,
    message: "Any fragile, heavy, or high-value items?",
    type: "text"
  }
];

export default openerSteps;



// components/EstimateFlow.js

import React from 'react';

const EstimateFlow = ({ moveDetails }) => {
  const {
    origin,
    destination,
    date,
    homeType,
    size,
    obstacles,
    help,
    specialItems,
    importance
  } = moveDetails;

  return (
    <div className="chat-sequence">
      <div className="bot-message">
        Okay — I’ve got your {size} {homeType} move from {origin} to {destination} on {date}. Let me run your quote real quick…
      </div>

      {importance && (
        <div className="bot-message">
          Got it — we’ll keep your priorities in mind: <em>{importance}</em>.
        </div>
      )}

      {specialItems && (
        <div className="bot-message">
          We’ll be extra careful with your <em>{specialItems}</em> — no worries there.
        </div>
      )}

      <div className="bot-message">Checking route availability, fuel rates, and verified mover options…</div>
      <div className="bot-message">Filtering movers with 4.5 stars or higher and availability on your date…</div>
      <div className="bot-message">Calculating your live quote…</div>

      <div className="bot-message quote">
        📦 Your official quote: <strong>$2,200 – $2,800 flat rate</strong><br/>
        ✅ Backed by verified movers.<br/>
        🔒 No hidden fees — this is your all-in estimate.
      </div>

      <div className="bot-message">
        Here’s how it works with MovingCo:
        <br/><br/>
        1. You pay an $85 deposit to reserve your spot — 100% refundable.<br/>
        2. You’ll upload photos of each main room (bedroom, garage, etc).<br/>
        3. We’ll call you to review everything and finalize your flat rate.
      </div>

      <div className="bot-message">
        Once you accept the final rate, we ship your packing supplies and lock in your date.<br/>
        💡 Rates are live — they may change soon depending on availability.
      </div>

      <div className="bot-message">Ready to lock in your move?</div>

      <div className="chat-buttons">
        <button className="chat-button primary">✅ Yes, Reserve My Move</button>
        <button className="chat-button">🤔 I Have More Questions First</button>
      </div>
    </div>
  );
};

export default EstimateFlow;



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
