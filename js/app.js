// ============================================
// ShoreSquad - Main Application
// ============================================

/**
 * ShoreSquad App
 * A beach cleanup coordination platform with weather tracking,
 * crew management, and impact metrics
 */

class ShoreSquadApp {
    constructor() {
        this.crews = [];
        this.userProfile = null;
        this.currentLocation = null;
        this.init();
    }

    /**
     * Initialize the application
     */
    init() {
        this.setupEventListeners();
        this.loadUserProfile();
        this.loadMockCrews();
        this.registerServiceWorker();
        console.log('🌊 ShoreSquad initialized');
    }

    /**
     * Setup all event listeners
     */
    setupEventListeners() {
        // Hero CTA
        const getStartedBtn = document.getElementById('get-started-btn');
        if (getStartedBtn) {
            getStartedBtn.addEventListener('click', () => this.scrollToSection('crews'));
        }

        // Crew management
        const createCrewBtn = document.getElementById('create-crew-btn');
        if (createCrewBtn) {
            createCrewBtn.addEventListener('click', () => this.openCreateCrewModal());
        }

        const crewSearch = document.getElementById('crew-search');
        if (crewSearch) {
            crewSearch.addEventListener('input', (e) => this.filterCrews(e.target.value));
        }

        // Weather
        const getWeatherBtn = document.getElementById('get-weather-btn');
        if (getWeatherBtn) {
            getWeatherBtn.addEventListener('click', () => this.getWeather());
        }

        // Profile
        const profileForm = document.getElementById('profile-form');
        if (profileForm) {
            profileForm.addEventListener('submit', (e) => this.handleProfileSubmit(e));
        }
    }

    /**
     * Scroll to a specific section
     */
    scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    /**
     * Load user profile from localStorage
     */
    loadUserProfile() {
        const stored = localStorage.getItem('shorequad_user');
        if (stored) {
            this.userProfile = JSON.parse(stored);
            this.updateProfileUI();
        }
    }

    /**
     * Save user profile to localStorage
     */
    saveUserProfile() {
        if (this.userProfile) {
            localStorage.setItem('shorequad_user', JSON.stringify(this.userProfile));
            this.updateProfileUI();
        }
    }

    /**
     * Handle profile form submission
     */
    handleProfileSubmit(event) {
        event.preventDefault();

        const username = document.getElementById('username').value.trim();
        const email = document.getElementById('email').value.trim();

        if (!username || !email) {
            alert('Please fill in all fields');
            return;
        }

        this.userProfile = {
            username,
            email,
            joinedDate: new Date(),
            cleanups: 0,
            crewMembers: 0,
            trashCollected: 0
        };

        this.saveUserProfile();
        alert('✅ Profile saved! Welcome to ShoreSquad!');
        event.target.reset();
    }

    /**
     * Update profile UI with user data
     */
    updateProfileUI() {
        if (!this.userProfile) return;

        const profileName = document.getElementById('profile-name');
        const profileStatus = document.getElementById('profile-status');
        const statsContainer = document.getElementById('profile-stats');

        if (profileName) {
            profileName.textContent = `🏄 ${this.userProfile.username}`;
        }

        if (profileStatus) {
            profileStatus.textContent = `Member since ${new Date(this.userProfile.joinedDate).toLocaleDateString()}`;
        }

        if (statsContainer) {
            statsContainer.innerHTML = `
                <div class="stat">
                    <span class="stat-number">${this.userProfile.cleanups}</span>
                    <span class="stat-label">Cleanups</span>
                </div>
                <div class="stat">
                    <span class="stat-number">${this.userProfile.crewMembers}</span>
                    <span class="stat-label">Crew Members</span>
                </div>
                <div class="stat">
                    <span class="stat-number">${this.userProfile.trashCollected} kg</span>
                    <span class="stat-label">Trash Collected</span>
                </div>
            `;
        }
    }

