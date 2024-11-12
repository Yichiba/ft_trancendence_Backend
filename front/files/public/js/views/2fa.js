import { navigateTo } from '../router.js';
import { fetch_users } from './leftside.js';

export function renderOtpInput(appContainer) {
    console.log('from renderOtpInput');
    console.log(appContainer instanceof HTMLElement ,appContainer);


    const token = getTokenFromUrl();
    console.log('Token:', token);
    fetchTwoFAData(token, appContainer);
}

function getTokenFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('token');
}

function fetchTwoFAData(token, appContainer) {
    console.log('from fetchTwoFAData');
    console.log(appContainer instanceof HTMLElement ,appContainer);


    fetch(`${window.self.origin}/backend/2fa/?token=${token}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch 2FA data');
        }
        return response.json();
    })
    .then(data => {
        console.log('Response Data:', data);
        renderOtpInterface(data, appContainer, token);
    })
    .catch(error => {
        console.error('Error fetching 2FA data:', error);
        alert('Failed to load 2FA setup. Please try again.');
    });
}




function renderOtpInterface(data, appContainer, token) {
    console.log('from renderOtpInterface');
    console.log(appContainer instanceof HTMLElement ,appContainer);

    
    const is2FAEnabled = data.is2FAEnabled;
    const qrCodeURL = data.qr_code || '';

     const appHTML= `
        <div class="twofa-view">
            <div class="twofa-container">
                <h2>Two-Factor Authentication</h2>
                ${!is2FAEnabled ? `
                    <p>Scan this QR code with your authenticator app:</p>
                    <div class="qr-container">
                        <img src="${qrCodeURL}" alt="2FA QR Code" width="200" height="200">
                    </div>
                ` : ''}
                <div class="otp-section">
                <input 
                type="text" 
                id="otp-input" 
                class="otp-input" 
                maxlength="6" 
                placeholder="Enter OTP" 
                pattern="[0-9]*" 
                inputmode="numeric"
                >
                <br>
                </div>
                ${!is2FAEnabled ? `
                    <button id="otp-submit-button" class="verify-btn">Enable 2FA</button>
                    ` : ''}
                    ${is2FAEnabled && !token ?`
                        <button id="otp-submit-button" class="verify-btn">Disable 2FA</button>
                        ` : ''}
                        ${is2FAEnabled && token ?`
                            <button id="otp-submit-button" class="verify-btn">Verify</button>
                            ` : ''}
                        <button id="cancel-otp-btn" class="verify-btn">Cancel</button>
                            </div>
                </div>
                `;
    document.getElementById('app').innerHTML = appHTML;


    console.log("appContainer  1 ", appContainer instanceof HTMLElement);

    // document.getElementById('otp-submit-button').innerHTML = appContainer.innerHTML;

    setupOtpSubmission(token, appContainer);
}

function setupOtpSubmission(token, appContainer) {
    console.log('from setupOtpSubmission');

    // console.log('Token:',appContainer.innerHTML);
    const otpSubmitButton = document.getElementById('otp-submit-button');
    const CancelButton = document.getElementById('cancel-otp-btn');
    const otpInput = document.getElementById('otp-input');
    if (!otpSubmitButton || !otpInput) {
        console.error('OTP elements not found');
        return;
    }

    // Add input validation
    otpInput.addEventListener('input', (e) => {
        // Only allow numbers
        e.target.value = e.target.value.replace(/[^0-9]/g, '');
    });

    otpSubmitButton.addEventListener('click', function() {
        const otp = otpInput.value;

        if (!otp) {
            alert('Please enter the OTP.');
            return;
        }

        if (otp.length !== 6) {
            alert('Please enter a 6-digit OTP code.');
            return;
        }

        verifyOtp(token, otp, appContainer);
    });
    
    CancelButton.addEventListener('click', function() {
        navigateTo('/profile/edit', appContainer);
    });
}
function verifyOtp(token, otp, appContainer) {
    console.log('from verifyOtp');
    console.log('Token:', token);
    fetch(`${window.self.origin}/backend/2fa/?token=${token}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ otp }),
        credentials: 'include'
    })
    .then(response => {
        console.log('Response:', response);
        return response.json().then(result => ({ status: response.status, ...result }));
    })
    .then(({ status, message ,user}) => {
        console.log('Status:', status);
        console.log('message:', message);
        console.log('user:', user);
        if (status === 200) {
            alert(message);
            if (message === "Logged in succesfully") {
                console.log("before navigateTo");
                localStorage.setItem('me', JSON.stringify(user));
                navigateTo('/home', appContainer);
            }
            else if (message === "2FA enabled") {
                alert("2FA enabled successfully.");// Redirect to home page
                navigateTo('/profile/edit', appContainer);
            }
            else if (message === "2FA disabled") {
                alert("2FA disabled successfully.");
                navigateTo('/profile/edit', appContainer);// Redirect to home page
            }else if (message === "Invalid OTP") {
            alert("Invalid OTP. Please try again.");
            } else if (message === "OTP is required") {
            alert("OTP is required. Please enter your OTP.");
            } 
        }
        else {
            alert("Unexpected response from the server.");
        }
    })
    .catch(error => {
        console.error('There was an error with the OTP verification:', error);
        alert('An error occurred. Please try again.');
    });
}



// Assuming you have this helper function
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}