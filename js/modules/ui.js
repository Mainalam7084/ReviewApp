/**
 * UI Module
 * Handles DOM updates and Event Listeners
 */
import { Auth } from './auth.js';
import { Storage } from './storage.js';

export const UI = {
    initLanding: () => {
        const authModal = document.getElementById('auth-modal');
        const loginForm = document.getElementById('login-form');
        const signupForm = document.getElementById('signup-form');
        const navLoginBtn = document.getElementById('nav-login-btn');
        const navSignupBtn = document.getElementById('nav-signup-btn');
        const heroCta = document.getElementById('hero-cta');
        const closeModalBtn = document.getElementById('close-modal');
        const switchToSignup = document.getElementById('switch-to-signup');
        const switchToLogin = document.getElementById('switch-to-login');

        if (!authModal) return;

        const openModal = (mode = 'login') => {
            authModal.classList.add('active');
            if (mode === 'signup') {
                loginForm.classList.add('hidden');
                signupForm.classList.remove('hidden');
            } else {
                signupForm.classList.add('hidden');
                loginForm.classList.remove('hidden');
            }
        };

        const closeModal = () => {
            authModal.classList.remove('active');
        };

        // Event Listeners
        navLoginBtn?.addEventListener('click', () => openModal('login'));
        navSignupBtn?.addEventListener('click', () => openModal('signup'));
        heroCta?.addEventListener('click', () => openModal('signup'));
        closeModalBtn?.addEventListener('click', closeModal);

        authModal.addEventListener('click', (e) => {
            if (e.target === authModal) closeModal();
        });

        switchToSignup?.addEventListener('click', () => {
            loginForm.classList.add('hidden');
            signupForm.classList.remove('hidden');
        });

        switchToLogin?.addEventListener('click', () => {
            signupForm.classList.add('hidden');
            loginForm.classList.remove('hidden');
        });

        signupForm?.addEventListener('submit', (e) => {
            e.preventDefault();
            const inputs = signupForm.querySelectorAll('input');
            const result = Auth.signup(inputs[0].value, inputs[1].value, inputs[2].value);

            if (result.success) {
                window.location.href = 'dashboard.html';
            } else {
                alert(result.message);
            }
        });

        loginForm?.addEventListener('submit', (e) => {
            e.preventDefault();
            const inputs = loginForm.querySelectorAll('input');
            const result = Auth.login(inputs[0].value, inputs[1].value);

            if (result.success) {
                window.location.href = 'dashboard.html';
            } else {
                alert(result.message);
            }
        });
    },

    initDashboard: () => {
        const currentUser = Auth.checkAuth();
        if (!currentUser) return;

        const userGreeting = document.getElementById('user-greeting');
        const logoutBtn = document.getElementById('logout-btn');
        const addForm = document.getElementById('add-restaurant-form');
        const restaurantList = document.getElementById('restaurant-list');
        const totalCount = document.getElementById('total-count');

        if (userGreeting) userGreeting.textContent = `Welcome, ${currentUser.name}`;

        logoutBtn?.addEventListener('click', () => Auth.logout());

        const renderRestaurants = () => {
            const restaurants = Storage.getRestaurants(currentUser.id);
            if (totalCount) totalCount.textContent = restaurants.length;

            if (restaurants.length === 0) {
                restaurantList.innerHTML = `
                    <div class="empty-state">
                        <div style="font-size: 3rem; margin-bottom: 1rem;">🍽️</div>
                        <h3>No restaurants yet</h3>
                        <p>Start adding places you've visited to build your collection.</p>
                    </div>`;
                return;
            }

            restaurantList.innerHTML = restaurants.map(r => `
                <div class="glass-card restaurant-card" style="padding: 1.5rem;">
                    <div style="display: flex; justify-content: space-between; align-items: start;">
                        <h3 style="font-size: 1.25rem; margin-bottom: 0.5rem;">${r.name}</h3>
                        <div class="rating-stars">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</div>
                    </div>
                    <p style="color: var(--text-muted); margin-bottom: 1rem; font-size: 0.9rem;">
                        <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(r.location)}" 
                           target="_blank" class="map-link">
                           📍 ${r.location}
                        </a>
                    </p>
                    <p style="margin-bottom: 1rem; font-style: italic; color: var(--text-light); opacity: 0.9;">
                        "${r.review}"
                    </p>
                    <div style="text-align: right;">
                        <button data-id="${r.id}" class="delete-btn"
                                style="background: none; border: none; color: var(--accent); cursor: pointer; font-size: 0.8rem; opacity: 0.7;">
                            Remove
                        </button>
                    </div>
                </div>
            `).join('');

            // Re-attach delete listeners since we replaced innerHTML
            document.querySelectorAll('.delete-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const id = e.target.dataset.id;
                    if (confirm('Are you sure you want to remove this memory?')) {
                        const currentList = Storage.getRestaurants(currentUser.id);
                        const newList = currentList.filter(r => r.id !== id);
                        Storage.saveRestaurants(currentUser.id, newList);
                        renderRestaurants();
                    }
                });
            });
        };

        addForm?.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('rest-name').value;
            const location = document.getElementById('rest-location').value;
            const rating = parseInt(document.getElementById('rest-rating').value);
            const review = document.getElementById('rest-review').value;

            const newRestaurant = {
                id: Date.now().toString(),
                name,
                location,
                rating,
                review,
                date: new Date().toISOString()
            };

            const restaurants = Storage.getRestaurants(currentUser.id);
            restaurants.unshift(newRestaurant);
            Storage.saveRestaurants(currentUser.id, restaurants);

            addForm.reset();
            renderRestaurants();
        });

        renderRestaurants();
    }
};
