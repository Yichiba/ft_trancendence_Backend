import { navigateTo } from '../router.js';



// Function to render the signup page
export function renderSignUpPage(appContainer) {
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
document.getElementById('signupForm').addEventListener('submit', (event) => handleSignup(event, appContainer));
}













// Function to handle the signup form submission
function handleSignup(event, appContainer) {    
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
    console.log('Signup data:', data);
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
        navigateTo('/login',appContainer);
        // Optionally redirect or display a success message
    })
    .catch(error => {
        console.error('Signup error:', error);
    });
}



// return Response({'success': True,'message': '2fa required.', 'redirect': redirect_url}, status=status.HTTP_200_OK)
