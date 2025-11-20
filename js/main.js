/**
 * Main Entry Point
 */
import { Auth } from './modules/auth.js';
import { UI } from './modules/ui.js';

document.addEventListener('DOMContentLoaded', () => {
    const isDashboard = window.location.pathname.includes('dashboard.html');

    if (isDashboard) {
        if (Auth.requireAuth()) {
            UI.initDashboard();
        }
    } else {
        if (!Auth.redirectIfAuthenticated()) {
            UI.initLanding();
        }
    }
});
