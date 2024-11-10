import { renderLoginPage } from './views/login.js';
import { renderSignUpPage } from './views/signup.js';
import { renderHomePage } from './views/home.js';
import {  sendCodeOauth} from './views/login_with_42.js';
import { renderOtpInput} from './views/2fa.js';
import { loadProfilePage } from './views/profile.js';
import { renderEditProfile } from './views/updateProfile.js';
import { renderPasswordReset } from './views/forgot_password.js';
import { renderChatView } from './views/chat.js';


// Router function to render the correct view based on URL path
export function router(appContainer) {
    console.log('from router');



    
    console.log('Navigating to aaa :', window.location.pathname);
    const path = window.location.pathname;


    appContainer.classList.remove('background-container');

    if (path === '/login' || path === '/signup') {
        appContainer.classList.add('background-container'); // Apply background only on login/signup
    }

    appContainer.innerHTML = ''; // Clear the container before rendering new content
    if (path === '/login') {
        renderLoginPage(appContainer);
    }else if (path.startsWith('/resetpassword')) {
        const token = path.match(/^\/resetpassword\/([^/]+)$/);
        if (token) {
            renderPasswordReset(appContainer,token[1]);
        } else {
            // appContainer.innerHTML = '<h1>404 Not Found</h1>'; // Render a 404 page
            renderPasswordReset(appContainer)
        }


        renderPasswordReset(appContainer)
    }else if (path === '/callback') {
        sendCodeOauth(appContainer);
    }else if (path === '/profile/edit') {
        loadProfilePage(appContainer, 'me');
        renderEditProfile(appContainer);
    }else if (path.startsWith('/profile')) {
        const profileMatch = path.match(/^\/profile\/([^/]+)$/);
        console.log('profileMatch',profileMatch);
        if (profileMatch) {

            loadProfilePage(appContainer, profileMatch[1]);  // Load profile for specified user
        } else {
            console.log('fromrouteeeeeeeeeeeeeeerererererrererrerrererrerererrerere!!!!!!!!!!!!!!!!!! profile');
            loadProfilePage(appContainer,'me');  // Default profile page for current user
        }
    }else if (path.startsWith('/chat')) {
        const profileMatch = path.match(/^\/profile\/([^/]+)$/);
        
        if (profileMatch) {
            renderChatView(appContainer, profileMatch[1]);  // Load profile for specified user
        } else {
            // appContainer.innerHTML = '<h1>404 Not Found</h1>'; // Render a 404 page
            renderChatView(appContainer,'me');  // Default profile page for current user
        }
    }else if (path === '/2fa/') {
        console.log('in my way to  2fa');
        renderOtpInput(appContainer);
    }else if (path === '/remotelogin') {
        window.location.href = 'http://127.0.0.1:8000/login/42/';
    } else if (path === '/signup') {
        renderSignUpPage(appContainer);
    } else if (path === '/home') {
        renderHomePage(appContainer);
    } else {
        appContainer.innerHTML = '<h1>404 Not Found</h1>'; // Render a 404 page
    }
}

// Function to handle navigation and update URL path
export function navigateTo(path,appContainer) {
    window.history.pushState({}, '', path);
    router(appContainer);
}