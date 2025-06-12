
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
