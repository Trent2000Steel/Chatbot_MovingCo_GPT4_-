
const chatFlow = [
  {
    id: "opening",
    type: "auto",
    message: "No forms, no waiting — I’ll give you a real price range right now.",
    next: "fromLocation"
  },
  {
    id: "fromLocation",
    type: "text",
    message: "Where are you moving from?",
    placeholder: "City, State (e.g. Dallas, TX)",
    next: "toLocation"
  },
  {
    id: "toLocation",
    type: "text",
    message: "Where to?",
    placeholder: "City, State (e.g. Phoenix, AZ)",
    next: "moveDate"
  },
  {
    id: "moveDate",
    type: "text",
    message: "What’s your move date?",
    placeholder: "MM/DD/YYYY or say 'not sure yet'",
    next: "priority"
  },
  {
    id: "priority",
    type: "text",
    message: "What matters most to you about this move?",
    placeholder: "Timing, cost, fragile items...",
    next: "propertyType"
  },
  {
    id: "propertyType",
    type: "buttons",
    message: "What type of place are you moving from?",
    options: ["House", "Apartment", "Storage Unit", "Other"],
    next: "propertySize"
  },
  {
    id: "propertySize",
    type: "text",
    message: "And what size roughly?",
    placeholder: "e.g. 2-bedroom, studio with patio...",
    next: "access"
  },
  {
    id: "access",
    type: "buttons",
    message: "Any stairs, elevators, or long walks to the truck?",
    options: ["Stairs", "Elevator", "Long Walk", "Nope"],
    next: "helpLevel"
  },
  {
    id: "helpLevel",
    type: "buttons",
    message: "What help do you need?",
    options: ["Load + Unload", "Include Packing", "Just Transport", "I'll explain"],
    next: "specialItems"
  },
  {
    id: "specialItems",
    type: "text",
    message: "Any fragile, heavy, or high-value items?",
    placeholder: "TV, piano, safe, glass table, etc.",
    next: "recapTrust"
  },
  {
    id: "recapTrust",
    type: "recap",
    message: "Let’s recap your move before I run the estimate...",
    next: "runEstimateButton"
  },
  {
    id: "runEstimateButton",
    type: "buttons",
    message: "Everything look right?",
    options: ["Run My Estimate"],
    next: "trustBuild1"
  },
  {
    id: "trustBuild1",
    type: "auto",
    message: "Checking mover availability for your route...",
    delay: 1000,
    next: "trustBuild2"
  },
  {
    id: "trustBuild2",
    type: "auto",
    message: "Reviewing recent fuel pricing and mileage data...",
    delay: 1200,
    next: "trustBuild3"
  },
  {
    id: "trustBuild3",
    type: "auto",
    message: "Filtering for top-rated crews (4.5 stars or higher)...",
    delay: 1200,
    next: "finalQuote"
  },
  {
    id: "finalQuote",
    type: "quote",
    message: "Here’s your price range for the move.",
    next: "quoteCTA"
  },
  {
    id: "quoteCTA",
    type: "buttons",
    message: "Would you like to reserve your move?",
    options: ["Yes, Reserve My Move", "I Have More Questions First"],
    next: {
      "Yes, Reserve My Move": "collectInfoStart",
      "I Have More Questions First": "fallbackGPT1"
    }
  },
  {
    id: "fallbackGPT1",
    type: "gpt",
    message: "Of course—ask me anything and I’ll help however I can.",
    next: "fallbackGPT2"
  },
  {
    id: "fallbackGPT2",
    type: "gpt",
    message: "Still here with you—what else would you like to know?",
    next: "finalFallback"
  },
  {
    id: "finalFallback",
    type: "buttons",
    message: "When you’re ready, I can still help you reserve your move or email you a summary.",
    options: ["Reserve My Move", "Email Me My Estimate"],
    next: null
  },
  {
    id: "collectInfoStart",
    type: "text",
    message: "Great! What’s your full name?",
    next: "collectEmail"
  },
  {
    id: "collectEmail",
    type: "text",
    message: "And your email address?",
    next: "collectPhone"
  },
  {
    id: "collectPhone",
    type: "text",
    message: "Phone number, just in case we need to reach you?",
    next: "pickupAddress"
  },
  {
    id: "pickupAddress",
    type: "text",
    message: "What’s the full pickup address?",
    next: "deliveryAddress"
  },
  {
    id: "deliveryAddress",
    type: "text",
    message: "What’s the full delivery address?",
    next: "showStripe"
  },
  {
    id: "showStripe",
    type: "payment",
    message: "Thanks! Tap below to reserve your move with an $85 refundable deposit.",
    next: null
  }
];

export default chatFlow;
