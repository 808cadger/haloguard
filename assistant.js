'use strict';

const CLAUDE_API = 'https://api.anthropic.com/v1/messages';
const MODEL      = 'claude-sonnet-4-6';

let chatHistory = [];
let isThinking  = false;

function init() {
  const apiKey = localStorage.getItem('haloguard_api_key');
  if (!apiKey) {
    window.location.href = './index.html';
    return;
  }

  const profile  = getProfile();
  const greeting = getGreeting(profile);
  document.getElementById('greeting-text').textContent = greeting.main;
  document.getElementById('greeting-sub').textContent  = greeting.sub;

  setHalo('blue');
}

function setHalo(state) {
  const dot  = document.getElementById('halo-dot');
  const text = document.getElementById('halo-status-text');
  dot.className = 'halo-dot';

  if (state === 'blue')  { dot.classList.add('pulse-blue');  text.textContent = 'HaloGuard is protecting you'; }
  if (state === 'green') { dot.classList.add('solid-green'); text.textContent = 'All clear — looks safe'; }
  if (state === 'red')   { dot.classList.add('flash-red');   text.textContent = 'Threat detected — read below'; }
}

function quickPrompt(text) {
  const input = document.getElementById('user-input');
  input.value = text;
  input.focus();
  autoResize(input);
}

function handleKey(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
}

function autoResize(el) {
  el.style.height = 'auto';
  el.style.height = Math.min(el.scrollHeight, 120) + 'px';
}

async function sendMessage() {
  if (isThinking) return;

  const input   = document.getElementById('user-input');
  const message = input.value.trim();
  if (!message) return;

  input.value = '';
  autoResize(input);

  appendMessage('user', message);
  chatHistory.push({ role: 'user', content: message });

  setHalo('blue');
  const thinkingId = appendThinking();
  isThinking = true;

  try {
    const apiKey  = localStorage.getItem('haloguard_api_key');
    const profile = getProfile();
    const system  = buildSystemPrompt(profile);

    const response = await fetch(CLAUDE_API, {
      method: 'POST',
      headers: {
        'Content-Type':         'application/json',
        'x-api-key':            apiKey,
        'anthropic-version':    '2023-06-01',
        'anthropic-dangerous-direct-browser-calls': 'true'
      },
      body: JSON.stringify({
        model:      MODEL,
        max_tokens: 1024,
        system:     system,
        messages:   chatHistory
      })
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error?.message || 'API error');
    }

    const data  = await response.json();
    const reply = data.content?.[0]?.text || 'No response.';

    removeThinking(thinkingId);
    chatHistory.push({ role: 'assistant', content: reply });

    if (reply.startsWith('FRAUD_ALERT:')) {
      setHalo('red');
      const reason = reply.replace('FRAUD_ALERT:', '').split('\n')[0].trim();
      showFraudAlert(reason);
      appendMessage('assistant', reply.replace('FRAUD_ALERT:' + reason, '⚠️ **SCAM DETECTED**\n' + reason).trim());
      saveToLog(message, 'danger', reason);
    } else {
      setHalo('green');
      appendMessage('assistant', reply);
    }

  } catch (err) {
    removeThinking(thinkingId);
    setHalo('blue');
    if (err.message.includes('401')) {
      appendMessage('error', 'Invalid API key. Go to Settings to update it.');
    } else {
      appendMessage('error', 'Something went wrong: ' + err.message);
    }
  } finally {
    isThinking = false;
  }
}

function appendMessage(role, text) {
  const container = document.getElementById('chat-messages');
  const div = document.createElement('div');
  div.className = `msg msg-${role}`;

  const formatted = text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br/>');

  div.innerHTML = formatted;
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
  return div;
}

function appendThinking() {
  const id  = 'thinking-' + Date.now();
  const container = document.getElementById('chat-messages');
  const div = document.createElement('div');
  div.id        = id;
  div.className = 'msg msg-thinking';
  div.innerHTML = '<span class="dot"></span><span class="dot"></span><span class="dot"></span>';
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
  return id;
}

function removeThinking(id) {
  const el = document.getElementById(id);
  if (el) el.remove();
}

function showFraudAlert(detail) {
  document.getElementById('fraud-detail').textContent = detail;
  document.getElementById('fraud-alert').classList.remove('hidden');
}

function closeFraudAlert() {
  document.getElementById('fraud-alert').classList.add('hidden');
}

// ── Tab switching ──
function switchTab(name) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  document.getElementById('tab-' + name).classList.add('active');
  document.getElementById('tab-' + name + '-content').classList.add('active');

  const inputBar = document.querySelector('.chat-input-bar');
  const chatContainer = document.getElementById('chat-container');
  if (name === 'chat') {
    inputBar.style.display = 'flex';
    chatContainer.style.display = 'block';
  } else {
    inputBar.style.display = 'none';
    chatContainer.style.display = 'none';
  }

  if (name === 'log') renderScamLog();
}