    /**
     * Load mock crew data
     */
    loadMockCrews() {
        this.crews = [
            {
                id: 1,
                name: 'Ocean Warriors',
                description: 'Dedicated to keeping our beaches pristine',
                location: 'Santa Monica Beach',
                members: 24,
                nextCleanup: '2025-12-08',
                image: '🌊'
            },
            {
                id: 2,
                name: 'Coastal Cleanup Crew',
                description: 'Fun, energetic, and environmentally conscious',
                location: 'Huntington Beach',
                members: 18,
                nextCleanup: '2025-12-09',
                image: '🏖️'
            },
            {
                id: 3,
                name: 'Wave Riders for Earth',
                description: 'Combining our love of surfing with environmental action',
                location: 'Malibu Beach',
                members: 32,
                nextCleanup: '2025-12-07',
                image: '🏄'
            },
            {
                id: 4,
                name: 'Eco Squad',
                description: 'Young environmental activists making waves',
                location: 'Ventura Beach',
                members: 15,
                nextCleanup: '2025-12-10',
                image: '♻️'
            }
        ];

        this.renderCrews(this.crews);
    }

    /**
     * Render crews to the DOM
     */
    renderCrews(crewsToRender) {
        const crewsList = document.getElementById('crews-list');
        if (!crewsList) return;

        if (crewsToRender.length === 0) {
            crewsList.innerHTML = '<p class="no-results">No crews found. Why not create your own?</p>';
            return;
        }

        crewsList.innerHTML = crewsToRender.map(crew => `
            <article class="crew-card" role="region" aria-label="${crew.name} crew">
                <div style="font-size: 2rem; margin-bottom: 0.5rem;">${crew.image}</div>
                <h3>${crew.name}</h3>
                <p>${crew.description}</p>
                <p class="crew-members">📍 ${crew.location} • 👥 ${crew.members} members</p>
                <p class="crew-members">🗓️ Next cleanup: ${new Date(crew.nextCleanup).toLocaleDateString()}</p>
                <button 
                    class="btn btn-accent" 
                    aria-label="Join ${crew.name} crew"
                    onclick="app.joinCrew('${crew.name}')"
                >
                    Join Crew
                </button>
            </article>
        `).join('');
    }

    /**
     * Filter crews based on search input
     */
    filterCrews(searchTerm) {
        const filtered = this.crews.filter(crew =>
            crew.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            crew.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
            crew.description.toLowerCase().includes(searchTerm.toLowerCase())
        );

        this.renderCrews(filtered);
    }

    /**
     * Join a crew
     */
    joinCrew(crewName) {
        if (!this.userProfile) {
            alert('Please create your profile first!');
            this.scrollToSection('profile');
            return;
        }

        alert(`✅ You've joined ${crewName}! Time to make waves! 🌊`);

        // Update user stats
        this.userProfile.crewMembers++;
        this.saveUserProfile();
    }

    /**
     * Open create crew modal
     */
    openCreateCrewModal() {
        if (!this.userProfile) {
            alert('Please create your profile first!');
            this.scrollToSection('profile');
            return;
        }

        const crewName = prompt('What\'s your crew called?');
        if (!crewName) return;

        const description = prompt('Describe your crew\'s mission:');
        if (!description) return;

        const location = prompt('Where\'s your main beach?');
        if (!location) return;

        const newCrew = {
            id: this.crews.length + 1,
            name: crewName,
            description,
            location,
            members: 1,
            nextCleanup: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            image: '🌊'
        };

        this.crews.unshift(newCrew);
        this.renderCrews(this.crews);
        alert(`🎉 ${crewName} created! Invite your friends to join!`);
    }

    /**
     * Get user's location and weather
     */
    getWeather() {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser');
            return;
        }

        const weatherContainer = document.getElementById('weather-container');
        if (weatherContainer) {
            weatherContainer.innerHTML = '<p>📍 Getting your location...</p>';
        }

