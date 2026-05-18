(function () {
  'use strict';

  const API_URL = 'https://vaia-chat.onrender.com/chat';
  const CALENDLY_URL = 'https://calendly.com/rcmorrow-youraisolution/free-ai-readiness-audit';

  // ── Styles ──────────────────────────────────────────────────────────────────
  const CSS = `
    #vaia-chat-root * { box-sizing: border-box; margin: 0; padding: 0; }

    /* Launcher bubble */
    #vaia-launcher {
      position: fixed;
      bottom: 28px;
      right: 28px;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: linear-gradient(135deg, #3F5BFF 0%, #7C3AED 100%);
      box-shadow: 0 4px 24px rgba(63,91,255,0.5);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 999999;
      border: none;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    #vaia-launcher:hover {
      transform: scale(1.08);
      box-shadow: 0 6px 32px rgba(63,91,255,0.7);
    }
    #vaia-launcher svg { width: 28px; height: 28px; }

    /* Notification dot */
    #vaia-notif {
      position: absolute;
      top: -2px;
      right: -2px;
      width: 16px;
      height: 16px;
      background: #5EEAD4;
      border-radius: 50%;
      border: 2px solid #0D0F1A;
      animation: vaia-pulse 2s infinite;
    }
    @keyframes vaia-pulse {
      0%, 100% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.2); opacity: 0.8; }
    }

    /* Chat window */
    #vaia-window {
      position: fixed;
      bottom: 100px;
      right: 28px;
      width: 370px;
      height: 560px;
      background: #0D0F1A;
      border-radius: 20px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(63,91,255,0.2);
      display: flex;
      flex-direction: column;
      z-index: 999998;
      overflow: hidden;
      transform: scale(0.95) translateY(10px);
      opacity: 0;
      pointer-events: none;
      transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    #vaia-window.open {
      transform: scale(1) translateY(0);
      opacity: 1;
      pointer-events: all;
    }
    @media (max-width: 420px) {
      #vaia-window {
        width: calc(100vw - 20px);
        right: 10px;
        bottom: 90px;
        height: 70vh;
      }
    }

    /* Header */
    #vaia-header {
      background: linear-gradient(135deg, #1a1f3a 0%, #0f1129 100%);
      padding: 16px 18px;
      display: flex;
      align-items: center;
      gap: 12px;
      border-bottom: 1px solid rgba(63,91,255,0.15);
      flex-shrink: 0;
    }
    #vaia-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: linear-gradient(135deg, #3F5BFF, #7C3AED);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      flex-shrink: 0;
    }
    #vaia-header-info { flex: 1; }
    #vaia-header-name {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      font-size: 15px;
      font-weight: 700;
      color: #F0F4FF;
      letter-spacing: 0.02em;
    }
    #vaia-header-status {
      font-size: 12px;
      color: #5EEAD4;
      display: flex;
      align-items: center;
      gap: 5px;
      margin-top: 2px;
    }
    #vaia-header-status::before {
      content: '';
      width: 6px;
      height: 6px;
      background: #5EEAD4;
      border-radius: 50%;
      display: inline-block;
    }
    #vaia-close {
      background: none;
      border: none;
      cursor: pointer;
      color: #6B7280;
      padding: 4px;
      border-radius: 6px;
      transition: color 0.15s, background 0.15s;
      line-height: 1;
    }
    #vaia-close:hover { color: #F0F4FF; background: rgba(255,255,255,0.08); }

    /* Messages */
    #vaia-messages {
      flex: 1;
      overflow-y: auto;
      padding: 18px 14px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      scroll-behavior: smooth;
    }
    #vaia-messages::-webkit-scrollbar { width: 4px; }
    #vaia-messages::-webkit-scrollbar-track { background: transparent; }
    #vaia-messages::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }

    .vaia-msg {
      display: flex;
      gap: 8px;
      align-items: flex-end;
      animation: vaia-fadein 0.2s ease;
    }
    @keyframes vaia-fadein {
      from { opacity: 0; transform: translateY(6px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .vaia-msg.user { flex-direction: row-reverse; }

    .vaia-bubble {
      max-width: 78%;
      padding: 10px 14px;
      border-radius: 18px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      font-size: 14px;
      line-height: 1.5;
      word-break: break-word;
    }
    .vaia-msg.bot .vaia-bubble {
      background: #1a1f3a;
      color: #E8EEFF;
      border-bottom-left-radius: 4px;
      border: 1px solid rgba(63,91,255,0.15);
    }
    .vaia-msg.user .vaia-bubble {
      background: linear-gradient(135deg, #3F5BFF, #6D3AEE);
      color: #fff;
      border-bottom-right-radius: 4px;
    }

    .vaia-msg-icon {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: linear-gradient(135deg, #3F5BFF, #7C3AED);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 13px;
      flex-shrink: 0;
    }

    /* Typing indicator */
    #vaia-typing {
      display: none;
      align-items: flex-end;
      gap: 8px;
    }
    #vaia-typing.show { display: flex; }
    .vaia-typing-dots {
      background: #1a1f3a;
      border: 1px solid rgba(63,91,255,0.15);
      border-radius: 18px;
      border-bottom-left-radius: 4px;
      padding: 12px 16px;
      display: flex;
      gap: 5px;
      align-items: center;
    }
    .vaia-typing-dots span {
      width: 6px;
      height: 6px;
      background: #5EEAD4;
      border-radius: 50%;
      display: inline-block;
      animation: vaia-bounce 1.2s infinite;
    }
    .vaia-typing-dots span:nth-child(2) { animation-delay: 0.2s; }
    .vaia-typing-dots span:nth-child(3) { animation-delay: 0.4s; }
    @keyframes vaia-bounce {
      0%, 80%, 100% { transform: translateY(0); opacity: 0.5; }
      40% { transform: translateY(-6px); opacity: 1; }
    }

    /* Book button */
    #vaia-book-btn {
      display: inline-block;
      margin: 8px 0 4px 44px;
      padding: 9px 18px;
      background: linear-gradient(135deg, #3F5BFF 0%, #7C3AED 100%);
      color: #fff;
      border-radius: 10px;
      font-size: 13px;
      font-weight: 700;
      text-decoration: none;
      letter-spacing: 0.03em;
      transition: opacity 0.2s, transform 0.15s;
    }
    #vaia-book-btn:hover { opacity: 0.9; transform: translateY(-1px); }

    /* Input area */
    #vaia-input-area {
      padding: 12px 14px 16px;
      border-top: 1px solid rgba(63,91,255,0.1);
      background: #0D0F1A;
      flex-shrink: 0;
    }
    #vaia-input-row {
      display: flex;
      gap: 8px;
      align-items: flex-end;
      background: #141729;
      border: 1px solid rgba(63,91,255,0.2);
      border-radius: 14px;
      padding: 8px 8px 8px 14px;
      transition: border-color 0.2s;
    }
    #vaia-input-row:focus-within {
      border-color: rgba(63,91,255,0.5);
      box-shadow: 0 0 0 3px rgba(63,91,255,0.1);
    }
    #vaia-input {
      flex: 1;
      background: none;
      border: none;
      outline: none;
      color: #F0F4FF;
      font-size: 14px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      resize: none;
      max-height: 100px;
      line-height: 1.5;
    }
    #vaia-input::placeholder { color: #4B5563; }
    #vaia-send {
      width: 36px;
      height: 36px;
      border-radius: 10px;
      background: linear-gradient(135deg, #3F5BFF, #7C3AED);
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: opacity 0.2s, transform 0.15s;
    }
    #vaia-send:hover { opacity: 0.9; transform: scale(1.05); }
    #vaia-send:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }
    #vaia-send svg { width: 16px; height: 16px; }

    /* Powered by */
    #vaia-powered {
      text-align: center;
      font-size: 11px;
      color: #374151;
      padding: 6px 0 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    }
    #vaia-powered a { color: #4B5563; text-decoration: none; }
    #vaia-powered a:hover { color: #6B7280; }
  `;

  // ── Inject styles ────────────────────────────────────────────────────────────
  const style = document.createElement('style');
  style.textContent = CSS;
  document.head.appendChild(style);

  // ── Build DOM ────────────────────────────────────────────────────────────────
  const root = document.createElement('div');
  root.id = 'vaia-chat-root';
  root.innerHTML = `
    <!-- Launcher -->
    <button id="vaia-launcher" aria-label="Chat with Vaia AI">
      <div id="vaia-notif"></div>
      <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    </button>

    <!-- Chat Window -->
    <div id="vaia-window" role="dialog" aria-label="Chat with Vaia AI">
      <div id="vaia-header">
        <div id="vaia-avatar">🤖</div>
        <div id="vaia-header-info">
          <div id="vaia-header-name">Vaia AI</div>
          <div id="vaia-header-status">Online — typically replies instantly</div>
        </div>
        <button id="vaia-close" aria-label="Close chat">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      <div id="vaia-messages">
        <!-- Typing indicator (always last) -->
        <div id="vaia-typing">
          <div class="vaia-msg-icon">🤖</div>
          <div class="vaia-typing-dots">
            <span></span><span></span><span></span>
          </div>
        </div>
      </div>

      <div id="vaia-input-area">
        <div id="vaia-input-row">
          <textarea id="vaia-input" rows="1" placeholder="Ask me anything…" maxlength="500"></textarea>
          <button id="vaia-send" aria-label="Send message">
            <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"/>
              <polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          </button>
        </div>
        <div id="vaia-powered">Powered by <a href="https://meetvaia.com" target="_blank">Vaia AI</a></div>
      </div>
    </div>
  `;
  document.body.appendChild(root);

  // ── State ────────────────────────────────────────────────────────────────────
  const win      = document.getElementById('vaia-window');
  const launcher = document.getElementById('vaia-launcher');
  const notif    = document.getElementById('vaia-notif');
  const msgs     = document.getElementById('vaia-messages');
  const input    = document.getElementById('vaia-input');
  const sendBtn  = document.getElementById('vaia-send');
  const typing   = document.getElementById('vaia-typing');
  let isOpen     = false;
  let isWaiting  = false;
  let history    = [];

  // ── Helpers ──────────────────────────────────────────────────────────────────
  function addMessage(role, text) {
    const wrap = document.createElement('div');
    wrap.className = `vaia-msg ${role}`;

    const icon = document.createElement('div');
    icon.className = 'vaia-msg-icon';
    icon.textContent = role === 'bot' ? '🤖' : '🧑';

    const bubble = document.createElement('div');
    bubble.className = 'vaia-bubble';
    // Convert markdown-ish links to real links
    bubble.innerHTML = text
      .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // Markdown links [text](url)
      .replace(/\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g, (match, linkText, url) => {
        const cleanUrl = url.includes('calendly.com') ? CALENDLY_URL : url;
        return `<a href="${cleanUrl}" target="_blank" rel="noopener" style="color:#5EEAD4;text-decoration:underline;">${linkText}</a>`;
      })
      // Raw URLs
      .replace(/(https?:\/\/[^\s<]+)/g, (match, url) => {
        const cleanUrl = url.includes('calendly.com') ? CALENDLY_URL : url;
        return `<a href="${cleanUrl}" target="_blank" rel="noopener" style="color:#5EEAD4;text-decoration:underline;">${cleanUrl}</a>`;
      })
      .replace(/\n/g, '<br>');



    if (role === 'bot') {
      wrap.appendChild(icon);
      wrap.appendChild(bubble);
      // Always show Book button after bot message
      const bookBtn = document.createElement('a');
      bookBtn.id = 'vaia-book-btn';
      bookBtn.href = CALENDLY_URL;
      bookBtn.target = '_blank';
      bookBtn.rel = 'noopener';
      bookBtn.textContent = '📅 Book Your Free AI Audit';
      // Remove any previous book button before adding new one
      const prev = msgs.querySelector('#vaia-book-btn');
      if (prev) prev.remove();
      msgs.insertBefore(bookBtn, typing);
    } else {
      wrap.appendChild(bubble);
      wrap.appendChild(icon);
    }

    msgs.insertBefore(wrap, typing);
    scrollToBottom();
  }

  function scrollToBottom() {
    msgs.scrollTop = msgs.scrollHeight;
  }

  function showTyping(show) {
    typing.classList.toggle('show', show);
    scrollToBottom();
  }

  function setWaiting(val) {
    isWaiting = val;
    sendBtn.disabled = val;
    input.disabled = val;
  }

  function autoResize() {
    input.style.height = 'auto';
    input.style.height = Math.min(input.scrollHeight, 100) + 'px';
  }

  // ── Open / close ─────────────────────────────────────────────────────────────
  function openChat() {
    isOpen = true;
    win.classList.add('open');
    notif.style.display = 'none';
    setTimeout(() => input.focus(), 300);
    if (history.length === 0) sendGreeting();
  }

  function closeChat() {
    isOpen = false;
    win.classList.remove('open');
  }

  launcher.addEventListener('click', () => isOpen ? closeChat() : openChat());
  document.getElementById('vaia-close').addEventListener('click', closeChat);

  // ── Greeting ─────────────────────────────────────────────────────────────────
  async function sendGreeting() {
    setWaiting(true);
    showTyping(true);
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: 'Hello! I just opened the chat.' }]
        })
      });
      const data = await res.json();
      showTyping(false);
      const reply = data.reply || "Hi! I'm Vaia. How can I help your business today?";
      addMessage('bot', reply);
      history.push({ role: 'user', content: 'Hello! I just opened the chat.' });
      history.push({ role: 'assistant', content: reply });
    } catch (e) {
      showTyping(false);
      addMessage('bot', "Hi! I'm Vaia — Vaia AI's assistant. How can I help your business today?");
    }
    setWaiting(false);
  }

  // ── Send message ─────────────────────────────────────────────────────────────
  async function sendMessage() {
    const text = input.value.trim();
    if (!text || isWaiting) return;

    input.value = '';
    autoResize();
    addMessage('user', text);
    history.push({ role: 'user', content: text });

    setWaiting(true);
    showTyping(true);

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history })
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      showTyping(false);

      const reply = data.reply || "I'm sorry, I didn't catch that. Could you try again?";
      addMessage('bot', reply);
      history.push({ role: 'assistant', content: reply });
    } catch (e) {
      showTyping(false);
      addMessage('bot', "Sorry, I'm having a moment. Please try again or call us at 1-833-438-8242.");
    }

    setWaiting(false);
    input.focus();
  }

  sendBtn.addEventListener('click', sendMessage);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });
  input.addEventListener('input', autoResize);

  // ── Proactive message after 8 seconds ────────────────────────────────────────
  setTimeout(() => {
    if (!isOpen) {
      notif.style.display = 'block';
    }
  }, 1000);

})();
