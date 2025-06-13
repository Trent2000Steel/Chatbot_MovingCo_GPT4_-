
import { useState } from 'react';

export default function ChatFlow() {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: "No forms, no waiting — I’ll give you a real price range right now. Where are you moving from?" }
  ]);
  const [input, setInput] = useState('');
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [buttonOptions, setButtonOptions] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  const getPlaceholder = () => {
    switch (step) {
      case 1: return "City, State (e.g. Dallas, TX)";
      case 2: return "City, State (e.g. Phoenix, AZ)";
      case 3: return "Move date (e.g. June 25)";
      case 4: return "What matters most? (e.g. timing, fragile items)";
      case 8: return "Special items (e.g. piano, art)";
      default: return "";
    }
  };

  const sendBotMessage = (text, options = []) => {
    setMessages(prev => [...prev, { sender: 'bot', text }]);
    setButtonOptions(options);
  };

  const handleUserInput = async (customInput = null) => {
    const userInput = customInput || input.trim();
    if (!userInput) return;

    setMessages(prev => [...prev, { sender: 'user', text: userInput }]);
    setInput('');
    setButtonOptions([]);

    let newStep = step;
    const updatedFormData = { ...formData };

    switch (step) {
      case 1:
        updatedFormData.from = userInput;
        sendBotMessage("Where to?");
        newStep++;
        break;
      case 2:
        updatedFormData.to = userInput;
        sendBotMessage("What’s your move date?");
        newStep++;
        break;
      case 3:
        updatedFormData.date = userInput;
        sendBotMessage("What matters most to you about this move?");
        newStep++;
        break;
      case 4:
        updatedFormData.priority = userInput;
        sendBotMessage("What type of place are you moving from?", ["House", "Apartment", "Storage Unit", "Other"]);
        newStep++;
        break;
      case 5:
        updatedFormData.type = userInput;
        sendBotMessage("And how many bedrooms?", ["1", "2", "3", "4+"]);
        newStep++;
        break;
      case 6:
        updatedFormData.size = userInput;
        sendBotMessage("Do you want packing included in the estimate?", ["Yes", "I'll pack myself"]);
        newStep++;
        break;
      case 7:
        updatedFormData.packing = userInput;
        sendBotMessage("Any fragile or high-value items?");
        newStep++;
        break;
      case 8:
        updatedFormData.special = userInput;
        const summary =
          "Thanks! Here's what I've got:\n" +
          "- From: " + updatedFormData.from + "\n" +
          "- To: " + updatedFormData.to + "\n" +
          "- Date: " + updatedFormData.date + "\n" +
          "- Place: " + updatedFormData.type + " (" + updatedFormData.size + " bedrooms)\n" +
          "- Packing: " + updatedFormData.packing + "\n" +
          "- Priority: " + updatedFormData.priority + "\n" +
          "- Special: " + updatedFormData.special;
        sendBotMessage(summary, ["Run My Estimate"]);
        newStep++;
        break;
      case 9:
        setIsTyping(true);
        try {
          const res = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              messages: messages.map(m => ({ role: m.sender === 'bot' ? 'assistant' : 'user', content: m.text })),
              userInput: userInput
            })
          });
          const data = await res.json();
          sendBotMessage(data.reply || "Based on your info, here's a rough estimate.");
        } catch (error) {
          sendBotMessage("Sorry, something went wrong with the estimate.");
        }
        setIsTyping(false);
        setButtonOptions(["Yes, Reserve My Move", "I Have More Questions First"]);
        newStep++;
        break;
      default:
        break;
    }

    setFormData(updatedFormData);
    setStep(newStep);
  };

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((msg, i) => (
          <div key={i} className={msg.sender === 'bot' ? 'bubble bot' : 'bubble user'}>
            {msg.text}
          </div>
        ))}
        {isTyping && <div className="typing-indicator">...</div>}
      </div>
      <input
        type="text"
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && handleUserInput()}
        placeholder={getPlaceholder()}
        className="chat-input"
      />
      <div className="options">
        {buttonOptions.map((option, i) => (
          <button key={i} onClick={() => handleUserInput(option)}>{option}</button>
        ))}
      </div>

      <style jsx>{`
        .chat-container {
          background: #fff;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 0 20px rgba(0,0,0,0.05);
          margin-top: 20px;
        }
        .messages {
          max-height: 250px;
          overflow-y: auto;
          margin-bottom: 12px;
        }
        .bubble {
          padding: 10px 14px;
          margin: 6px 0;
          border-radius: 10px;
          max-width: 90%;
          word-wrap: break-word;
        }
        .bot {
          background-color: #f1f1f1;
          align-self: flex-start;
        }
        .user {
          background-color: #cce5ff;
          align-self: flex-end;
        }
        .chat-input {
          width: 100%;
          padding: 12px;
          border: 1px solid #ccc;
          border-radius: 8px;
          margin-bottom: 12px;
        }
        .options button {
          background-color: #1e70ff;
          color: white;
          padding: 8px 12px;
          margin: 4px;
          border: none;
          border-radius: 20px;
          cursor: pointer;
        }
        .options button:hover {
          background-color: #155ed8;
        }
      `}</style>
    </div>
  );
}
