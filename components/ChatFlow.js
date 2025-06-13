
import { useState } from 'react';

export default function ChatFlow() {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: "No forms, no waiting — I’ll give you a real price range right now. Where are you moving from?" }
  ]);
  const [input, setInput] = useState('');
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [buttonOptions, setButtonOptions] = useState([]);

  const getPlaceholder = () => {
    switch (step) {
      case 1:
      case 2:
        return "City, State (e.g. Dallas, TX)";
      case 3:
        return "Move date (e.g. July 12)";
      case 4:
        return "Timing, cost, fragile items…";
      case 8:
        return "Piano, safe, artwork, etc.";
      default:
        return "";
    }
  };

  const handleUserInput = (customInput = null) => {
    const userInput = customInput || input.trim();
    if (!userInput) return;

    const updatedMessages = [...messages, { sender: 'user', text: userInput }];
    let newBotMessage = '';
    let newStep = step;
    let updatedFormData = { ...formData };
    let options = [];

    switch (step) {
      case 1:
        updatedFormData.from = userInput;
        newBotMessage = "Where to?";
        newStep++;
        break;
      case 2:
        updatedFormData.to = userInput;
        newBotMessage = "What’s your move date?";
        newStep++;
        break;
      case 3:
        updatedFormData.date = userInput;
        newBotMessage = "What matters most to you about this move?";
        newStep++;
        break;
      case 4:
        updatedFormData.priority = userInput;
        newBotMessage = "What type of place are you moving from?";
        newStep++;
        options = ["House", "Apartment", "Storage Unit", "Other"];
        break;
      case 5:
        updatedFormData.placeType = userInput;
        newBotMessage = "And what size roughly?";
        newStep++;
        options = ["1-bedroom", "2-bedroom", "3-bedroom", "4+ bedrooms"];
        break;
      case 6:
        updatedFormData.size = userInput;
        newBotMessage = "Do you want help with packing?";
        newStep++;
        options = ["Yes", "I'll pack myself"];
        break;
      case 7:
        updatedFormData.packing = userInput;
        newBotMessage = "Any fragile, heavy, or high-value items?";
        newStep++;
        break;
      case 8:
        updatedFormData.special = userInput;
        newBotMessage = `Great, here's your move summary:

- From: ${updatedFormData.from}
- To: ${updatedFormData.to}
- Date: ${updatedFormData.date}
- Priority: ${updatedFormData.priority}
- Type: ${updatedFormData.placeType}, ${updatedFormData.size}
- Packing: ${updatedFormData.packing}
- Special items: ${updatedFormData.special}`;
        newStep++;
        options = ["Run My Estimate"];
        break;
      case 9:
        newBotMessage = "Checking mover availability…
Reviewing route data…
Matching top-rated crews…";
        newStep++;
        break;
      case 10:
        const quote = "$2,150–$2,500";
        newBotMessage = `Here’s your estimated price range: ${quote}

Rates are live and may change. Ready to lock in your date with an $85 deposit?`;
        newStep++;
        options = ["Yes, Reserve My Move", "I Have More Questions First"];
        break;
      default:
        newBotMessage = "Want to move forward or ask more questions?";
        options = ["Yes, Reserve My Move", "I Have More Questions First"];
    }

    setMessages([...updatedMessages, { sender: 'bot', text: newBotMessage }]);
    setStep(newStep);
    setInput('');
    setFormData(updatedFormData);
    setButtonOptions(options);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleUserInput();
  };

  return (
    <div style={{
      background: '#fffef8',
      padding: '24px',
      borderRadius: '16px',
      border: '2px solid #e4b200',
      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
      maxWidth: '800px',
      margin: '0 auto',
      fontFamily: 'Inter, sans-serif',
      fontSize: '18px'
    }}>
      {messages.map((msg, idx) => (
        <div key={idx} style={{
          textAlign: msg.sender === 'user' ? 'right' : 'left',
          margin: '12px 0'
        }}>
          <div style={{
            display: 'inline-block',
            backgroundColor: msg.sender === 'user' ? '#d0ebff' : '#f5f5f5',
            color: '#000',
            padding: '14px 18px',
            borderRadius: '16px',
            maxWidth: '75%',
            whiteSpace: 'pre-line',
            fontSize: '18px'
          }}>{msg.text}</div>
        </div>
      ))}

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '16px' }}>
        {buttonOptions.map((option, idx) => (
          <button key={idx} onClick={() => handleUserInput(option)} style={{
            padding: '12px 16px',
            fontSize: '16px',
            backgroundColor: '#1e70ff',
            color: 'white',
            border: 'none',
            borderRadius: '20px',
            cursor: 'pointer'
          }}>{option}</button>
        ))}
      </div>

      {buttonOptions.length === 0 && (
        <div style={{ display: 'flex', marginTop: '16px' }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={getPlaceholder()}
            style={{
              flex: 1,
              padding: '14px',
              fontSize: '18px',
              border: '1px solid #ccc',
              borderRadius: '8px'
            }}
          />
          <button
            onClick={() => handleUserInput()}
            style={{
              marginLeft: '8px',
              padding: '14px 18px',
              backgroundColor: '#1e70ff',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '18px',
              cursor: 'pointer'
            }}
          >
            Send
          </button>
        </div>
      )}
    </div>
  );
}
