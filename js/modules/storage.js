/**
 * Storage Module
 * Handles all interactions with localStorage
 */

export const Storage = {
    // User Management
    getUser: (email) => {
        const user = localStorage.getItem(`user_${email}`);
        return user ? JSON.parse(user) : null;
    },

    saveUser: (user) => {
        localStorage.setItem(`user_${user.email}`, JSON.stringify(user));
    },

    getCurrentUser: () => {
        const user = localStorage.getItem('currentUser');
        return user ? JSON.parse(user) : null;
    },

    setCurrentUser: (user) => {
        localStorage.setItem('currentUser', JSON.stringify(user));
    },

    removeCurrentUser: () => {
        localStorage.removeItem('currentUser');
    },

    // Restaurant Management
    getRestaurants: (userId) => {
        const data = localStorage.getItem(`restaurants_${userId}`);
        return data ? JSON.parse(data) : [];
    },

    saveRestaurants: (userId, restaurants) => {
        localStorage.setItem(`restaurants_${userId}`, JSON.stringify(restaurants));
    }
};
