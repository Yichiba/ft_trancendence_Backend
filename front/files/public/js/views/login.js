import { navigateTo } from '../router.js';
import { renderForgotPassword } from './forgot_password.js';

// Function to render the login page
export function renderLoginPage(appContainer) {
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
        <a href="/remotelogin" class="button"  navigateTo(/remote)>Login With 42</a>
        <div class="link-container">
            <a href="/signup" onclick="navigateTo('/signup', appContainer); return false;" class="link">Sign Up</a>
            <button id='forget-btn' class="link">Forgot Password?</button>
        </div>

    `;
    document.getElementById('loginForm').addEventListener('submit', (event) => handleLogin(event, appContainer));
    document.getElementById('forget-btn').addEventListener('click', (event) => renderForgotPassword(appContainer));
}


//f
export function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}





async function handleLogin(event,appContainer) {
    event.preventDefault(); // Prevent the form from refreshing the page
    // navigateTo('/home'); // Redirect to dashboard or another protected page

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
    fetch(window.self.origin + "/backend/login/", {  // Replace with your API endpoint
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(loginData),
        credentials:    'include'  // Important for cookie handling

    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log("Server response - data ", data);
            console.log("data.redirect ", data.redirect);
            if (data.redirect)  {
                alert("You are redircted to 2fa authentications  !");
                navigateTo(data.redirect, appContainer);
            }
            else{
                alert("You are Logged In  !");
                console.log("logggged in ");
                console.log("data.user",data.user);
                localStorage.setItem('me', JSON.stringify(data.user));

                navigateTo('/home',appContainer); // Redirect to dashboard or another protected page
            }
        } else {
            // If login fails, display error message
            alert("Login failed: " + data.error);
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("An error occurred while logging in. Please try again later.");
    });
}


// Function to render the login page
function login(appContainer) {
  ;
    document.getElementById('loginForm').addEventListener('submit', (event) => handleLogin(event, appContainer));
    document.getElementById('forget-btn').addEventListener('click', (event) => renderForgotPassword(appContainer));
}