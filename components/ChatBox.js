
import React, { useState } from "react";
import ChatUI from "./ChatUI";
import ChatOpener from "./ChatOpener";
import EstimateFlow from "./EstimateFlow";
import ChatFlow_Closing from "./ChatFlow_Closing";

const ChatBox = () => {
  const [stage, setStage] = useState("opener");
  const [moveDetails, setMoveDetails] = useState(null);

  const handleOpenerComplete = (details) => {
    setMoveDetails(details);
    setStage("estimate");
  };

  const handleEstimateComplete = () => {
    setStage("closing");
  };

  return (
    <ChatUI>
      {stage === "opener" && <ChatOpener onComplete={handleOpenerComplete} />}
      {stage === "estimate" && (
        <EstimateFlow moveDetails={moveDetails} onComplete={handleEstimateComplete} />
      )}
      {stage === "closing" && <ChatFlow_Closing moveDetails={moveDetails} />}
    </ChatUI>
  );
};

export default ChatBox;
