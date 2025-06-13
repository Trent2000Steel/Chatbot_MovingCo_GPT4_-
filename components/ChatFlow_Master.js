
// ChatFlow_Master.js

export default function getChatMessage(phase, memory = {}) {
  switch (phase) {
    case 1:
      return {
        message: String("No forms, no waiting — I’ll give you a real price range right now. Let’s start, where are you moving from? (City, State)"),
        field: "moveFrom",
      };
    case 2:
      return {
        message: String("Where to?"),
        field: "moveTo",
      };
    case 3:
      return {
        message: String("What’s your move date? (e.g., Aug 13, 2025 — or just say 'ASAP' or 'within 30 days')"),
        field: "moveDate",
      };
    case 4:
      return {
        message: String("What matters most to you about this move? (e.g. timing, price, fragile items, etc.)"),
        field: "priorities",
      };
    case 5:
      return {
        message: String("What type of place are you moving from? (e.g. house, apartment, storage unit, or other)"),
        field: "homeType",
      };
    case 6:
      return {
        message: String("And what size roughly?"),
        field: "size",
        options: ["1-bedroom", "2-bedroom", "3-bedroom", "4-bedroom+"],
      };
    case 7:
      return {
        message: String("Any stairs, elevators, or long walks to the truck?"),
        field: "stairs",
        options: ["Stairs", "Elevator", "Long Walk", "Nope"],
      };
    case 8:
      return {
        message: String("Do you want help with packing too?"),
        field: "packing",
        options: ["Yes, I need packing help", "No, just the move"],
      };
    case 9:
      return {
        message: String("Any fragile, heavy, or high-value items?"),
        field: "specialItems",
      };
    case 10:
      const { size, homeType, moveFrom, moveTo, moveDate } = memory;
      return {
        message: String(`Okay — I’ve got your ${size || "[size]"} ${homeType || "[type]"} move from ${moveFrom || "[origin]"} to ${moveTo || "[destination]"} on ${moveDate || "[date]"}.`),
        delay: true,
      };
    case 11:
      return {
        message: String("Let me run your quote real quick…"),
        delay: true,
      };
    case 12:
      return {
        message: String("Checking route availability, fuel rates, and mover options…"),
        delay: true,
      };
    case 13:
      return {
        message: String("Filtering movers with 4.5 stars or higher…"),
        delay: true,
      };
    case 14:
      return {
        message: String("Calculating your live quote…"),
        delay: true,
      };
    case 15:
      return {
        message: String("**Official Estimate:** Your price range is $2,400–$3,100 based on your move details. Rates are live and may change."),
        delay: true,
      };
    case 16:
      return {
        message: String("Would you like to reserve your move with an $85 deposit (100% refundable)?"),
        options: ["Yes, reserve my move", "I have more questions first"],
      };
    default:
      return {
        message: String("You’ve reached the end of the flow. What would you like to do next?"),
      };
  }
}
