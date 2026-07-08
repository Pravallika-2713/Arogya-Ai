const API_BASE = (() => {
  const host = window.location.hostname;
  if (host === 'localhost' || host === '127.0.0.1') {
    return 'http://localhost:8080/api';
  }
  return '/api';
})();

const state = {
  view: 'landing',
  lang: 'en',
  sessionId: makeSessionId(),
  messages: [],
  prediction: null,
  isTyping: false,
  isScanning: false,
  nextStep: 'greeting',
};

function makeSessionId() {
  if (window.crypto?.randomUUID) return window.crypto.randomUUID();
  return `session-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function t(key, lang = state.lang) {
  const dict = {
    en: {
      appSub: 'Virtual Health Assistant',
      start: 'Start Health Check',
      startSub: 'Powered by AI Decision Tree Model',
      quick: 'Quick Actions',
      tipTitle: 'Daily Health Tip',
      howTitle: 'How it works',
      steps: ['Enter vitals', 'AI Analysis', 'Get Results'],
      stepDesc: [
        'Heart rate, BP, SpO₂, Temperature',
        'Decision Tree model processes 10 inputs',
        'Disease prediction + home remedies',
      ],
      healthCheck: 'Health Check',
      appointment: 'Book Appointment',
      subsidy: 'Subsidies',
      reports: 'My Reports',
      back: 'Back',
      send: 'Send',
      reset: 'Start New Assessment',
      language: 'Language / భాష',
      guest: 'Guest',
      welcome: 'Welcome',
      headerTitle: 'Health Check',
      enterMessage: 'Type your answer...',
      connectError: 'I’m having trouble connecting right now. Please try again.',
      analysis: 'Running AI analysis...',
    },
    te: {
      appSub: 'వర్చువల్ హెల్త్ అసిస్టెంట్',
      start: 'ఆరోగ్య పరీక్ష మొదలు పెట్టండి',
      startSub: 'AI నిర్ణయ వృక్ష నమూనా ద్వారా',
      quick: 'త్వరిత చర్యలు',
      tipTitle: 'రోజువారీ ఆరోగ్య చిట్కా',
      howTitle: 'ఇది ఎలా పని చేస్తుంది',
      steps: ['వైటల్స్ నమోదు', 'AI విశ్లేషణ', 'ఫలితాలు పొందండి'],
      stepDesc: [
        'హృదయ స్పందన, BP, SpO₂, ఉష్ణోగ్రత',
        'నిర్ణయ వృక్ష నమూనా 10 inputs ప్రాసెస్ చేస్తుంది',
        'జబ్బు అంచనా + ఇంటి చికిత్సలు',
      ],
      healthCheck: 'ఆరోగ్య పరీక్ష',
      appointment: 'అపాయింట్‌మెంట్',
      subsidy: 'సహాయ పథకాలు',
      reports: 'నా రిపోర్టులు',
      back: 'వెనుకకు',
      send: 'పంపు',
      reset: 'కొత్త పరీక్ష',
      language: 'Language / భాష',
      guest: 'అతిథి',
      welcome: 'స్వాగతం',
      headerTitle: 'ఆరోగ్య పరీక్ష',
      enterMessage: 'మీ జవాబు టైప్ చేయండి...',
      connectError: 'ఇప్పుడు కనెక్షన్ సమస్య ఉంది. దయచేసి మళ్ళీ ప్రయత్నించండి.',
      analysis: 'AI విశ్లేషణ జరుగుతోంది...',
    },
  };

  return dict[lang][key] ?? key;
}

function formatText(text = '') {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br>');
}

function landingMarkup() {
  const l = t;
  const tip = state.lang === 'te'
    ? '💧 రోజూ 8 గ్లాసుల నీరు తాగండి — హైడ్రేటెడ్‌గా ఉంటారు.'
    : '💧 Drink 8 glasses of water daily to stay hydrated.';

  return `
    <section class="landing">
      <div class="landing-card">
        <div class="brand">
          <div class="brand-logo">
            <div class="logo-badge">✚</div>
            <div>
              <h1>Arogya AI</h1>
              <span>${l('appSub')}</span>
            </div>
          </div>
          <div class="language-switch" aria-label="Language switch">
            <button class="lang-btn ${state.lang === 'en' ? 'active' : ''}" data-lang="en">EN</button>
            <button class="lang-btn ${state.lang === 'te' ? 'active' : ''}" data-lang="te">TE</button>
          </div>
        </div>

        <div class="hero">
          <h2>${state.lang === 'te' ? 'శుభోదయం' : 'Good Morning'}</h2>
          <p>${l('startSub')}</p>
          <button class="start-btn" id="start-assessment">${l('start')}</button>
        </div>

        <div class="quick-card">
          <div class="quick-title">${l('quick')}</div>
          <div class="quick-grid">
            <div class="quick-item"><span>${l('healthCheck')}</span><strong>AI</strong></div>
            <div class="quick-item"><span>${l('appointment')}</span><strong>+</strong></div>
            <div class="quick-item"><span>${l('subsidy')}</span><strong>₹</strong></div>
            <div class="quick-item"><span>${l('reports')}</span><strong>📄</strong></div>
          </div>
        </div>

        <div class="tip-card">
          <h3>${l('tipTitle')}</h3>
          <p>${tip}</p>
        </div>
      </div>
    </section>
  `;
}

function chatMarkup() {
  return `
    <section class="chat">
      <div class="chat-panel">
        <div class="chat-header">
          <div class="header-left">
            <button id="go-home" aria-label="Go home">←</button>
            <div class="header-brand">
              <strong>Arogya AI</strong>
              <span>${t('headerTitle')}</span>
            </div>
          </div>
          <div class="header-right">
            <button id="toggle-lang" class="lang-pill">${state.lang === 'te' ? '🇮🇳 తెలుగు' : '🌐 English'}</button>
            <button id="reset-chat" class="reset-btn">${t('reset')}</button>
          </div>
        </div>

        <div class="messages" id="messages">
          ${state.messages.map((m) => `<div class="msg ${m.role}">${formatText(m.text)}</div>`).join('')}
          ${state.isTyping ? `<div class="msg bot"><div class="typing"><span></span><span></span><span></span></div></div>` : ''}
        </div>

        ${state.prediction ? `
          <div class="prediction-panel">
            <div class="prediction-card">
              <div class="prediction-top">
                <div class="prediction-tag ${state.prediction.riskLevel}">${state.prediction.riskLevel.toUpperCase()}</div>
                <button id="new-assessment" class="reset-btn">${t('reset')}</button>
              </div>
              <h3>${state.prediction.disease}</h3>
              <p>${state.prediction.advice}</p>
              <div class="stat-grid">
                <div class="stat"><span>Status</span><strong>${state.prediction.status}</strong></div>
                <div class="stat"><span>Risk</span><strong>${state.prediction.riskLevel}</strong></div>
                <div class="stat"><span>Alerts</span><strong>${state.prediction.alerts.heartRate === 'NORMAL' ? 'Normal' : 'Attention'}</strong></div>
              </div>

              <div class="section">
                <h4>${state.lang === 'te' ? 'హోమ్ రిమెడీస్' : 'Home Remedies'}</h4>
                <ul>
                  ${state.prediction.homeRemedies.slice(0, 3).map((item) => `<li>${item}</li>`).join('')}
                </ul>
              </div>

              <div class="section">
                <h4>${state.lang === 'te' ? 'జాగ్రత్తలు' : 'Precautions'}</h4>
                <ul>
                  ${state.prediction.precautions.slice(0, 3).map((item) => `<li>${item}</li>`).join('')}
                </ul>
              </div>
            </div>
          </div>
        ` : ''}

        <div class="input-bar">
          <textarea id="chat-input" rows="2" placeholder="${t('enterMessage')}"></textarea>
          <button id="send-btn" class="send-btn" aria-label="Send message">➤</button>
        </div>
      </div>
    </section>
  `;
}

function render() {
  document.getElementById('app').innerHTML = state.view === 'landing' ? landingMarkup() : chatMarkup();

  if (state.view === 'landing') {
    document.getElementById('start-assessment')?.addEventListener('click', startAssessment);
    document.querySelectorAll('[data-lang]').forEach((btn) => {
      btn.addEventListener('click', () => {
        state.lang = btn.dataset.lang;
        render();
      });
    });
    return;
  }

  document.getElementById('go-home')?.addEventListener('click', () => {
    state.view = 'landing';
    state.messages = [];
    state.prediction = null;
    render();
  });

  document.getElementById('toggle-lang')?.addEventListener('click', () => {
    state.lang = state.lang === 'en' ? 'te' : 'en';
    render();
  });

  document.getElementById('reset-chat')?.addEventListener('click', resetSession);
  document.getElementById('new-assessment')?.addEventListener('click', resetSession);

  const input = document.getElementById('chat-input');
  const sendBtn = document.getElementById('send-btn');

  function sendInput() {
    const value = input.value.trim();
    if (!value) return;
    input.value = '';
    sendMessage(value);
  }

  sendBtn?.addEventListener('click', sendInput);

  input?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendInput();
    }
  });

  const messages = document.getElementById('messages');
  if (messages) {
    messages.scrollTop = messages.scrollHeight;
  }
}

async function startAssessment() {
  state.view = 'chat';
  state.sessionId = makeSessionId();
  state.messages = [];
  state.prediction = null;
  render();
  await sendMessage('Hello', true);
}

function resetSession() {
  state.sessionId = makeSessionId();
  state.messages = [];
  state.prediction = null;
  state.nextStep = 'greeting';
  render();
  void sendMessage('Hello', true);
}

async function sendMessage(message, isSystemInit = false) {
  if (!message.trim()) return;

  if (!isSystemInit) {
    state.messages = [...state.messages, { role: 'user', text: message }];
  }

  state.isTyping = true;
  render();

  try {
    const response = await fetch(`${API_BASE}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, sessionId: state.sessionId, language: state.lang }),
    });

    const data = await response.json();
    state.nextStep = data.nextStep;
    state.messages = [...state.messages, { role: 'bot', text: data.reply }];
    state.isTyping = false;
    render();

    if (data.vitalsReady && data.vitals) {
      state.isScanning = true;
      render();
      const pred = await fetch(`${API_BASE}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data.vitals),
      });
      const prediction = await pred.json();
      state.prediction = prediction;
      state.isScanning = false;
      render();
    }
  } catch (error) {
    state.isTyping = false;
    state.messages = [...state.messages, { role: 'bot', text: t('connectError') }];
    render();
  }
}

render();