// ── Paste detection on main chat input ──
function handlePasteMain(e) {
  const text = (e.clipboardData || window.clipboardData).getData('text');
  if (looksRisky(text)) {
    setTimeout(() => {
      const input = document.getElementById('user-input');
      input.value = 'Check if this is a scam: ' + text;
      autoResize(input);
      setHalo('red');
      document.getElementById('halo-status-text').textContent = 'Suspicious content pasted — analyzing...';
    }, 50);
  }
}

// ── Paste detection on Check This tab ──
function handlePasteCheck(e) {
  setTimeout(() => runCheck(), 100);
}

function looksRisky(text) {
  const lower = text.toLowerCase();
  const triggers = [
    'click here', 'verify your account', 'suspended', 'urgent', 'act now',
    'gift card', 'wire transfer', 'bitcoin', 'crypto', 'send money',
    'you won', 'congratulations', 'claim your', 'limited time',
    'password', 'ssn', 'social security', 'bank account', 'routing number',
    'paypal', 'venmo', 'zelle', 'cashapp', 'http://'
  ];
  return triggers.some(t => lower.includes(t)) || /\d{3}-\d{3}-\d{4}/.test(text);
}

// ── Run Check This analysis ──
async function runCheck() {
  const input = document.getElementById('check-input').value.trim();
  if (!input) return;

  const resultEl = document.getElementById('check-result');
  resultEl.className = 'check-result';
  resultEl.textContent = 'Analyzing...';

  setHalo('blue');

  try {
    const apiKey = localStorage.getItem('haloguard_api_key');
    const profile = getProfile();
    const system = buildSystemPrompt(profile);

    const response = await fetch(CLAUDE_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-calls': 'true'
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 512,
        system: system,
        messages: [{ role: 'user', content: 'Please analyze this for fraud or scam risks. Be direct and clear: ' + input }]
      })
    });

    const data = await response.json();
    const reply = data.content?.[0]?.text || 'Unable to analyze.';
    const isFraud = reply.startsWith('FRAUD_ALERT:');

    resultEl.className = 'check-result ' + (isFraud ? 'danger' : 'safe');
    resultEl.textContent = isFraud
      ? '🚨 ' + reply.replace('FRAUD_ALERT:', '').trim()
      : '✅ ' + reply;

    setHalo(isFraud ? 'red' : 'green');
    saveToLog(input, isFraud ? 'danger' : 'safe', reply);

  } catch (err) {
    resultEl.className = 'check-result danger';
    resultEl.textContent = 'Error: ' + err.message;
    setHalo('blue');
  }
}

// ── Scam Log ──
function saveToLog(text, verdict, detail) {
  const log = JSON.parse(localStorage.getItem('haloguard_log') || '[]');
  log.unshift({
    text: text.slice(0, 200),
    verdict,
    detail: detail.slice(0, 300),
    time: new Date().toLocaleString()
  });
  if (log.length > 50) log.pop();
  localStorage.setItem('haloguard_log', JSON.stringify(log));
}

function renderScamLog() {
  const log = JSON.parse(localStorage.getItem('haloguard_log') || '[]');
  const container = document.getElementById('scam-log-list');
  if (!container) return;

  if (log.length === 0) {
    container.innerHTML = '<p class="log-empty">Nothing flagged yet — you\'re safe so far! 🛡️</p>';
    return;
  }

  container.innerHTML = log.map(entry => `
    <div class="log-entry ${entry.verdict}">
      <div class="log-entry-header">
        <span class="log-badge ${entry.verdict}">${entry.verdict === 'danger' ? '🚨 SCAM' : '✅ SAFE'}</span>
        <span class="log-time">${entry.time}</span>
      </div>
      <div class="log-text">${entry.text}</div>
    </div>
  `).join('');
}

function clearLog() {
  if (confirm('Clear your scam history?')) {
    localStorage.removeItem('haloguard_log');
    renderScamLog();
  }
}

function showSettings() {
  document.getElementById('settings-api-key').value = localStorage.getItem('haloguard_api_key') || '';
  document.getElementById('screen-settings').classList.add('active');
}

function hideSettings() {
  document.getElementById('screen-settings').classList.remove('active');
}

function updateApiKey() {
  const key = document.getElementById('settings-api-key').value.trim();
  if (!key.startsWith('sk-ant-')) {
    alert('Invalid key — must start with sk-ant-');
    return;
  }
  localStorage.setItem('haloguard_api_key', key);
  hideSettings();
}

function resetApp() {
  if (confirm('Reset everything? Your profile and API key will be deleted.')) {
    localStorage.clear();
    window.location.href = './index.html';
  }
}

document.addEventListener('DOMContentLoaded', init);
