import { fetch_users } from './leftside.js';
import {navigateTo} from '../router.js';
import { loadProfilePage } from './profile.js';


// Render the avatar section with upload button
function renderAvatarSection(user) {
  // //('from renderAvatarSection',user);
  return `
  <div class="avatar-edit-container">
  <img class="profile-avatar" id="profile-avatar" src="${user.profile_picture}" alt="${user.username}'s avatar" width="150" height="150">
  <div class="avatar-overlay">
  <label for="avatar-upload" class="avatar-upload-btn">
  📷
  <input type="file" id="avatar-upload" accept="image/*" style="display: none;">
  </label>
  </div>
  </div>
  `;
}

// Render the profile form with input fields and action buttons
function renderProfileForm(user) {
  return `
  <div class="profile-edit-form">
  <form id="edit-profile-form">
  <div class="form-row">
  ${renderFormInput('first_name', 'First Name', 'text',user.first_name  )}
  ${renderFormInput('last_name', 'Last Name', 'text', user.last_name)}
  </div>
  ${renderFormInput('username', 'Username', 'text', user.username)}
  ${renderFormInput('email', 'Email', 'email', user.email)}
  ${renderPasswordInput()}
  ${renderTwoFactorSwitch(user)}
  ${renderFormActions()}
  </form>
  </div>
  `;
}

// Helper function to render individual input fields
function renderFormInput(id, label, type, value) {
  return `
  <div class="form-group">
  <label for="${id}">${label}</label>
  <input type="${type}" id="${id}" required autocomplete="${label}" name="${id}" value="${value}" class="form-input">
  </div>
  `;
}

// Render the country select dropdown
function renderPasswordInput() {
  return `
  <div class="form-group">
  <label for="password">New Password</label>
  <input type="password" id="password" required autocomplete="new-password"name="password" class="form-input" placeholder="Enter new password">
  </div>
  `;
}


// Render the two-factor authentication switch
function renderTwoFactorSwitch(user) {
  //('from renderTwoFactorSwitch',user.is2FAEnabled);
  return `
    <div class="form-group">
      <label class="switch-label">
        Two-Factor Authentication
        <div class="switch-container">
          <input type="checkbox" id="2fa-toggle" class="switch-input" ${user.is2FAEnabled ? 'checked' : ''}>
          <span class="switch-slider"></span>
        </div>
      </label>
    </div>
  `;
}


// Render the form action buttons (Save and Cancel)
function renderFormActions(id, label, type) {
  return `
  <div class="form-actions">
  <button type="submit" class="btn btn-save">Save Changes</button>
  <button type="button" class="btn btn-cancel">Cancel</button>
  </div>
  `;
}

// Initialize event listeners
function initializeEditProfileEvents(user, appContainer) {
  document.getElementById('edit-profile-form').addEventListener('submit', handleEditProfileForm);
  document.getElementById('avatar-upload').addEventListener('change',(event) => handleAvatarUpload(event, appContainer));
  document.querySelector('.btn-cancel').addEventListener('click', () => navigateTo('/profile/', appContainer));
  document.getElementById('2fa-toggle').addEventListener('change', (event) => handleTwoFactorToggle(event ,appContainer));
}

// Dummy function for handling two-factor authentication toggle
function handleTwoFactorToggle(event,appContainer) {
  const isEnabled = event.target.checked;
  if (isEnabled) {
    //("Two-Factor Authentication enabled.");
    // Add logic here to enable 2FA (e.g., send a request to the server)
  } else {
    //("Two-Factor Authentication disabled.");
    // Add logic here to disable 2FA
  }
  navigateTo('/2fa/', appContainer);
}



async function handleEditProfileForm(event) {
  event.preventDefault();
  //("Form submitted");

  const user = JSON.parse(localStorage.getItem('me'));
  //("user",user);
  const form = event.target;
  const inputs = form.querySelectorAll('input');

  // Initialize FormData for submission
  const formData = new FormData();
  //("inputs",inputs);
  inputs.forEach(input => {
    if (input.name && input.value) {
      //(`{input.name} == ${input.value}`);
      if ((input.value != user[input.name]) ||input.type === 'password'){
        //("user[input.name]",user[input.name]);
        formData.append(input.name, input.type === 'checkbox' ? input.checked : input.value);
      }

    }
  });
  // //("Collected Form Data:", Object.fromEntries(formData));

  try {
    // Send form data to the server
    const response = await fetch(`${window.location.origin}/backend/users/me`, {
      method: 'POST',
      credentials: 'include', // Includes cookies for session management
      body: formData,
    });

    const data = await response.json();
    //("Server response data:", data);

    // Check for each field and display success/error messages
    for (const [field, result] of Object.entries(data)) {
      if (result && typeof result === 'object') {  // Check if result is an object (i.e., has success or error)
        if (result.success) {
          alert(`${field} updated successfully: ${result.success}`);
        } else if (result.error) {
          alert(`Error updating ${field}: ${result.error}`);
        }
      }
    }
    localStorage.removeItem('me');
    const respons = await fetch_users('me');
    const me = respons['user'];
    localStorage.setItem('me', JSON.stringify(me));
  } catch (error) {
    console.error("Error submitting form:", error);
    alert("There was an error submitting the form. Please try again.");
  }
}



async function handleAvatarUpload(event, appContainer) {
  //("from Avatar upload");

  const fileInput = event.target;
  const file = fileInput.files[0];
  const previewImage = document.getElementById('profile-avatar');
  const profileImage = document.getElementById('profile-picture');

  // Prepare FormData to send the image to the server
  const formData = new FormData();
  formData.append('profile_picture', file);

    const response = await fetch(`${window.location.origin}/backend/users/me`, {
      method: 'POST',
      credentials: 'include', // Includes cookies for session management
      body: formData,
    });

    const data = await response.json();
    if ('success' in data.profile_picture){

      // Preview the uploaded image
      if (previewImage && profileImage) {
        const fileURL = URL.createObjectURL(file);
        previewImage.src = fileURL;
        profileImage.src = fileURL;
      }
      alert(data.profile_picture.success);
      
    }
    else{
      alert("There was an error uploading your avatar. Please try again.");
    }

}



// Render the edit profile page
export async function renderEditProfile(appContainer) {
  //get user data
  const response = await fetch_users('me');
  const user = response['user'];
    const profileContainer = document.getElementById('profile-container');
    profileContainer.innerHTML = `
        <div class="profile-edit-wrapper">
            ${renderAvatarSection(user)}
            ${renderProfileForm(user)}
        </div>
    `;
    initializeEditProfileEvents(user,appContainer);
}