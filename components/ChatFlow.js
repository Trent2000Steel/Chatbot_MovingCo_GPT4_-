
import { useState, useEffect } from 'react';

export default function useChatFlow() {
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
        sendBotMessage("Any fragile or high-value items?", []);
        newStep++;
        break;
      case 8:
        updatedFormData.special = userInput;
        sendBotMessage(`Thanks! Here's what I’ve got:
• From: ${updatedFormData.from}
• To: ${updatedFormData.to}
• Date: ${updatedFormData.date}
• Place: ${updatedFormData.type} (${updatedFormData.size} bedrooms)
• Packing: ${updatedFormData.packing}
• Priority: ${updatedFormData.priority}
• Special: ${updatedFormData.special}`, ["Run My Estimate"]);
        newStep++;
        break;
      case 9:
        // Show typing dots then estimate
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          sendBotMessage("Based on everything you shared, your estimated range is **$2,200–$3,100**.

This is a live rate and may change, so let’s lock it in while it’s still active.");
          setButtonOptions(["Yes, Reserve My Move", "I Have More Questions First"]);
        }, 2000);
        newStep++;
        break;
      default:
        break;
    }

    setFormData(updatedFormData);
    setStep(newStep);
  };

  return {
    messages,
    input,
    setInput,
    handleUserInput,
    buttonOptions,
    getPlaceholder,
    isTyping
  };
}
