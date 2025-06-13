
import React, { useState, useEffect } from "react";

const ChatFlow = ({ sendBotMessage, setButtonOptions, setIsTyping }) => {
  const [step, setStep] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});

  useEffect(() => {
    runChatStep(step);
  }, [step]);

  const handleUserInput = (input) => {
    const newAnswers = { ...userAnswers, [step]: input };
    setUserAnswers(newAnswers);
    setStep((prev) => prev + 1);
  };

  const runChatStep = (currentStep) => {
    let newBotMessage = "";
    let options = null;
    let placeholder = "";

    switch (currentStep) {
      case 0:
        newBotMessage = "No forms, no waiting — I’ll give you a real price range right now.";
        break;
      case 1:
        newBotMessage = "Where are you moving from?";
        placeholder = "City, State (e.g. Dallas, TX)";
        break;
      case 2:
        newBotMessage = "Where to?";
        placeholder = "City, State (e.g. Phoenix, AZ)";
        break;
      case 3:
        newBotMessage = "What’s your move date?";
        options = ["Within 7 days", "Within 30 days", "Not sure yet"];
        break;
      case 4:
        newBotMessage = "What matters most to you about this move?";
        placeholder = "Timing, cost, fragile items…";
        break;
      case 5:
        newBotMessage = "What type of place are you moving from?";
        options = ["House", "Apartment", "Storage Unit", "Other"];
        break;
      case 6:
        newBotMessage = "Roughly what size?";
        options = ["1 Bedroom", "2 Bedroom", "3 Bedroom", "4+ Bedroom"];
        break;
      case 7:
        newBotMessage = "Any stairs, elevators, or long walks?";
        options = ["Stairs", "Elevator", "Long Walk", "Nope"];
        break;
      case 8:
        newBotMessage = "Would you like us to include packing?";
        options = ["Yes, include packing", "No, I’ll pack myself"];
        break;
      case 9:
        newBotMessage = `Got it! Here's what I have so far:

• Moving from: ${userAnswers[1]}
• Moving to: ${userAnswers[2]}
• Date: ${userAnswers[3]}
• Home: ${userAnswers[5]} – ${userAnswers[6]}
• Access: ${userAnswers[7]}
• Packing: ${userAnswers[8]}

Sound good?`;
        options = ["Run My Estimate"];
        break;
      case 10:
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          sendBotMessage("Checking mover availability...");
          setTimeout(() => {
            sendBotMessage("Reviewing recent route data...");
            setTimeout(() => {
              sendBotMessage("Matching top-rated crews...");
              setTimeout(() => {
                setIsTyping(true);
                setTimeout(() => {
                  setIsTyping(false);
                  sendBotMessage(
                    "**Estimated Range:** $2,200 – $3,100

Based on what you shared, this is a live rate and may change. Let’s lock it in while it’s still active."
                  );
                  setButtonOptions(["Yes, Reserve My Move", "I Have More Questions First"]);
                }, 2000);
              }, 1000);
            }, 1000);
          }, 1000);
        }, 500);
        break;
      default:
        newBotMessage = "Thanks! Let’s continue.";
        break;
    }

    if (newBotMessage) {
      sendBotMessage(newBotMessage, options, placeholder);
    }
  };

  return null;
};

export default ChatFlow;
