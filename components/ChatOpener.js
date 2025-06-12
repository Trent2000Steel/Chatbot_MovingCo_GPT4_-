
export default function ChatOpener(userInput, userData) {
  const cleanedInput = userInput.trim();
  const updates = { ...userData };

  if (!updates.step) updates.step = 1;

  switch (updates.step) {
    case 1:
      updates.from = cleanedInput;
      updates.step++;
      return {
        botReply: "Where to?",
        updatedUserData: updates,
        nextOptions: null
      };

    case 2:
      updates.to = cleanedInput;
      updates.step++;
      return {
        botReply: "What’s your move date? (e.g., Aug 13, 2025 — or say 'ASAP' or 'within 30 days')",
        updatedUserData: updates,
        nextOptions: null
      };

    case 3:
      updates.date = cleanedInput;
      updates.step++;
      return {
        botReply: "What matters most to you about this move? (Timing, cost, fragile items…)",
        updatedUserData: updates,
        nextOptions: null
      };

    case 4:
      updates.priority = cleanedInput;
      updates.step++;
      return {
        botReply: "What type of place are you moving from?",
        updatedUserData: updates,
        nextOptions: ["House", "Apartment", "Storage Unit", "Other"]
      };

    case 5:
      updates.homeType = cleanedInput;
      updates.step++;
      return {
        botReply: "And what size roughly? (e.g., 2-bedroom)",
        updatedUserData: updates,
        nextOptions: null
      };

    case 6:
      updates.homeSize = cleanedInput;
      updates.step++;
      return {
        botReply: "Any stairs, elevators, or long walks to the truck?",
        updatedUserData: updates,
        nextOptions: ["Stairs", "Elevator", "Long Walk", "Nope"]
      };

    case 7:
      updates.access = cleanedInput;
      updates.step++;
      return {
        botReply: "What help do you need?",
        updatedUserData: updates,
        nextOptions: ["Load + Unload", "Include Packing", "Just Transport", "I’ll explain"]
      };

    case 8:
      updates.helpType = cleanedInput;
      updates.step++;
      return {
        botReply: "Any fragile, heavy, or high-value items?",
        updatedUserData: updates,
        nextOptions: null
      };

    case 9:
      updates.specialItems = cleanedInput;
      updates.step++;
      return {
        botReply: "Thanks — give me one sec to run your numbers…",
        updatedUserData: updates,
        nextPhase: "estimate"
      };

    default:
      return {
        botReply: "Got it — let's keep going.",
        updatedUserData: updates,
        nextPhase: "estimate"
      };
  }
}
