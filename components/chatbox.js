
import React, { useState, useEffect, useRef } from "react";

export default function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [step, setStep] = useState(0);
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
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    setMessages([
      {
        sender: "system",
        text: "No forms, no waiting—I’ll give you a real price range right now!"
      },
      {
        sender: "system",
        text: "Where are you moving from?"
      }
    ]);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleUserInput = (value) => {
    if (!value) return;
    const newMessages = [...messages, { sender: "user", text: value }];
    setMessages(newMessages);
    setIsThinking(true);
    setInput("");

    setTimeout(() => {
      const nextStep = step + 1;
      let newPrompt = "";
      const updatedInfo = { ...userInfo };

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
          const recap = [
            {
              sender: "system",
              text: `Got it! Here’s what I have so far:
- Move Size: ${updatedInfo.size}
- From: ${updatedInfo.origin}
- To: ${updatedInfo.destination}
- Date: ${updatedInfo.date}
- Help Needed: ${updatedInfo.help}
- Special Items: ${updatedInfo.specialItems}`
            },
            { sender: "system", text: "Preparing your quote…" },
            { sender: "system", text: "Checking route availability and fuel trends…" },
            { sender: "system", text: "Filtering for 4.5-star movers with special equipment…" },
            { sender: "system", text: "Your price range: $2,200–$2,800 flat.
Rates may change soon — this is a live quote." },
            {
              sender: "system",
              text: "Here’s how it works: You pay a refundable $85 deposit to reserve your spot. Then upload room photos and we finalize your flat rate. Your MoveSafe Coordinator will call you within 48 hours."
            },
            {
              sender: "system",
              text: "Would you like to reserve your move now?",
              options: ["Yes, Reserve My Move", "I Have More Questions First"]
            }
          ];
          setUserInfo(updatedInfo);
          setMessages([...newMessages, ...recap]);
          setStep(nextStep);
          setIsThinking(false);
          return;
        case 7:
          if (value === "I Have More Questions First") {
            const helpful = {
              sender: "system",
              text: "Of course — ask me anything! Just keep in mind, prices are live and could change soon."
            };
            setMessages([...newMessages, helpful]);
            setIsThinking(false);
            return;
          }
          newPrompt = "Great! Let’s get your info. What’s your full name?";
          break;
        case 8:
          updatedInfo.name = value;
          newPrompt = "What’s your email address?";
          break;
        case 9:
          updatedInfo.email = value;
          newPrompt = "What’s the best phone number to reach you?";
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
            {
              sender: "system",
              text: "Awesome — last step! Use the link below to pay your $85 deposit and lock in your MoveSafe Call:"
            },
            {
              sender: "system",
              text: "👉 [Pay Now](https://buy.stripe.com/test_9AQdTvdY46QZ62A3cc)"
            }
          ]);
          setUserInfo(updatedInfo);
          setIsThinking(false);
          return;
        default:
          break;
      }

      setUserInfo(updatedInfo);
      setMessages([...newMessages, { sender: "system", text: newPrompt }]);
      setStep(nextStep);
      setIsThinking(false);
    }, 900);
  };

  const lastOptions = messages[messages.length - 1]?.options || [];

  return (
    <div style={{ fontFamily: "Arial, sans-serif" }}>
      <div style={{ maxHeight: "400px", overflowY: "auto", padding: "10px" }}>
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              marginBottom: "12px",
              textAlign: msg.sender === "user" ? "right" : "left"
            }}
          >
            <div
              style={{
                display: "inline-block",
                padding: "10px 14px",
                borderRadius: "16px",
                backgroundColor: msg.sender === "user" ? "#DCF8C6" : "#f1f0f0",
                color: "#333",
                maxWidth: "80%",
                fontSize: "14px",
                whiteSpace: "pre-wrap"
              }}
            >
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {isThinking && <div style={{ fontStyle: "italic", padding: "8px" }}>...</div>}

      <div style={{ marginTop: "10px" }}>
        {lastOptions.length > 0 && (
          <div style={{ marginBottom: "10px" }}>
            {lastOptions.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleUserInput(option)}
                style={{
                  marginRight: "8px",
                  marginBottom: "8px",
                  padding: "8px 14px",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                  backgroundColor: "#fff",
                  cursor: "pointer"
                }}
              >
                {option}
              </button>
            ))}
          </div>
        )}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleUserInput(input)}
          placeholder="Type your answer..."
          style={{
            width: "calc(100% - 100px)",
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            fontSize: "14px"
          }}
        />
        <button
          onClick={() => handleUserInput(input)}
          style={{
            padding: "10px 16px",
            marginLeft: "8px",
            borderRadius: "8px",
            backgroundColor: "#1e70ff",
            color: "#fff",
            border: "none",
            cursor: "pointer"
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}
