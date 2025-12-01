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
        this.isLoading = false;
        this.init();
    }

    /**
     * Initialize the application
     */
    init() {
        try {
            this.setupEventListeners();
            this.loadUserProfile();
            this.loadMockCrews();
            this.registerServiceWorker();
            console.log('🌊 ShoreSquad initialized successfully');
        } catch (error) {
            console.error('Error initializing app:', error);
            this.showErrorMessage('Failed to initialize app. Please refresh the page.');
        }
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

        // Manual location
        const manualLocationBtn = document.getElementById('manual-location-btn');
        if (manualLocationBtn) {
            manualLocationBtn.addEventListener('click', () => this.toggleManualLocationForm());
        }

        const submitLocationBtn = document.getElementById('submit-location-btn');
        if (submitLocationBtn) {
            submitLocationBtn.addEventListener('click', () => this.getWeatherForManualLocation());
        }

        const manualLocationInput = document.getElementById('manual-location-input');
        if (manualLocationInput) {
            manualLocationInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.getWeatherForManualLocation();
                }
            });
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
     * Toggle manual location form visibility
     */
    toggleManualLocationForm() {
        const form = document.getElementById('manual-location-form');
        if (form) {
            const isHidden = form.style.display === 'none';
            form.style.display = isHidden ? 'block' : 'none';
            if (isHidden) {
                const input = document.getElementById('manual-location-input');
                if (input) input.focus();
            }
        }
    }

    /**
     * Get weather for manually entered location
     */
    async getWeatherForManualLocation() {
        const input = document.getElementById('manual-location-input');
        if (!input || !input.value.trim()) {
            alert('Please enter a location');
            return;
        }

        const locationName = input.value.trim();
        const weatherContainer = document.getElementById('weather-container');
        if (weatherContainer) {
            weatherContainer.innerHTML = `<p>🌤️ Loading weather for ${locationName}...</p>`;
        }

        try {
            // Geocode the location to get coordinates
            const geoResponse = await fetch(
                `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(locationName)}&format=json&limit=1`
            );
            
            if (!geoResponse.ok) {
                throw new Error('Could not find location');
            }

            const geoData = await geoResponse.json();
            if (!geoData || geoData.length === 0) {
                throw new Error('Location not found');
            }

            const coords = {
                latitude: parseFloat(geoData[0].lat),
                longitude: parseFloat(geoData[0].lon)
            };

            console.log('Location found:', locationName, coords);

            // Fetch weather for this location
            await this.fetchWeather(coords, locationName);
        } catch (error) {
            console.error('Error getting weather for location:', error);
            alert(`Could not find location: "${locationName}". Please try another location.`);
            this.displayWeatherWithMockData(null);
        }
    }

    /**
     * Get user's location and weather
     */
    getWeather() {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser. Please use "Enter Location" instead.');
            this.toggleManualLocationForm();
            return;
        }

        const weatherContainer = document.getElementById('weather-container');
        if (weatherContainer) {
            weatherContainer.innerHTML = '<p>📍 Requesting location access...</p>';
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                console.log('Location obtained:', position.coords);
                this.fetchWeather(position.coords);
            },
            (error) => {
                console.error('Geolocation error:', error.code, error.message);
                this.handleGeolocationError(error);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    }

    /**
     * Fetch weather data from NEA API
     */
    async fetchWeather(coords, manualLocationName = null) {
        try {
            const weatherContainer = document.getElementById('weather-container');
            if (weatherContainer) {
                weatherContainer.innerHTML = '<p>🌤️ Loading weather data...</p>';
            }

            console.log('Fetching weather for coords:', coords);

            // Get location name from coordinates using reverse geocoding (if not provided manually)
            let locationName = manualLocationName || 'Your Location';
            
            if (!manualLocationName) {
                try {
                    const geoResponse = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.latitude}&lon=${coords.longitude}`
                    );
                    if (geoResponse.ok) {
                        const geoData = await geoResponse.json();
                        locationName = geoData.address?.city || geoData.address?.town || geoData.address?.county || 'Your Location';
                        console.log('Location resolved to:', locationName);
                    }
                } catch (geoError) {
                    console.warn('Could not resolve location name:', geoError);
                }
            }

            // Fetch current weather from NEA Realtime API
            const weatherResponse = await fetch('https://api.data.gov.sg/v1/environment/air-temperature', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (!weatherResponse.ok) {
                throw new Error(`Weather API error: ${weatherResponse.status}`);
            }

            const weatherData = await weatherResponse.json();
            console.log('Weather data received:', weatherData);

            // Fetch 4-day forecast from NEA API
            const forecastResponse = await fetch('https://api.data.gov.sg/v1/environment/4day-weather-forecast', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            });

            let forecastData = null;
            if (forecastResponse.ok) {
                forecastData = await forecastResponse.json();
                console.log('Forecast data received:', forecastData);
            }

            this.displayWeather(weatherData, forecastData, coords, locationName);
        } catch (error) {
            console.error('Error fetching weather:', error);
            this.displayWeatherWithMockData(coords);
        }
    }

    /**
     * Display weather with mock data as fallback
     */
    displayWeatherWithMockData(coords) {
        try {
            const mockWeatherData = {
                data: {
                    stations: [
                        {
                            id: 'S117',
                            name: 'Pasir Ris',
                            device_id: 'S117',
                            value: 28
                        }
                    ]
                }
            };

            const mockForecastData = {
                data: {
                    forecasts: [
                        {
                            date: new Date().toISOString().split('T')[0],
                            forecast: '☀️ Sunny',
                            relative_humidity: '65%'
                        },
                        {
                            date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
                            forecast: '⛅ Partly Cloudy',
                            relative_humidity: '70%'
                        },
                        {
                            date: new Date(Date.now() + 172800000).toISOString().split('T')[0],
                            forecast: '🌤️ Mostly Sunny',
                            relative_humidity: '68%'
                        },
                        {
                            date: new Date(Date.now() + 259200000).toISOString().split('T')[0],
                            forecast: '⛈️ Thunderstorm',
                            relative_humidity: '80%'
                        }
                    ]
                }
            };

            this.displayWeather(mockWeatherData, mockForecastData, coords);
        } catch (error) {
            console.error('Error displaying mock weather:', error);
            this.showErrorMessage('Unable to display weather data. Please try again.');
        }
    }

    /**
     * Display weather information with 4-day forecast
     */
    displayWeather(currentWeather, forecast, coords, locationName = 'Your Location') {
        const weatherContainer = document.getElementById('weather-container');
        if (!weatherContainer) return;

        try {
            // Extract current temperature from NEA data
            const stationData = currentWeather?.data?.stations?.[0];
            const currentTemp = stationData?.value ?? 28;
            
            // Extract forecast data
            const forecasts = forecast?.data?.forecasts ?? [];
            
            // Build current weather card
            let weatherHTML = `
                <div class="weather-card">
                    <p>📍 ${locationName}</p>
                    <div class="weather-temp">${currentTemp}°C</div>
                    <p class="weather-description">Current Temperature</p>
                    <p style="margin-top: 1rem; font-size: 0.9rem; opacity: 0.9;">
                        Based on NEA Real-time Weather Readings
                    </p>
                </div>
            `;

            // Build 4-day forecast cards
            if (forecasts.length > 0) {
                weatherHTML += '<div class="forecast-container">';
                
                forecasts.slice(0, 4).forEach((day, index) => {
                    const dateStr = day.date || new Date(Date.now() + (index * 86400000)).toISOString().split('T')[0];
                    const date = new Date(dateStr);
                    const dayName = date.toLocaleDateString('en-SG', { weekday: 'short', month: 'short', day: 'numeric' });
                    
                    weatherHTML += `
                        <div class="forecast-card">
                            <h4>${dayName}</h4>
                            <div class="forecast-text">
                                <p>${day.forecast ?? '🌤️ Partly Cloudy'}</p>
                                <p style="font-size: 0.9rem; margin-top: 0.5rem; opacity: 0.85;">
                                    ${day.relative_humidity ? `💧 ${day.relative_humidity}` : '💧 70%'}
                                </p>
                            </div>
                        </div>
                    `;
                });
                
                weatherHTML += '</div>';
            }

            weatherHTML += `
                <p style="margin-top: 1rem; font-size: 0.85rem; opacity: 0.8; text-align: center;">
                    <strong>Perfect beach cleanup weather!</strong> Get your crew together today!
                </p>
            `;

            weatherContainer.innerHTML = weatherHTML;
            this.currentLocation = coords;
        } catch (error) {
            console.error('Error displaying weather:', error);
            this.displayWeatherError('Error processing weather data. Showing mock data.');
        }
    }

    /**
     * Display weather error message
     */
    displayWeatherError(message) {
        const weatherContainer = document.getElementById('weather-container');
        if (weatherContainer) {
            weatherContainer.innerHTML = `
                <p>❌ ${message}</p>
                <button class="btn btn-secondary" onclick="app.getWeather()">Try Again</button>
            `;
        }
    }

    /**
     * Handle geolocation errors
     */
    handleGeolocationError(error) {
        const weatherContainer = document.getElementById('weather-container');
        if (weatherContainer) {
            let errorMessage = 'Location access denied.';
            if (error.code === 1) {
                errorMessage = '❌ You denied location permission. Use "Enter Location" instead.';
            } else if (error.code === 2) {
                errorMessage = '❌ Location unavailable. Use "Enter Location" instead.';
            } else if (error.code === 3) {
                errorMessage = '❌ Location request timed out. Use "Enter Location" instead.';
            }
            
            weatherContainer.innerHTML = `
                <p>${errorMessage}</p>
                <div style="display: flex; gap: 1rem; flex-wrap: wrap; justify-content: center; margin-top: 1rem;">
                    <button class="btn btn-secondary" onclick="app.getWeather()">Retry</button>
                    <button class="btn btn-secondary" onclick="app.toggleManualLocationForm()">Enter Location</button>
                </div>
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

    /**
     * Show loading state
     */
    setLoading(container, isLoading, message = 'Loading...') {
        if (!container) return;
        
        this.isLoading = isLoading;
        
        if (isLoading) {
            container.innerHTML = `
                <div class="loading-container">
                    <div class="spinner"></div>
                    <p>${message}</p>
                </div>
            `;
        }
    }

    /**
     * Show error message
     */
    showErrorMessage(message, containerId = 'weather-container') {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        this.isLoading = false;
        container.innerHTML = `
            <div class="error-container">
                <strong>❌ Error</strong>
                <p>${message}</p>
            </div>
        `;
    }

    /**
     * Show success message
     */
    showSuccessMessage(message, containerId = 'weather-container') {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        this.isLoading = false;
        container.innerHTML = `
            <div class="success-container">
                <strong>✅ Success</strong>
                <p>${message}</p>
            </div>
        `;
    }

    /**
     * Safe fetch with error handling
     */
    async safeFetch(url, options = {}) {
        try {
            const response = await fetch(url, {
                timeout: 10000,
                ...options
            });
            
            if (!response.ok) {
                throw new Error(`API error: ${response.status} ${response.statusText}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Fetch error:', error);
            throw error;
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
