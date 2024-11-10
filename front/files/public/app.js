// Select the main app container
const appContainer = document.getElementById('app');

// Function to render the login page
function renderLoginPage() {
    appContainer.innerHTML = `
        <h2>Welcome</h2>
        <form id="loginForm"">
        <div class="input-group">
            <input type="username" id="username" required>
            <label for="username">Username</label>
        </div>
        <div class="input-group">
            <input type="password" id="password" required>
            <label for="password">Password</label>
        </div>
        <button type="submit" class="submit-btn">Login</button>
    </form>
        // <a href="/login/42/" class="button" onclick="navigateTo('/login/42'); return false;">Login With 42</a>
        <div class="link-container">
            <a href="/signup" onclick="navigateTo('/signup'); return false;" class="link">Sign Up</a>
            <a href="/forgotPassword" onclick="navigateTo('/forgot'); return false;" class="link">Forgot Password?</a>
        </div>

    `;
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
}

// Function to render the signup page
function renderSignUpPage() {
    appContainer.innerHTML = `
        <h2>Sign Up</h2>
    <form id="signupForm">
        <div class="input-group">
            <input type="text" id="username" required>
            <label for="username">Username</label>
        </div>
        <div class="input-group">
            <input type="text" id="firstName" required>
            <label for="firstName">First Name</label>
        </div>
        <div class="input-group">
            <input type="text" id="lastName" required>
            <label for="lastName">Last Name</label>
        </div>
        <div class="input-group">
            <input type="email" id="email" required>
            <label for="email">Email</label>
        </div>
        <div class="input-group">
            <input type="password" id="password" required>
            <label for="password">Password</label>
        </div>
        <div class="input-group">
            <input type="password" id="password-confirm" required>
            <label for="password-confirm">Confirm Password</label>
        </div>
        <button type="submit" class="submit-btn">Sign Up</button>
    </form>
    <a href="/login" class="button" onclick="navigateTo('/login'); return false;">Go to Login</a>
`;
document.getElementById('signupForm').addEventListener('submit', handleSignup);
}




