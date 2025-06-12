
import { useState } from "react";

export default function useChatFlow() {
  const [messages, setMessages] = useState([
    {
      sender: "system",
      text: "No forms, no waiting—I'll give you a real price range right now!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    },
    {
      sender: "system",
      text: "Where are you moving from?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [step, setStep] = useState(0);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [userInfo, setUserInfo] = useState({
    origin: "",
    destination: "",
    size: "",
    date: "",
    help: "",
    specialItems: "",
    perfectMove: "",
    name: "",
    email: "",
    phone: "",
    pickup: "",
    delivery: ""
  });

  const handleUserInput = (value) => {
    if (!value) return;
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMessages = [...messages, { sender: "user", text: value, timestamp: time }];
    setMessages(newMessages);
    setIsThinking(true);
    setInput("");

    setTimeout(() => {
      const nextStep = step + 1;
      let newPrompt = "";
      const updatedInfo = { ...userInfo };
      const sysMsg = (text, options = null) => ({ sender: "system", text, options, timestamp: time });

      switch (step) {
        case 0:
          updatedInfo.origin = value;
          newPrompt = "Where are you moving to?";
          break;
        case 1:
          updatedInfo.destination = value;
          newPrompt = "How many bedrooms?";
          break;
        case 2:
          updatedInfo.size = value;
          newPrompt = "What day are you planning to move?";
          break;
        case 3:
          updatedInfo.date = value;
          newPrompt = "Do you need help loading, unloading, or both?";
          break;
        case 4:
          updatedInfo.help = value;
          newPrompt = "Any special or fragile items we should know about?";
          break;
        case 5:
          updatedInfo.specialItems = value;
          newPrompt = "How would it look if everything went perfectly with this move?";
          break;
        case 6:
          updatedInfo.perfectMove = value;
          setMessages([
            ...newMessages,
            sysMsg(`Got it! Here's what I have so far:
- Move Size: ${updatedInfo.size}
- From: ${updatedInfo.origin}
- To: ${updatedInfo.destination}
- Date: ${updatedInfo.date}
- Help Needed: ${updatedInfo.help}
- Special Items: ${updatedInfo.specialItems}`),
            sysMsg("Preparing your quote…"),
            sysMsg("Checking route availability and fuel trends…"),
            sysMsg("Filtering for 4.5-star movers with special equipment…"),
            sysMsg("Your price range: $2,200–$2,800 flat.\nRates may change soon — this is a live quote."),
            sysMsg("Here's how it works: You pay a refundable $85 deposit to reserve your spot. Then upload room photos and we finalize your flat rate. Your MoveSafe Coordinator will call you within 48 hours."),
            sysMsg("Would you like to reserve your move now?", ["Yes, Reserve My Move", "I Have More Questions First"])
          ]);
          setUserInfo(updatedInfo);
          setStep(nextStep);
          setIsThinking(false);
          return;
        case 7:
          if (value === "I Have More Questions First") {
            setMessages([...newMessages, sysMsg("Of course — ask me anything! Just keep in mind, prices are live and could change soon.")]);
            setIsThinking(false);
            return;
          }
          newPrompt = "Great! Let's get your info. What's your full name?";
          break;
        case 8:
          updatedInfo.name = value;
          newPrompt = "What's your email address?";
          break;
        case 9:
          updatedInfo.email = value;
          newPrompt = "What's the best phone number to reach you?";
          break;
        case 10:
          updatedInfo.phone = value;
          newPrompt = "Pickup address?";
          break;
        case 11:
          updatedInfo.pickup = value;
          newPrompt = "Delivery address?";
          break;
        case 12:
          updatedInfo.delivery = value;
          setMessages([
            ...newMessages,
            sysMsg("Awesome — last step! Use the link below to pay your $85 deposit and lock in your MoveSafe Call:"),
            sysMsg("👉 [Pay Now](https://buy.stripe.com/test_9AQdTvdY46QZ62A3cc)")
          ]);
          setUserInfo(updatedInfo);
          setIsThinking(false);
          return;
        default:
          break;
      }

      setUserInfo(updatedInfo);
      setMessages([...newMessages, sysMsg(newPrompt)]);
      setStep(nextStep);
      setIsThinking(false);
    }, 900);
  };

  return {
    messages,
    input,
    options: messages[messages.length - 1]?.options || [],
    isThinking,
    handleUserInput,
    handleInputChange: (e) => setInput(e.target.value)
  };
}
