
import { useState, useEffect, useRef } from 'react';

export default function ChatFlow() {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: "No forms, no waiting — I’ll give you a real price range right now. Where are you moving from?" }
  ]);
  const [input, setInput] = useState('');
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleUserInput = async () => {
    if (!input.trim()) return;

    const updatedMessages = [...messages, { sender: 'user', text: input }];
    setMessages(updatedMessages);

    let newBotMessage = '';
    let newStep = step;
    let updatedFormData = { ...formData };

    switch (step) {
      case 1:
        updatedFormData.from = input;
        newBotMessage = "Where to?";
        newStep++;
        break;
      case 2:
        updatedFormData.to = input;
        newBotMessage = "What’s your move date?";
        newStep++;
        break;
      case 3:
        updatedFormData.date = input;
        newBotMessage = "What matters most to you about this move? (e.g., timing, cost, fragile items…)";
        newStep++;
        break;
      case 4:
        updatedFormData.priority = input;
        newBotMessage = "What type of place are you moving from? (e.g., apartment, house, storage)";
        newStep++;
        break;
      case 5:
        updatedFormData.placeType = input;
        newBotMessage = "And what size roughly? (e.g., 2-bedroom)";
        newStep++;
        break;
      case 6:
        updatedFormData.size = input;
        newBotMessage = "Any stairs, elevators, or long walks to the truck?";
        newStep++;
        break;
      case 7:
        updatedFormData.access = input;
        newBotMessage = "What help do you need? (e.g., Load + Unload, Just Transport, Include Packing)";
        newStep++;
        break;
      case 8:
        updatedFormData.help = input;
        newBotMessage = "Any fragile, heavy, or high-value items?";
        newStep++;
        break;
      case 9:
        updatedFormData.special = input;
        newBotMessage = `Okay! Here’s what I’ve got so far:\n\n- From: ${updatedFormData.from}\n- To: ${updatedFormData.to}\n- Move Date: ${updatedFormData.date}\n- Priority: ${updatedFormData.priority}\n- Type: ${updatedFormData.placeType}, ${updatedFormData.size}\n- Access: ${updatedFormData.access}\n- Help Needed: ${updatedFormData.help}\n- Special Items: ${updatedFormData.special}\n\nPreparing your quote...`;
        newStep++;
        break;
      case 10:
        // Simulate quote from backend
        const quote = "$2,150–$2,500";
        newBotMessage = `Here’s your estimated price range: **${quote}**\n\nThis is a live rate and may change — ready to lock it in with an $85 deposit?`;
        newStep++;
        break;
      default:
        newBotMessage = "Would you like to reserve your move now, or ask more questions?";
    }

    setMessages([...updatedMessages, { sender: 'bot', text: newBotMessage }]);
    setStep(newStep);
    setInput('');
    setFormData(updatedFormData);
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
      fontFamily: 'Inter, sans-serif'
    }}>
      {messages.map((msg, idx) => (
        <div
          key={idx}
          style={{
            textAlign: msg.sender === 'user' ? 'right' : 'left',
            margin: '12px 0'
          }}
        >
          <div style={{
            display: 'inline-block',
            backgroundColor: msg.sender === 'user' ? '#d0ebff' : '#f5f5f5',
            color: '#000',
            padding: '12px 16px',
            borderRadius: '16px',
            maxWidth: '75%',
            whiteSpace: 'pre-line'
          }}>
            {msg.text}
          </div>
        </div>
      ))}

      <div style={{ display: 'flex', marginTop: '16px' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your answer..."
          style={{
            flex: 1,
            padding: '12px',
            border: '1px solid #ccc',
            borderRadius: '8px'
          }}
        />
        <button
          onClick={handleUserInput}
          style={{
            marginLeft: '8px',
            padding: '12px 16px',
            backgroundColor: '#1e70ff',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          Send
        </button>
      </div>
      <div ref={chatEndRef} />
    </div>
  );
}
