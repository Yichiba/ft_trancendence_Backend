
import { router } from './router.js';
import {initializeUI} from './ui.js';





initializeUI();

// Select the main app container
// const appContainer = document.getElementById('app');
const appContainer = document.getElementById('app'); // Use the correct ID or selector



// Handle back/forward navigation
window.addEventListener('popstate', () => router(appContainer));
// Initial render based on the URL
console.log('Navigating to:', window.location.pathname);
router(appContainer);
