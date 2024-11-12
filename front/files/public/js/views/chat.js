import { renderTopBar } from './home.js';
import { renderLeftSidebar } from './leftside.js';


export function renderChatContent(appContainer) {
    const chatViewHTML = `
      <div class="chat-container">
        <div class="chat-header">
          <img class="friend-avatar" src="https://api.dicebear.com/6.x/avataaars/svg?seed=Player2" alt="Player2 avatar" width="40" height="40">
          <div class="friend-info">
            <div class="friend-name">Player2</div>
            <div class="friend-status">Online</div>
          </div>
        </div>
        
        <div class="chat-messages">
          <div class="message message-received">
            Hey, want to play a quick match?
          </div>
          <div class="message message-sent">
            Sure! I'm up for a challenge!
          </div>
          <div class="message message-received">
            Great! I'll create a room.
          </div>
          <div class="message message-sent">
            Perfect, send me the invite when ready.
          </div>
        </div>
        
        <div class="chat-input">
          <input type="text" placeholder="Type your message...">
          <button class="send-btn">Send</button>
        </div>
      </div>
    `;
    
    document.getElementById('mainContent').innerHTML = chatViewHTML;
    initializeChatHandlers();
  }

  function initializeChatHandlers() {
    const input = document.querySelector('.chat-input input');
    const sendBtn = document.querySelector('.send-btn');
    const chatMessages = document.querySelector('.chat-messages');

    function sendMessage() {
      const message = input.value.trim();
      if (message) {
        const messageElement = document.createElement('div');
        messageElement.className = 'message message-sent';
        messageElement.textContent = message;
        chatMessages.appendChild(messageElement);
        input.value = '';
        chatMessages.scrollTop = chatMessages.scrollHeight;
      }
    }

    sendBtn.addEventListener('click', sendMessage);
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        sendMessage();
      }
    });
  }





  export function renderChatView(appContainer) {
    // Set up the main structure with placeholders
    // const response = await fetch_users('me');
    // const userData = response.user;
    appContainer.innerHTML = `
        <div id="topBar" class="top-bar"></div>
        <div id="mainContent" class="bodyElement"></div>
        <div id="leftSidebar" class="bodyElement"></div>
    `;
    //('Navigating to home page    howaa');
    // Render top bar, main content, and user profile into placeholders
    renderTopBar(appContainer);
    renderLeftSidebar(appContainer);
    renderChatContent(appContainer);
    // renderUserProfile(appContainer);
}