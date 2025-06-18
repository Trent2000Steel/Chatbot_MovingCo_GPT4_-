
import { useState } from 'react';
import ChatUI from './ChatUI'; // NEW: import your separate UI component

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
      case 8:
        updatedFormData.special = userInput;
        sendBotMessage("Got everything I need. Click ‘Run My Estimate’ to see your price — it might take a few seconds while we check live rates.", ["Run My Estimate"]);
        setFormData(updatedFormData);
        newStep++;
        break;
        break;
      case 2:
        updatedFormData.to = userInput;
        sendBotMessage("What’s your move date?");
        newStep++;
        break;
      case 3:
        updatedFormData.moveDate = userInput;
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
        sendBotMessage("Got everything I need. Click ‘Run My Estimate’ to see your price — it might take a few seconds while we check live rates.", ["Run My Estimate"]);
        setFormData(updatedFormData);
        newStep++;
        break;
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
        setButtonOptions(["Yes, Reserve My Move", "I Have More Questions First"]);
        newStep++;
        break;
      
      case 10:
        updatedFormData.name = userInput;
        sendBotMessage("And your best email?");
        newStep++;
        break;
      case 11:
        updatedFormData.email = userInput;
        sendBotMessage("Mobile number for text updates.");
        newStep++;
        break;
      case 12:
        updatedFormData.phone = userInput;
        sendBotMessage("What’s your pickup address?");
        newStep++;
        break;
      case 13:
        updatedFormData.pickupAddress = userInput;
        sendBotMessage("And what’s the delivery address?", []);
        newStep++;
        break;
      case 14:
        updatedFormData.deliveryAddress = userInput;
        sendBotMessage("Perfect. Ready to lock it in?", ["Secure Payment"]);
        newStep++;
        break;
      case 15:
        if (userInput === "Secure Payment") {
          window.location.href = "https://buy.stripe.com/eVqbJ23Px8yx4Ab2aUenS00";
          return;
        }
        break;
      case 100:
        updatedFormData.email = userInput;
        sendBotMessage("Mobile number for text updates (optional).");
        newStep++;
        break;
      case 101:
        updatedFormData.phone = userInput;
        sendBotMessage("Got it. I’ll send your estimate over shortly.");
        // Optional: Trigger Telegram webhook here
        break;

      default:
        break;
    }

    setFormData(updatedFormData);
    setStep(newStep);
  };

  // ✅ NEW: clean handoff to ChatUI component
  return (
    <ChatUI
      messages={messages}
      input={input}
      setInput={setInput}
      onSend={handleUserInput}
      isTyping={isTyping}
      buttonOptions={buttonOptions}
    />
  );
}
