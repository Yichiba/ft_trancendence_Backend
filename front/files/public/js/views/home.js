import { navigateTo } from '../router.js';
import { fetch_users, fetchFriends, renderLeftSidebar } from './leftside.js';
import { loadProfilePage, cancelFriend, acceptFriend } from './profile.js';

async function fetch_friendRequest() {
  const response = await fetchFriends();
  const requests = response.data.requests;
  
  const notificationContainer = document.getElementById('notifications');
  const notificationBadge = document.querySelector('.notification-badge');

  const notificationItems = requests.map(friend => `
    <div class="friend-request-item">
      <img class="friend-request-avatar" src="${window.self.origin}/backend${friend.profile_picture}" alt="${friend.username}'s avatar" width="40" height="40">
      <div class="friend-request-info">
        <div  class="tsxt-request" >${friend.username} wants to be your friend</div>
      </div>
      <div class="friend-request-actions">
        <button class="friend-request-btn acceptt-btn" data-username="${friend.username}">Accept</button>
        <button class="friend-request-btn decline-btn" data-username="${friend.username}">Decline</button>
      </div>
    </div>
  `).join('');

  // If there are no new requests
  if (requests.length === 0) {
    notificationContainer.innerHTML = `
      <div class="notification-item">No new notifications</div>`;
    return;
  }
  if (notificationBadge) {
    notificationBadge.textContent = requests.length; // Set badge to the number of friend requests
  }

  // Update the notification container
  notificationContainer.innerHTML = notificationItems;
  console.log("Updated notifications:", notificationContainer.innerHTML);

  // Add event listeners to the accept and decline buttons
  document.querySelectorAll('.acceptt-btn').forEach(button => {
    button.addEventListener('click', () => acceptFriend(button.dataset.username, true));
  });
  document.querySelectorAll('.decline-btn').forEach(button => {
    button.addEventListener('click', () => handleFriendRequest(button.dataset.username, false));
  });
}

function handleFriendRequest(username, isAccepted) {
  if (isAccepted) {
    console.log(`Accepted friend request from ${username}`);
    // Add code here to handle accepting the friend request
  } else {
    console.log(`Declined friend request from ${username}`);
    // Add code here to handle declining the friend request
  }
}

export async function renderTopBar(appContainer) {
  console.log("from topbar");

  const data = await fetch_users('me');
  const user = data.user;
  console.log("user", user);

  const topBarHTML = `
    <div class="top-bar">
      <div class="user-profile">
        <div class="user-avatar">
          <img src="${user.profile_picture}" id="profile-picture" alt="${user.username}'s avatar" width="50" height="50">
        </div>
        <span class="username">${user.username}</span>
      </div>

      <div class="search-container">
        <input type="search" class="search-bar" placeholder="Search players, tournaments ...">
        <span class="search-icon">🔍</span>
      </div>
      
      <div class="notifications">
        <div class="notification-icon">
          👥
          <span class="notification-badge"></span>
          <div class="notification-dropdown">
            <div id="notifications" class="notification-item">
              <div>Loading...</div>
            </div>
          </div>
        </div>
      </div>
      
  `;

  document.getElementById('topBar').innerHTML = topBarHTML;

  // Load friend requests after rendering top bar
  await fetch_friendRequest();

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
      console.log('Search query:', e.target.value);
      const username = e.target.value.toLowerCase();
      loadProfilePage(appContainer, username); // Load profile for specified user
    }
  });

  const notificationIcon = document.querySelector('.notification-icon');
  const notificationDropdown = document.querySelector('.notification-dropdown');
  if (notificationIcon) {
    notificationIcon.addEventListener('click', () => {
      notificationDropdown.classList.toggle('active');
    });
  }
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
  
      fetch(window.self.origin +'/backend' + 'logout/', {
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
