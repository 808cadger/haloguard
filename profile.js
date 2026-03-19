'use strict';

const OCCUPATION_LABELS = {
  construction: 'construction and trades professional',
  business:     'business professional',
  retired:      'retiree',
  student:      'student',
  healthcare:   'healthcare worker',
  other:        'professional'
};

const TECH_LABELS = {
  beginner:    'Keep all explanations simple — avoid technical jargon.',
  comfortable: 'Use plain language. Some tech terms are fine.',
  advanced:    'You can use technical details when helpful.'
};

function getProfile() {
  const raw = localStorage.getItem('haloguard_profile');
  return raw ? JSON.parse(raw) : null;
}

function buildSystemPrompt(profile) {
  if (!profile) {
    return `You are HaloGuard, a personal AI assistant and fraud protection guardian.
You help with anything the user asks — resumes, recipes, directions, scam checks, contracts, and more.
Always be friendly, clear, and helpful. Flag anything that looks like a scam immediately.`;
  }

  const occupation  = OCCUPATION_LABELS[profile.occupation?.[0]] || 'professional';
  const techStyle   = TECH_LABELS[profile.tech_level?.[0]]        || TECH_LABELS.comfortable;
  const purposes    = profile.purpose  || [];
  const worries     = profile.biggest_worry || [];

  const wantProtection = purposes.includes('scam_protection') || purposes.includes('family') || purposes.includes('business');
  const wantAssistant  = purposes.includes('ai_assistant');

  let prompt = `You are HaloGuard, a personal AI bodyguard and assistant.

USER PROFILE:
- Occupation: ${occupation}
- Tech comfort: ${techStyle}
- Why they use HaloGuard: ${purposes.join(', ')}
- Top scam concerns: ${worries.join(', ')}

YOUR JOB:
1. Help with ANYTHING — resumes, recipes, directions, contracts, explanations, estimates, general questions.
2. ALWAYS watch for scams. If the user pastes a message, link, or payment request, analyze it for fraud signals immediately.
3. Personalize every answer to their occupation and background.

FRAUD DETECTION RULES:
- Flag urgency pressure ("act now", "limited time", "you'll lose money")
- Flag requests for gift cards, wire transfers, crypto as payment
- Flag mismatched URLs (paypa1.com vs paypal.com)
- Flag unknown senders asking for personal info
- Flag "too good to be true" offers
- When fraud is detected, start your response with: FRAUD_ALERT: followed by a brief reason.

STYLE:
- ${techStyle}
- Be warm, direct, and practical.
- If the user is a construction professional, relate answers to their world when relevant.
`;

  return prompt;
}

function getGreeting(profile) {
  const hour = new Date().getHours();
  const time = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  if (!profile) return { main: `${time}!`, sub: 'I\'m here whenever you need me. Ask me anything.' };

  const occupation = OCCUPATION_LABELS[profile.occupation?.[0]] || '';
  const sub = occupation
    ? `Your halo is on. I\'ve got your back today.`
    : `Your halo is on. I\'m here whenever you need me.`;

  return { main: `${time}!`, sub };
}
