
import { useState } from 'react';
import sendTelegramBackup from '../utils/SendTelegramBackup';
import ChatUI from './ChatUI';

export default function ChatFlow() {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: "No forms, no waiting — I’ll give you a real price range right now. Where are you moving from?" }
  ]);
  const [userInput, setUserInput] = useState('');
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [buttonOptions, setButtonOptions] = useState([]);
  const [placeholder, setPlaceholder] = useState("City, State (e.g. Dallas, TX)");

  const handleUserInput = async (customInput = null) => {
    const input = customInput || userInput.trim();
    if (!input) return;

    setMessages(prev => [...prev, { sender: 'user', text: input }]);

    try {
      await sendTelegramBackup(input);
    } catch (err) {
      console.error('Telegram backup failed:', err);
    }

    setUserInput('');
    setButtonOptions([]);

    let newStep = step;
    const updatedFormData = { ...formData };

    switch (step) {
      case 1:
        updatedFormData.from = input;
        setMessages(prev => [...prev, { sender: 'bot', text: "Where to?" }]);
        setPlaceholder("City, State (e.g. Phoenix, AZ)");
        newStep++;
        break;
      case 2:
        updatedFormData.to = input;
        setMessages(prev => [...prev, { sender: 'bot', text: "What’s your move date?" }]);
        setPlaceholder("Move date (e.g. June 25)");
        newStep++;
        break;
      case 3:
        updatedFormData.date = input;
        setMessages(prev => [...prev, { sender: 'bot', text: "What matters most to you about this move?" }]);
        setPlaceholder("What matters most? (e.g. timing, fragile items)");
        newStep++;
        break;
      case 4:
        updatedFormData.priority = input;
        setMessages(prev => [...prev, { sender: 'bot', text: "What type of place are you moving from?" }]);
        setButtonOptions(["House", "Apartment", "Storage Unit", "Other"]);
        newStep++;
        break;
      case 5:
        updatedFormData.type = input;
        setMessages(prev => [...prev, { sender: 'bot', text: "And how many bedrooms?" }]);
        setButtonOptions(["1", "2", "3", "4+"]);
        newStep++;
        break;
      case 6:
        updatedFormData.size = input;
        setMessages(prev => [...prev, { sender: 'bot', text: "Do you want packing included in the estimate?" }]);
        setButtonOptions(["Yes", "I'll pack myself"]);
        newStep++;
        break;
      case 7:
        updatedFormData.packing = input;
        setMessages(prev => [...prev, { sender: 'bot', text: "Any fragile or high-value items?" }]);
        setPlaceholder("Special items (e.g. piano, art)");
        newStep++;
        break;
      case 8:
        updatedFormData.special = input;
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
        setMessages(prev => [...prev, { sender: 'bot', text: summary }]);
        setButtonOptions(["Run My Estimate"]);
        newStep++;
        break;
      case 9:
        try {
          const res = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              messages: messages.map(m => ({
                role: m.sender === 'bot' ? 'assistant' : 'user',
                content: m.text
              })),
              formData: updatedFormData
            })
          });
          const data = await res.json();
          updatedFormData.quote = data.reply;
          setMessages(prev => [...prev, { sender: 'bot', text: data.reply || "Here’s a rough estimate based on your info." }]);
        } catch (error) {
          setMessages(prev => [...prev, { sender: 'bot', text: "Sorry, something went wrong with the estimate." }]);
        }
        setButtonOptions(["Yes, Reserve My Move", "Email Me My Estimate"]);
        newStep++;
        break;
      case 10:
        updatedFormData.name = input;
        setMessages(prev => [...prev, { sender: 'bot', text: "Great — what’s your email?" }]);
        setPlaceholder("Email Address");
        newStep++;
        break;
      case 11:
        updatedFormData.email = input;

        try {
          await fetch('/api/send-telegram-alert', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: 'leadCaptured',
              stage: 'Email Collected',
              name: updatedFormData.name,
              email: updatedFormData.email,
              moveDate: updatedFormData.date,
              origin: updatedFormData.from,
              destination: updatedFormData.to,
              size: updatedFormData.size,
              specialItems: updatedFormData.special,
              quote: updatedFormData.quote
            })
          });
        } catch (err) {
          console.error("Early lead alert failed:", err);
        }

        setMessages(prev => [...prev, { sender: 'bot', text: "And your phone number?" }]);
        setPlaceholder("Phone Number");
        newStep++;
        break;
      case 12:
        updatedFormData.phone = input;
        setMessages(prev => [...prev, { sender: 'bot', text: "What’s the pickup address?" }]);
        setPlaceholder("Pickup Address");
        newStep++;
        break;
      case 13:
        updatedFormData.pickup = input;
        setMessages(prev => [...prev, { sender: 'bot', text: "And the delivery address? If you don’t have it yet, just say 'I don’t know.'" }]);
        setPlaceholder("Delivery Address or say 'I don’t know'");
        newStep++;
        break;
      case 14:
        await fetch('/api/send-telegram-alert', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'reservation',
            stage: 'Reservation Started',
            name: updatedFormData.name,
            email: updatedFormData.email,
            phone: updatedFormData.phone,
            moveDate: updatedFormData.date,
            origin: updatedFormData.from,
            destination: updatedFormData.to,
            size: updatedFormData.size,
            specialItems: updatedFormData.special,
            quote: updatedFormData.quote
          })
        });

        updatedFormData.dropoff = input;
        setMessages(prev => [
          ...prev,
          { sender: 'bot', text: "Perfect — you can pay your $85 deposit now to reserve your move:" },
          { sender: 'bot', text: "https://buy.stripe.com/eVqbJ23Px8yx4Ab2aUenS00" }
        ]);
        newStep++;
        break;
      case 15:
        updatedFormData.emailOnly = input;
        setMessages(prev => [...prev, { sender: 'bot', text: "Would you like me to text it to you too?" }]);
        setPlaceholder("Cell number (optional)");
        newStep++;
        break;
      case 16:
        await fetch('/api/send-telegram-alert', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'emailOnly',
            stage: 'Email Requested',
            name: updatedFormData.name,
            email: updatedFormData.emailOnly || updatedFormData.email,
            phone: updatedFormData.phoneOptional,
            moveDate: updatedFormData.date,
            origin: updatedFormData.from,
            destination: updatedFormData.to,
            size: updatedFormData.size,
            specialItems: updatedFormData.special,
            quote: updatedFormData.quote
          })
        });

        updatedFormData.phoneOptional = input;
        setMessages(prev => [...prev, { sender: 'bot', text: "Perfect — I’ll email your estimate shortly. If you ever need help, you can restart the chat anytime." }]);
        newStep++;
        break;
      default:
        if (step === 9) {
          setMessages(prev => [...prev, { sender: 'bot', text: "No problem — I’ll start the reservation process. What’s your full name?" }]);
          setPlaceholder("Full Name");
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
      handleUserInput={handleUserInput}
      userInput={userInput}
      setUserInput={setUserInput}
      placeholder={placeholder}
      buttonOptions={buttonOptions}
      onBackClick={() => window.history.back()}
    />
  );
}