function renderTopBar() {
    const topBarHTML = `
      <div class="top-bar">
        <div class="user-profile">
          <div class="user-avatar">
            <img src="https://api.dicebear.com/6.x/avataaars/svg?seed=Felix" alt="user profile avatar, cartoon style" width="50" height="50">
          </div>
          <span class="username">PlayerOne</span>
        </div>

        <div class="search-container">
          <input type="search" class="search-bar" placeholder="Search players, tournaments, or game modes...">
          <span class="search-icon">🔍</span>
        </div>
        
        <div class="notifications">
          <div class="notification-icon">
            🔔
            <span class="notification-badge">3</span>
            <div class="notification-dropdown">
              <div class="notification-item">
                <div>🏆 New challenge from Player2!</div>
              </div>
              <div class="notification-item">
                <div>🎮 Tournament starting in 5 minutes</div>
              </div>
              <div class="notification-item">
                <div>⭐ You've reached Level 10!</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    
    document.getElementById('topBar').innerHTML = topBarHTML;
  }


  function render_42_login() {
    window.location.href = 'http://127.0.0.1:8000/login/42/'
}



  function renderMainContent() {
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

  function renderLeftSidebar() {
    const leftSidebarHTML = `
      <div class="left-sidebar">
        <h3>Online Friends</h3>
        <div class="friends-list">
          <div class="friend-item">
            <img class="friend-avatar" src="https://api.dicebear.com/6.x/avataaars/svg?seed=Player2" alt="Player2 avatar" width="40" height="40">
            <div class="friend-info">
              <div class="friend-name">Player2</div>
              <div class="friend-status">In Game</div>
            </div>
            <div class="online-indicator"></div>
          </div>
          <div class="friend-item">
            <img class="friend-avatar" src="https://api.dicebear.com/6.x/avataaars/svg?seed=Player3" alt="Player3 avatar" width="40" height="40">
            <div class="friend-info">
              <div class="friend-name">Player3</div>
              <div class="friend-status">Online</div>
            </div>
            <div class="online-indicator"></div>
          </div>
          <div class="friend-item">
            <img class="friend-avatar" src="https://api.dicebear.com/6.x/avataaars/svg?seed=Player4" alt="Player4 avatar" width="40" height="40">
            <div class="friend-info">
              <div class="friend-name">Player4</div>
              <div class="friend-status">In Menu</div>
            </div>
            <div class="online-indicator"></div>
          </div>
        </div>
        <button class="logout-btn" onclick="handleLogout()">Logout</button>
      </div>
    `;
    
    document.getElementById('leftSidebar').innerHTML = leftSidebarHTML;
    
  }

function sendCodeOauth() {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    console.log('Code:', code);
    fetch('http://127.0.0.1:8000/login/42/callback/?code='+code,{
      method: 'GET',
      credentials: 'include', // Only include this if you need cookies/auth
      headers: {
          'Content-Type': 'application/json',
      },
  }).then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return navigateTo('/home');
    });
}








// Function to handle navigation and update URL
function navigateTo(path) {
    window.history.pushState({}, '', path);
    router();
}





// Router function to render the correct view based on URL path
function router() {
    console.log('Navigating to :', window.location.pathname);
    const path = window.location.pathname;
    if (path === '/login') {
        renderLoginPage();
    }else if (path === '/callback') {
        sendCodeOauth();
    }else if (path === '/login/42') {
        render_42_login();
    } else if (path === '/signup') {
        renderSignUpPage();
    } else if (path === '/home') {
        renderHomePage();
    } else {
        renderLoginPage(); // default view
    }
}

// Handle back/forward navigation
window.addEventListener('popstate', router);

// Initial render based on the URL
router();

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

function handleLogin(event) {
    event.preventDefault(); // Prevent the form from refreshing the page

    // Get email and password values
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // Check if username or password is empty
    if (!username || !password) {
        alert("Please enter both username and password.");
        return;
    }

    // Create payload to send to the server
    const loginData = {
        username: username,
        password: password
    };
    console.log("Login attempt:", loginData);
    // Send POST request to the server's login endpoint
    fetch("http://127.0.0.1:8000/login/", {  // Replace with your API endpoint
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(loginData),
        credentials:    'include'  // Important for cookie handling

    })
    .then(response => response.json())
    .then(data => {
        console.log("Server response - data ", data);
        console.log("cookies", data.cookie);
        if (data.success) {
            // If login is successful
            alert("Login successful! laaaa walooo ");

            // Example usage after logging in
            const jwtToken = getCookie('JWT_token');
            console.log("JWT Token from cookies:", jwtToken);

            // localStorage.setItem("token", data.token); // Store token (if using JWT)
            navigateTo('/home'); // Redirect to dashboard or another protected page
        } else {
            // If login fails, display error message
            console.log("Login failed:", response);
            alert("Login failed: " + data.message);
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("An error occurred while logging in. Please try again later.");
    });
}


// Function to handle the signup form submission
function handleSignup(event) {
    event.preventDefault(); // Prevent the default form submission

    // Get the values from the form
    const username = document.getElementById('username').value;
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const password_confirm = document.getElementById('password-confirm').value;

    // Prepare the data to be sent
    const data = {
        username: username,
        first_name: firstName,
        last_name: lastName,
        email: email,
        password: password,
        password_confirm: password_confirm
    };

    // Send a POST request to the server
    fetch('http://127.0.0.1:8000/register/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('Signup successful:', data);
        alert('Signup successful! Please login to continue.');
        navigateTo('/login');
        // Optionally redirect or display a success message
    })
    .catch(error => {
        console.error('Signup error:', error);
    });
}



  function renderHomePage() {
    // Set up the main structure with placeholders
    appContainer.innerHTML = `
        <div id="topBar" class="top-bar"></div>
        <div id="mainContent" class="bodyElement"></div>
        <div id="leftSidebar" class="bodyElement"></div>
        <button id="logoutButton" class="logout-btn">Logout</button> <!-- Logout button -->
    `;

    // Render top bar, main content, and user profile into placeholders
    renderTopBar();
    renderLeftSidebar();
    renderMainContent();
    renderUserProfile();
    
    const logoutButton = document.querySelector('#logoutButton');
    logoutButton.addEventListener('click', hanleLogoutBtn);
}




    // Add click event listener to the "Play Now" button
function hanleLogoutBtn(event){
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
            navigateTo('/login');   // Redirect to login page
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
    }

// Call renderHomePage to initialize the entire page

function renderUserProfile() {
    fetch('http://127.0.0.1:8000/users/me', {
        method: 'GET',
        credentials: 'include',  // Important for cookie handling
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(userData => {
        // Access userData after the promise has resolved
        document.querySelector('.username').textContent = userData.username;
        document.querySelector('.user-avatar img').src = userData.profile_picture;
    })
    .catch(error => {
        console.error('Error fetching user profile:', error);
    });
}