        navigator.geolocation.getCurrentPosition(
            (position) => this.fetchWeather(position.coords),
            (error) => this.handleGeolocationError(error)
        );
    }

    /**
     * Fetch weather data (mock API call)
     */
    fetchWeather(coords) {
        // Mock weather data (in production, call real weather API)
        const mockWeatherData = {
            temp: 22,
            condition: 'Sunny with light breeze',
            humidity: 65,
            windSpeed: 12,
            location: 'Santa Monica Beach'
        };

        this.displayWeather(mockWeatherData, coords);
    }

    /**
     * Display weather information
     */
    displayWeather(weather, coords) {
        const weatherContainer = document.getElementById('weather-container');
        if (!weatherContainer) return;

        weatherContainer.innerHTML = `
            <div class="weather-card">
                <p>📍 ${weather.location}</p>
                <div class="weather-temp">${weather.temp}°C</div>
                <p class="weather-description">${weather.condition}</p>
                <p style="margin-top: 1rem; font-size: 0.9rem; opacity: 0.9;">
                    💨 Wind: ${weather.windSpeed} km/h | 💧 Humidity: ${weather.humidity}%
                </p>
                <p style="margin-top: 1rem; font-size: 0.85rem; opacity: 0.8;">
                    <strong>Perfect beach cleanup weather!</strong> Get your crew together today!
                </p>
            </div>
        `;

        this.currentLocation = coords;
    }

    /**
     * Handle geolocation errors
     */
    handleGeolocationError(error) {
        const weatherContainer = document.getElementById('weather-container');
        if (weatherContainer) {
            weatherContainer.innerHTML = `
                <p>❌ Location access denied. Please enable location in your browser settings.</p>
                <button class="btn btn-secondary" onclick="app.getWeather()">Try Again</button>
            `;
        }
    }

    /**
     * Register Service Worker for offline functionality
     */
    registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('js/sw.js').catch((error) => {
                console.log('Service Worker registration failed:', error);
            });
        }
    }

    /**
     * Performance: Lazy load images
     */
    observeImages() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.src = entry.target.dataset.src;
                        observer.unobserve(entry.target);
                    }
                });
            });

            document.querySelectorAll('img[data-src]').forEach(img => imageObserver.observe(img));
        }
    }
}

// ============================================
// Initialize App When DOM is Ready
// ============================================

let app;

document.addEventListener('DOMContentLoaded', () => {
    app = new ShoreSquadApp();

    // Accessibility: Add focus trap for modals when needed
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            console.log('Escape pressed - handle modal close if needed');
        }
    });

    // Performance monitoring
    if ('PerformanceObserver' in window) {
        try {
            const observer = new PerformanceObserver((list) => {
                console.log('Performance Metrics:', list.getEntries());
            });
            observer.observe({ entryTypes: ['navigation', 'resource', 'paint'] });
        } catch (e) {
            console.log('Performance Observer not supported');
        }
    }
});

// ============================================
// Utility Functions
// ============================================

/**
 * Debounce function for search input optimization
 */
function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

/**
 * Format date helper
 */
function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

/**
 * Local Storage helper with error handling
 */
const StorageHelper = {
    set: (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.error('Storage error:', e);
        }
    },
    get: (key) => {
        try {
            return JSON.parse(localStorage.getItem(key));
        } catch (e) {
            console.error('Storage error:', e);
            return null;
        }
    },
    remove: (key) => {
        try {
            localStorage.removeItem(key);
        } catch (e) {
            console.error('Storage error:', e);
        }
    }
};

// ============================================
// Accessibility Helpers
// ============================================

/**
 * Announce to screen readers
 */
function announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.textContent = message;
    announcement.style.position = 'absolute';
    announcement.style.left = '-10000px';
    document.body.appendChild(announcement);

    setTimeout(() => announcement.remove(), 1000);
}
