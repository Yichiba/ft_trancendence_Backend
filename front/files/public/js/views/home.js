import  { navigateTo } from '../router.js';
import { fetch_users, fetchFriends, renderLeftSidebar } from './leftside.js';
import { loadProfilePage } from './profile.js';




async function fetch_notifications() {
  const response = await fetchFriends();
  const requests = response.data.requests;
  
    const friendsHTML = friendsData.map(friend => `
      <div class="friend-item">
          <img class="friend-avatar" src="http://127.0.0.1:8000${friend.picture}" alt="${friend.username}'s avatar"   width="40" height="40">
          <div class="online-indicator ${friend.status ? 'online' : 'offline'}"></div>
          <div class="friend-info">
              <div class="friend-name">${friend.username}</div>
              <!-- Status dot instead of text -->
          </div>
      </div>
  `).join('');
}











export async function renderTopBar(appContainer) {
  console.log("from topbar");

  const data = await fetch_users('me');
  const user = data.user;
  console.log("user",user);      
    const topBarHTML = `
      <div class="top-bar">
        <div class="user-profile">
          <div class="user-avatar">
            <img src=${user.profile_picture} id="profile-picture" alt="${user.username}'avatar" width="50" height="50">
          </div>
          <span class="username">${user.username}</span>
        </div>

        <div class="search-container">
          <input type="search" class="search-bar" placeholder="Search players, tournaments ...">
          <span class="search-icon">🔍</span>
        </div>
        
        <div class="notifications">
          <div class="notification-icon">
            🔔
            <span class="notification-badge">3</span>
        </div>
      </div>
    `;
    
    
    document.getElementById('topBar').innerHTML = topBarHTML;
    document.getElementById('notifications').innerHTML = fetch_notifications();
    // document.getElementById('notifications').addEventListener('click', event => handleNotification(event,appContainer));
    const profilePicContainer = document.getElementById('profile-picture');
    if (profilePicContainer) {
        profilePicContainer.addEventListener('click', () => {
            console.log('Profile picture clicked, redirecting to profile page');
            navigateTo('/profile', appContainer);
        });
    }
    const searchBar = document.querySelector('.search-bar');
    searchBar.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        const username = e.target.value.toLowerCase();
        loadProfilePage(appContainer, username);  // Load profile for specified user
      }
    });

  }


  function handleNotification(event,appContainer) {
    console.log('Notification icon clicked');
    const notificationDropdown = document.querySelector('.notification-dropdown');
    notificationDropdown.classList.toggle('show');
  }


  function renderMainContent(appContainer) {
    const mainContentHTML = `
      <div class="bodyElement">
        <header>
          <h1>Ping & Pong </h1>
          <div class="ping-pong-animation">
            <div class="paddle paddle-left"></div>
            <div class="ball"></div>
            <div class="paddle paddle-right"></div>
          </div>
        </header>
        
        <div class="cta-buttons">
          <a href="https://example.com/play" class="btn btn-play">Play Now</a>
          <a href="https://example.com/tutorial" class="btn btn-learn">How to Play</a>
        </div>
        
        <div class="features">
          <div class="feature-card">
            <div class="feature-icon">🎮</div>
            <h3>Tournament</h3>
            <p>Join exciting tournaments and compete for glory</p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">🎯</div>
            <h3>Practice Mode</h3>
            <p>Perfect your skills with AI opponents of varying difficulty</p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">🤝</div>
            <h3>Multiplayer</h3>
            <p>Challenge friends or random opponents in real-time matches</p>
          </div>
        </div>
      </div>
    `;
    
    document.getElementById('mainContent').innerHTML = mainContentHTML;
    
  }
  
  
  export function hanleLogoutBtn(event,appContainer) {
      event.preventDefault(); // Prevent the default link behavior
  
      fetch('http://127.0.0.1:8000/logout/', {
          method: 'post',
          credentials: 'include',  // Important for cookie handling
      })
      .then(response => {
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
          return response.json();
      })
      .then(response => {
          console.log('Loggged out Successfully !!!');
          navigateTo('/login',appContainer );   // Redirect to login page
      })
      .catch(error => {
          console.error('There was a problem with the fetch operation:', error);
      });
  }



  export async  function renderUserProfile(apppContainer) {
    console.log('from renderUserProfile');
    const response = await fetch_users('me');
    const userData = response.user;
        document.querySelector('.username').textContent = userData.username;
        document.querySelector('.user-avatar img').src = userData.profile_picture;
  
}


export async function renderHomePage(appContainer) {
    // Set up the main structure with placeholders
    const response = await fetch_users('me');
    const userData = response.user;
    appContainer.innerHTML = `
        <div id="topBar" class="top-bar"></div>
        <div id="mainContent" class="bodyElement"></div>
        <div id="leftSidebar" class="bodyElement"></div>
    `;
    console.log('Navigating to home page    howaa');
    // Render top bar, main content, and user profile into placeholders
    renderTopBar(appContainer);
    renderLeftSidebar(appContainer);
    renderMainContent(appContainer);
    renderUserProfile(appContainer);
}
