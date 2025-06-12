import React, { useState } from 'react';

const ChatOpener = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { sender: "system", text: "No forms, no waiting — I’ll give you a real price range right now." }
  ]);

  const userData = {
    origin: '',
    destination: '',
    date: '',
    priority: '',
    propertyType: '',
    propertySize: '',
    stairs: '',
    helpLevel: '',
    specialItems: '',
  };

  const handleSubmit = () => {
    if (!input.trim()) return;

    setMessages([...messages, { sender: "user", text: input }]);

    switch (step) {
      case 1:
        userData.origin = input;
        setMessages(prev => [...prev, { sender: "system", text: "Where to?" }]);
        setStep(2);
        break;
      case 2:
        userData.destination = input;
        setMessages(prev => [...prev,
          { sender: "system", text: `Got it — we’ll calculate distance from ${userData.origin} to ${input} when we price your move.` },
          { sender: "system", text: "What’s your move date? (Type the date or say 'Not sure')" }
        ]);
        setStep(3);
        break;
      case 3:
        userData.date = input;
        setMessages(prev => [...prev, { sender: "system", text: "What matters most to you about this move? (e.g., timing, cost, fragile items…)" }]);
        setStep(4);
        break;
      case 4:
        userData.priority = input;
        setMessages(prev => [...prev, {
          sender: "system",
          text: "Thanks for sharing that — I’ll make sure we account for it when building your quote."
        }, {
          sender: "system",
          text: "What type of place are you moving from? (House, Apartment, Storage Unit, Other)"
        }]);
        setStep(5);
        break;
      case 5:
        userData.propertyType = input;
        setMessages(prev => [...prev, { sender: "system", text: "And what size roughly? (e.g., 2-bedroom, studio, or unit size)" }]);
        setStep(6);
        break;
      case 6:
        userData.propertySize = input;
        setMessages(prev => [...prev, {
          sender: "system",
          text: "Any stairs, elevators, or long walks to the truck? (Stairs, Elevator, Long Walk, Nope)"
        }]);
        setStep(7);
        break;
      case 7:
        userData.stairs = input;
        setMessages(prev => [...prev, {
          sender: "system",
          text: "What help do you need? (Load + Unload, Include Packing, Just Transport, I’ll explain)"
        }]);
        setStep(8);
        break;
      case 8:
        userData.helpLevel = input;
        setMessages(prev => [...prev, {
          sender: "system",
          text: "Any fragile, heavy, or high-value items you want me to be extra careful with?"
        }]);
        setStep(9);
        break;
      case 9:
        userData.specialItems = input;
        setMessages(prev => [...prev, {
          sender: "system",
          text: "Noted — we’ll flag those for extra care when coordinating your move."
        }]);
        onComplete(userData);
        break;
      default:
        break;
    }

    setInput('');
  };

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.sender}`}>
            <div className="text">{msg.text}</div>
          </div>
        ))}
      </div>
      <div className="input-row">
        <input
          type="text"
          placeholder="Type here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
        />
        <button onClick={handleSubmit}>Send</button>
      </div>
    </div>
  );
};

export default ChatOpener;
