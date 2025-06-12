
export default function ChatOpener(userInput, userData) {
  const cleanedInput = userInput.trim().toLowerCase();
  const updates = { ...userData };

  if (!updates.from) {
    updates.from = userInput;
    return {
      botReply: "Where to?",
      updatedUserData: updates,
      nextPhase: null
    };
  }

  if (!updates.to) {
    updates.to = userInput;
    return {
      botReply: "What type of place are you moving from?",
      updatedUserData: updates,
      nextPhase: null
    };
  }

  if (!updates.homeType) {
    updates.homeType = userInput;
    return {
      botReply: `Got it — we’ll calculate distance from ${updates.from} to ${updates.to} when we price your move. What’s your move date? (Type the date or say 'Not sure')`,
      updatedUserData: updates,
      nextPhase: null
    };
  }

  if (!updates.date) {
    updates.date = userInput;
    return {
      botReply: "Thanks — give me one sec to run your numbers…",
      updatedUserData: updates,
      nextPhase: "estimate"
    };
  }

  // fallback in case all fields are somehow filled
  return {
    botReply: "Thanks — let’s move on to the quote.",
    updatedUserData: updates,
    nextPhase: "estimate"
  };
}
