// chatSteps.js
export default function getChatMessage(phase, memory) {
  switch (phase) {
    case 1:
      return { message: "Where are you moving from?", field: "origin" };
    case 2:
      return { message: "Where to?", field: "destination" };
    case 3:
      return {
        message: "What's your move date?",
        field: "moveDate",
        options: ["Within 7 days", "Within 30 days", "Not sure yet"]
      };
    case 4:
      return { message: "What matters most to you about this move?", field: "priority" };
    case 5:
      return {
        message: "What type of place are you moving from?",
        field: "placeType",
        options: ["House", "Apartment", "Storage Unit", "Other"]
      };
    case 6:
      return { message: "And what size roughly?", field: "placeSize" };
    case 7:
      return {
        message: "Any stairs, elevators, or long walks to the truck?",
        field: "obstacles",
        options: ["Stairs", "Elevator", "Long Walk", "Nope"]
      };
    case 8:
      return {
        message: "What help do you need?",
        field: "helpType",
        options: ["Load + Unload", "Include Packing", "Just Transport", "I’ll explain"]
      };
    case 9:
      return { message: "Any fragile, heavy, or high-value items?", field: "specialItems" };
    default:
      return { message: "Thanks! Quoting your move now...", field: null };
  }
}
