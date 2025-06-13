import chatSteps from './Chatsteps';

export default async function ChatFlow(userInput, state = {}) {
  const currentStep = state.step || 0;
  const responses = [];

  // Step logic: use static steps first
  if (currentStep < chatSteps.length) {
    const step = chatSteps[currentStep];
    responses.push({
      text: step.text,
      options: step.options || [],
      placeholder: step.placeholder || "",
    });

    return {
      responses,
      state: { ...state, step: currentStep + 1 },
    };
  }

  // After all steps, trust recap
  if (currentStep === chatSteps.length) {
    const summary = `Great! Just to recap, you're moving from ${state.from || '[From]'} to ${state.to || '[To]'} on ${state.date || '[Date]'}.
Type: ${state.size || '[Size]'} home.`;
    responses.push({
      text: summary + "\n\nReady to get your estimate?",
      options: ['Yes, Run My Estimate'],
    });

    return {
      responses,
      state: { ...state, step: currentStep + 1 }
    };
  }

  // Trust-building delay sequence
  if (currentStep === chatSteps.length + 1) {
    responses.push({ text: "Checking mover availability...", delay: 1000 });
    responses.push({ text: "Reviewing recent route data...", delay: 1000 });
    responses.push({ text: "Scanning for top-rated teams near you…", delay: 1000 });

    return {
      responses,
      state: { ...state, step: currentStep + 1 }
    };
  }

  // Official Estimate (simulate GPT response)
  if (currentStep === chatSteps.length + 2) {
    const priceRange = "$2,300 – $3,100";
    const reason = state.importance || "timing and trust";
    const items = state.special || "TV, fragile boxes";

    const estimateText = `✅ Based on your move, your estimated flat rate is: **${priceRange}**

We factored in what matters to you most (${reason}) and made sure teams can handle your special items (${items}).

📦 This is a live quote and may change if you wait too long.

Want to lock it in?`;

    responses.push({
      text: estimateText,
      options: ['Yes, Reserve My Move', 'I Have More Questions First'],
    });

    return {
      responses,
      state: { ...state, step: currentStep + 1 }
    };
  }

  // Fallback responses if user has questions
  if (currentStep === chatSteps.length + 3 && !state.fallbackCount) {
    responses.push({
      text: "Of course—ask me anything. I’m here to help, no pressure at all.",
    });

    return {
      responses,
      state: { ...state, fallbackCount: 1 },
    };
  }

  if (currentStep === chatSteps.length + 3 && state.fallbackCount === 1) {
    responses.push({
      text: "Just keep in mind, rates are based on current fuel and driver availability. Let me know when you're ready.",
      options: ['Reserve My Move', 'Email Me My Estimate'],
    });

    return {
      responses,
      state: { ...state, fallbackCount: 2 },
    };
  }

  // End of flow
  responses.push({ text: "Let me know what you'd like to do next!" });
  return { responses, state };
}