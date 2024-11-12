


export async function renderPasswordReset(appContainer,token) {
    appContainer.innerHTML = `
      <div class="new-password-container">
        <h2>Reset Password</h2>
        <p>Enter the verification code sent to your email</p>
        <form class="forgot-form" onsubmit="handlePasswordReset(event, appContainer, token)">
          <div class="password-field">
            <input 
              type="password" 
              id="newPassword"
              placeholder="Enter new password" 
              required
            >
          </div>
          <button type="submit">Reset Password</button>
        </form>
      </div>
    `;
    appContainer.classList.remove('background-container');
}

function handlePasswordReset(event,appContainer,token) {
  event.preventDefault();
  const newPassword = document.getElementById('newPassword').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  
  if(newPassword !== confirmPassword) {
    alert('Passwords do not match!');
    return;
  }
  
  //('Resetting password...');
  
  const container = document.querySelector('.new-password-container');
  container.innerHTML = `
    <h2>Password Changed Successfully!</h2>
    <p>Your password has been updated. You can now login with your new password.</p>
    <a href="/login" class="btn btn-play" style="display: inline-block; margin-top: 1rem;">
      Go to Login
    </a>
  `;
}





// export function renderPasswordReset(appContainer) {
//     appContainer.innerHTML = `
//       <div class="new-password-container">
//         <h2>Reset Password</h2>
//         <p>Enter the verification code sent to your email</p>
//         <form class="forgot-form" onsubmit="handlePasswordReset(event)">
//           <div class="otp-section">
//             <input 
//               type="text" 
//               class="verification-code" 
//               maxlength="6" 
//               pattern="[0-9]{6}" 
//               placeholder="Enter 6-digit code"
//               required
//             >
//           </div>
          
//           <div class="password-field">
//             <input 
//               type="password" 
//               id="newPassword"
//               placeholder="Enter new password" 
//               required
//               onkeyup="checkPasswordStrength(this.value)"
//             >
//             <button type="button" class="toggle-password" onclick="togglePassword('newPassword')">👁️</button>
//           </div>
          
//           <div class="password-strength">
//             <div class="strength-meter"></div>
//           </div>
          
//           <button type="submit">Reset Password</button>
//         </form>
        
//         <a href="#" class="resend-code" onclick="resendCode(event)">
//           Resend verification code
//         </a>
//       </div>
//     `;
//     appContainer.classList.remove('background-container');
// }

export function renderForgotPassword(appContainer) {
  appContainer.innerHTML = `
  <div class="forgot-password-container">
      <h2>Forgot Password</h2>
      <p>Enter your email address or username to reset your password</p>
      
      <form class="forgot-form" id="forgot-form">
          <input type="text" id="identifier-input" placeholder="Enter your email or username" required>
          <button id='enter-email' type="submit">Find me</button>
      </form>
      
      <a href="/login" class="back-to-login">Back to Login</a>
  </div>
  `;
  
  appContainer.classList.remove('background-container');
  //('Forgot password page rendered');

  // Attach the event listener to the form
  document.getElementById('forgot-form').addEventListener('submit', (event) => handleForgotPassword(event, appContainer));
}

// return Response({'success':True, 'data' : "check your Email ", '2FA' :user.auth_2fa},status=200)



async function handleForgotPassword(event, appContainer) {
  event.preventDefault(); // Prevent form from redirecting
  const email = document.getElementById('identifier-input').value;

  //check if the identifier is a username or email address
 
    //('Password reset requested for email:', email);
    
    
    const response = await fetch(window.self.origin +'/backend' + 'forgot/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({email : email})
    });
    const data = await response.json();

    if( data['success'] == false){
      alert(data.error);
      return;

    }else{
        const container = document.querySelector('.forgot-password-container');

        container.innerHTML = `
            <h2>Check Your Email</h2>
            <p>We've sent password resetsssssssss instructions to the email associated with: ${email}</p>
            <a href="/login" class="back-to-login">Back to Login</a>
        `;
      }
}