'use strict';

const QUESTIONS = [
  {
    id: 'purpose',
    text: 'What matters most to you right now?',
    sub: 'Pick everything that feels true — there\'s no wrong answer here.',
    multi: true,
    options: [
      { value: 'scam_protection', label: '🛡️ Keep me safe from scams and fraud' },
      { value: 'ai_assistant',   label: '🤝 Have someone to help me with everyday things' },
      { value: 'family',         label: '👨‍👩‍👧 Watch over my family too' },
      { value: 'business',       label: '💼 Protect my work and business' },
    ]
  },
  {
    id: 'occupation',
    text: 'Tell us a little about yourself — what do you do?',
    sub: 'This helps us speak your language and give advice that actually fits your life.',
    multi: false,
    options: [
      { value: 'construction',  label: '🔨 Construction / Trades' },
      { value: 'business',      label: '📊 Business / Office' },
      { value: 'retired',       label: '🌴 Retired' },
      { value: 'student',       label: '🎓 Student' },
      { value: 'healthcare',    label: '🏥 Healthcare' },
      { value: 'other',         label: '⚙️ Something else' },
    ]
  },
  {
    id: 'tech_level',
    text: 'How do you feel about technology?',
    sub: 'Totally honest — this just helps us explain things in a way that feels right for you.',
    multi: false,
    options: [
      { value: 'beginner',      label: '🌱 I prefer simple — just tell me what to do' },
      { value: 'comfortable',   label: '👍 I get by fine on my own' },
      { value: 'advanced',      label: '🚀 I love the details — bring it on' },
    ]
  },
  {
    id: 'biggest_worry',
    text: 'What do you most want us to watch out for?',
    sub: 'We\'ll keep a closer eye on anything you choose. You\'re not alone in this.',
    multi: true,
    options: [
      { value: 'fake_payments',  label: '💸 Fake payment requests (Venmo, Zelle, CashApp)' },
      { value: 'phishing',       label: '📧 Suspicious emails and texts' },
      { value: 'fake_websites',  label: '🌐 Websites trying to steal my card info' },
      { value: 'contractor_scam',label: '🔨 Contractor and job scams' },
      { value: 'romance_scam',   label: '❤️ Romance scams' },
      { value: 'all',            label: '⚠️ Honestly, all of it worries me' },
    ]
  },
  {
    id: 'social',
    text: 'Want to make HaloGuard truly yours?',
    sub: 'Connect an account and we\'ll learn your world — your job, your interests, your life — so every answer feels personal. Totally optional, always private.',
    multi: true,
    options: [
      { value: 'google',    label: '🔵 Connect Google' },
      { value: 'facebook',  label: '📘 Connect Facebook' },
      { value: 'linkedin',  label: '💼 Connect LinkedIn' },
      { value: 'skip',      label: '⏭️ Maybe later — just get me started' },
    ]
  }
];

let currentStep = 0;
let answers = {};
let selectedOptions = new Set();

function init() {
  const profile = localStorage.getItem('haloguard_profile');
  const apiKey  = localStorage.getItem('haloguard_api_key');

  if (profile && apiKey) {
    window.location.href = './dashboard.html';
    return;
  }

  setTimeout(() => {
    showScreen('screen-welcome');
  }, 2200);
}

function startOnboarding() {
  showScreen('screen-onboarding');
  renderStep(0);
}

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

function renderStep(index) {
  const q = QUESTIONS[index];
  selectedOptions = new Set(answers[q.id] || []);

  document.getElementById('question-text').textContent = q.text;
  document.getElementById('question-sub').textContent  = q.sub;
  document.getElementById('step-label').textContent    = `Step ${index + 1} of ${QUESTIONS.length}`;

  const fill = ((index) / QUESTIONS.length) * 100;
  document.getElementById('progress-fill').style.width = fill + '%';

  document.getElementById('btn-back').style.visibility = index === 0 ? 'hidden' : 'visible';

  const container = document.getElementById('options-container');
  container.innerHTML = '';

  q.options.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'option-btn' + (selectedOptions.has(opt.value) ? ' selected' : '');
    btn.textContent = opt.label;
    btn.onclick = () => toggleOption(opt.value, q.multi, btn);
    container.appendChild(btn);
  });

  updateNextBtn();
}

function toggleOption(value, multi, btn) {
  if (!multi) {
    selectedOptions.clear();
    document.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
  }

  if (value === 'skip') {
    selectedOptions.clear();
    document.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
    selectedOptions.add('skip');
    btn.classList.add('selected');
  } else if (selectedOptions.has(value)) {
    selectedOptions.delete(value);
    btn.classList.remove('selected');
  } else {
    selectedOptions.add(value);
    btn.classList.add('selected');
  }

  updateNextBtn();
}

function updateNextBtn() {
  const btn = document.getElementById('btn-next');
  const q   = QUESTIONS[currentStep];
  const isLastOptional = q.id === 'social';
  btn.disabled = !isLastOptional && selectedOptions.size === 0;
  btn.textContent = currentStep === QUESTIONS.length - 1 ? 'Finish' : 'Next';
}

function nextStep() {
  const q = QUESTIONS[currentStep];
  answers[q.id] = Array.from(selectedOptions);
  currentStep++;

  if (currentStep >= QUESTIONS.length) {
    localStorage.setItem('haloguard_profile', JSON.stringify(answers));
    showScreen('screen-settings');
    return;
  }

  renderStep(currentStep);
}

function prevStep() {
  if (currentStep > 0) {
    currentStep--;
    renderStep(currentStep);
  }
}

function saveApiKey() {
  const key = document.getElementById('api-key-input').value.trim();
  if (!key.startsWith('sk-ant-')) {
    alert('Please enter a valid Claude API key (starts with sk-ant-)');
    return;
  }
  localStorage.setItem('haloguard_api_key', key);
  window.location.href = './dashboard.html';
}

document.addEventListener('DOMContentLoaded', init);
