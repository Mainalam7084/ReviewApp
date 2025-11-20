/**
 * Auth Module
 * Handles login, signup, and logout logic
 */
import { Storage } from './storage.js';

export const Auth = {
    login: (email, password) => {
        const user = Storage.getUser(email);
        if (user && user.password === password) {
            Storage.setCurrentUser(user);
            return { success: true };
        }
        return { success: false, message: 'Invalid email or password' };
    },

    signup: (name, email, password) => {
        if (Storage.getUser(email)) {
            return { success: false, message: 'User already exists!' };
        }

        const user = {
            id: Date.now().toString(),
            name,
            email,
            password
        };

        Storage.saveUser(user);
        Storage.setCurrentUser(user);
        return { success: true };
    },

    logout: () => {
        Storage.removeCurrentUser();
        window.location.href = 'index.html';
    },

    checkAuth: () => {
        return Storage.getCurrentUser();
    },

    requireAuth: () => {
        if (!Storage.getCurrentUser()) {
            window.location.href = 'index.html';
            return false;
        }
        return true;
    },

    redirectIfAuthenticated: () => {
        if (Storage.getCurrentUser()) {
            window.location.href = 'dashboard.html';
            return true;
        }
        return false;
    }
};
