
const openerSteps = [
  {
    phase: 1,
    message: "Where are you moving from?",
    type: "text"
  },
  {
    phase: 2,
    message: "Where to?",
    type: "text"
  },
  {
    phase: 3,
    message: "What’s your move date? (e.g., Aug 13, 2025 — or just say 'ASAP' or 'within 30 days')",
    type: "text"
  },
  {
    phase: 4,
    message: "What matters most to you about this move?",
    type: "text"
  },
  {
    phase: 5,
    message: "What type of place are you moving from?",
    options: ["House", "Apartment", "Storage Unit", "Other"]
  },
  {
    phase: 6,
    message: "And what size roughly?",
    type: "text"
  },
  {
    phase: 7,
    message: "Any stairs, elevators, or long walks to the truck?",
    options: ["Stairs", "Elevator", "Long Walk", "Nope"]
  },
  {
    phase: 8,
    message: "What help do you need?",
    options: ["Load + Unload", "Include Packing", "Just Transport", "I’ll explain"]
  },
  {
    phase: 9,
    message: "Any fragile, heavy, or high-value items?",
    type: "text"
  }
];

export default openerSteps;
