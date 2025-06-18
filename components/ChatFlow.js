
import { useState } from 'react';
import ChatUI from './ChatUI';

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
      case 10: return "Full Name";
      case 11: return "Email Address";
      case 12: return "Phone Number";
      case 13: return "Pickup Address";
      case 14: return "Delivery Address (or type 'I don’t know')";
      case 15: return "Your Email";
      case 16: return "Your Cell (optional)";
      default: return "";
    }
  };

  const sendBotMessage = (text, options = []) => {
    setMessages(prev => [...prev, { sender: 'bot', text, options }]);
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
        const summary = [
          "Thanks! Here's what I've got:",
          `- From: ${updatedFormData.from}`,
          `- To: ${updatedFormData.to}`,
          `- Date: ${updatedFormData.date}`,
          `- Place: ${updatedFormData.type} (${updatedFormData.size} bedrooms)`,
          `- Packing: ${updatedFormData.packing}`,
          `- Priority: ${updatedFormData.priority}`,
          `- Special: ${updatedFormData.special}`
        ].join("\n");
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
              messages: messages.map(m => ({
                role: m.sender === 'bot' ? 'assistant' : 'user',
                content: m.text
              })),
              userInput: userInput,
              formData: formData
            })
          });
          const data = await res.json();
          sendBotMessage(data.reply || "Based on your info, here's a rough estimate.");
        } catch (error) {
          sendBotMessage("Sorry, something went wrong with the estimate.");
        }
        setIsTyping(false);
        sendBotMessage("Would you like to reserve your move or get the estimate by email?", ["Yes, Reserve My Move", "Email Me My Estimate"]);
        newStep++;
        break;
      case 10:
      case 999:
        updatedFormData.name = userInput;
        sendBotMessage("Great — what’s your email?");
        newStep = 11;
        break;
      case 11:
        updatedFormData.email = userInput;
        sendBotMessage("And your phone number?");
        newStep++;
        break;
      case 12:
        updatedFormData.phone = userInput;
        sendBotMessage("What’s the pickup address?");
        newStep++;
        break;
      case 13:
        updatedFormData.pickup = userInput;
        sendBotMessage("And the delivery address? If you don’t have it yet, just say 'I don’t know.'");
        newStep++;
        break;
      case 14:
        updatedFormData.dropoff = userInput;
        sendBotMessage("Perfect — you can pay your $85 deposit now to reserve your move:");
        sendBotMessage("👉 [Pay Deposit Now](https://buy.stripe.com/eVqbJ23Px8yx4Ab2aUenS00)");
        newStep++;
        break;
      case 15:
        updatedFormData.emailOnly = userInput;
        sendBotMessage("Would you like me to text it to you too?");
        newStep++;
        break;
      case 16:
        updatedFormData.phoneOptional = userInput;
        sendBotMessage("Perfect — I’ll email your estimate shortly. If you ever need help, you can restart the chat anytime.");
        newStep++;
        break;
      default:
        if (step === 9) {
          sendBotMessage("No problem — I’ll start the reservation process. What’s your full name?");
          newStep = 10;
        }
        break;
    }

    setFormData(updatedFormData);
    setStep(newStep);
  };

  return (
    <ChatUI
      messages={messages}
      input={input}
      setInput={setInput}
      onSend={handleUserInput}
      isTyping={isTyping}
      buttonOptions={buttonOptions}
      getPlaceholder={getPlaceholder}
    />
  );
}
