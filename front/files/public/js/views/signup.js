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
async function handleSignup(event, appContainer) {    
    event.preventDefault(); // Prevent the default form submission

    // Get the values from the form
    const username = document.getElementById('username').value;
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const password_confirm = document.getElementById('password-confirm').value;


    if (password !== password_confirm) {
        alert('Passwords do not match');
        return;
    }



    // Prepare the data to be sent
    const data = {
        username: username,
        first_name: firstName,
        last_name: lastName,
        email: email,
        password: password,
        password_confirm: password_confirm
    };
    //('Signup data:', data);
    // Send a POST request to the server
    const response = await fetch(`${window.location.origin}/backend/register/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    const Data = await response.json();

    if (!response.ok) {
        //('Signup failed:', Data.message); // Log the structure of Data.message
    
        // Check if Data.message is an object with field-specific errors
        if (typeof Data.message === 'object' && Data.message !== null) {
            // Iterate over each field's error messages
            Object.keys(Data.message).forEach((field) => {
                Data.message[field].forEach((error) => {
                   if (field === 'username') {
                        alert('Username error: ' + error);
                    }
                    if (field === 'email') {
                        alert('Email error: ' + error);
                    }
                    
                    if (field === 'password') {
                        alert('Password error: ' + error);
                    }
                });
            });
        } else if (typeof Data.message === 'string') {
            // If Data.message is a simple error message
            alert(Data.message);
        }
        return;
    }
    
    // Success case
    alert(Data.message);
    navigateTo('/login', appContainer);
    
}



// return Response({'success': True,'message': '2fa required.', 'redirect': redirect_url}, status=status.HTTP_200_OK)
