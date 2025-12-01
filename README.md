# 🌊 ShoreSquad - Beach Cleanup Coordination Platform

A progressive web application for coordinating beach cleanup initiatives, tracking weather conditions, and managing cleanup crews across Singapore's coastal areas.

## 🎯 Features

### Core Features
- **🗺️ Smart Maps Integration** - View Pasir Ris cleanup location with interactive Google Maps
- **🌤️ Real-Time Weather** - Live 4-day weather forecast powered by NEA (National Environment Agency)
- **👥 Crew Management** - Create, join, and manage beach cleanup crews
- **📱 Location-Based Services** - Automatic location detection or manual location entry
- **📊 Impact Tracking** - Monitor trash collected and crew statistics
- **🔐 User Profiles** - Create and save your ShoreSquad profile
- **⚡ Progressive Web App** - Works offline with service worker support

### Technical Highlights
- **Responsive Design** - Optimized for mobile, tablet, and desktop
- **Accessibility First** - WCAG 2.1 compliant with screen reader support
- **Performance Optimized** - Lazy loading, efficient bundling, minimal dependencies
- **Error Resilient** - Graceful fallbacks and comprehensive error handling
- **Metric Units** - All measurements in Celsius and kilometers

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Node.js (optional, for Live Server)
- Git (for version control)

### Local Development

#### Option 1: Using Live Server (Recommended)

1. **Install Live Server globally** (if not already installed):
   ```bash
   npm install -g live-server
   ```

2. **Clone the repository**:
   ```bash
   git clone https://github.com/jordanchoa123/ShoreSquad.git
   cd ShoreSquad
   ```

3. **Start Live Server**:
   ```bash
   live-server
   ```
   - This will automatically open your browser at `http://localhost:8080`
   - Changes to files will auto-refresh the browser

#### Option 2: Using Python (No Installation Required)

**Python 3.x:**
```bash
python -m http.server 8000
# Open http://localhost:8000 in your browser
```

**Python 2.x:**
```bash
python -m SimpleHTTPServer 8000
# Open http://localhost:8000 in your browser
```

#### Option 3: Direct File Open
- Simply open `index.html` directly in your browser
- Note: Some features (like geolocation) may have limited functionality

### Project Structure
```
ShoreSquad/
├── index.html           # Main HTML file
├── css/
│   └── styles.css      # All styling and responsive design
├── js/
│   ├── app.js          # Main application logic
│   └── sw.js           # Service worker for offline support
├── README.md           # This file
└── desktop.ini         # Windows system file (can be ignored)
```

## 📖 Usage Guide

### Getting Weather for Your Location

1. **Automatic Location (Recommended)**:
   - Click "📍 Get My Weather" button
   - Allow location permission when prompted
   - The app will fetch your coordinates and display weather

2. **Manual Location Entry**:
   - Click "🗺️ Enter Location" button
   - Type a beach or city name (e.g., "Pasir Ris", "East Coast", "Sentosa")
   - Press Enter or click "Get Weather"
   - The app will geocode your location and fetch weather

3. **Understanding the Weather Display**:
   - **Current Temperature**: Real-time temperature from NEA sensors (in °C)
   - **4-Day Forecast**: Upcoming weather conditions with humidity levels
   - **Perfect Beach Cleanup Weather**: Suggested conditions for cleanup activities

### Creating Your Profile

1. Scroll to "My Profile" section
2. Enter your username and email
3. Click "Save Profile"
4. Your stats will update as you participate in cleanups

### Finding and Joining Crews

1. Go to "Find Your Crew" section
2. Use the search bar to find crews by name or location
3. Click "Join Crew" to participate
4. Create your own crew with the "+ Create Crew" button

### Viewing the Next Cleanup Location

1. Click "Next Cleanup" in the navigation menu
2. View the interactive Google Map showing Pasir Ris cleanup location
3. Coordinates: 1.381497°N, 103.955574°E
4. Location details are displayed below the map

## 🔧 Technical Details

### API Integration

#### NEA Weather API
- **Current Temperature**: `https://api.data.gov.sg/v1/environment/air-temperature`
- **4-Day Forecast**: `https://api.data.gov.sg/v1/environment/4day-weather-forecast`
- **Data**: Real-time Singapore weather station readings
- **Format**: JSON (no authentication required)

#### Geolocation Services
- **Browser Geolocation**: W3C Geolocation API for GPS coordinates
- **Reverse Geocoding**: OpenStreetMap Nominatim for location names
- **Maps**: Google Maps iframe for cleanup location visualization

### Local Storage
- User profiles are stored in browser's `localStorage`
- Data persists across sessions
- Key: `shorequad_user`

### Service Worker
- Enables offline functionality
- Caches assets for faster loading
- Located in `js/sw.js`

## 🎨 Customization

### Changing the Cleanup Location

Edit the map coordinates in `index.html`:
```html
<!-- Find this section -->
<iframe 
    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.822180046186!2d103.95507607509267!3d1.3814970989106247!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31da25a94d4c6d01%3A0x2c3dc57ba5f5b8eb!2sPasir%20Ris%20Park!5e0!3m2!1sen!2ssg!4v1701388800000!5m2!1sen!2ssg"
```

### Styling
- All styles are in `css/styles.css`
- Uses CSS Custom Properties (variables) for easy theming
- Color palette:
  - Primary: `#0077BE` (Ocean Blue)
  - Secondary: `#FF6B5B` (Coral Orange)
  - Accent: `#2EC4B6` (Seafoam Green)

## 🌐 Deployment

### GitHub Pages (Free Hosting)

1. **Repository Settings**:
   - Go to your GitHub repository
   - Settings → Pages
   - Select "Deploy from a branch"
   - Choose `main` branch and `/root` folder
   - Save

2. **Access Your Site**:
   - Your site will be live at: `https://jordanchoa123.github.io/ShoreSquad`
   - Updates automatically when you push to `main`

### Alternative Hosting
- Netlify (automatic deployments from Git)
- Vercel (optimized for web projects)
- Firebase Hosting (Google Cloud)
- AWS S3 + CloudFront

## ♿ Accessibility

- **Screen Reader Support**: Semantic HTML with ARIA labels
- **Keyboard Navigation**: Full keyboard support with focus indicators
- **Color Contrast**: WCAG AA compliant color ratios
- **Responsive Text**: Scales appropriately for readability
- **Motion Preferences**: Respects `prefers-reduced-motion` setting

## 📊 Browser Support

| Browser | Support | Notes |
|---------|---------|-------|
| Chrome 90+ | ✅ Full | Recommended |
| Firefox 88+ | ✅ Full | Full support |
| Safari 14+ | ✅ Full | iOS Safari supported |
| Edge 90+ | ✅ Full | Chromium-based |
| IE 11 | ❌ No | Not supported |

## 🐛 Troubleshooting

### Weather Data Not Loading
- **Solution**: Check browser console (F12) for errors
- Enable location permission if using auto-location
- Try manual location entry
- Check internet connection

### Location Permission Not Prompting
- **Solution**: 
  - Use manual location entry instead
  - Check browser location settings
  - Clear site data and reload
  - Try incognito/private browsing

### Service Worker Issues
- **Solution**:
  - Unregister service worker: DevTools → Application → Service Workers
  - Clear cache and reload
  - Check that you're using HTTPS (or localhost)

### Profile Not Saving
- **Solution**:
  - Check browser's localStorage is enabled
  - Ensure you clicked "Save Profile"
  - Check browser console for errors

## 📝 Contributing

We welcome contributions! Please:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Check existing issues first
- Provide detailed reproduction steps

## 🌍 About ShoreSquad

ShoreSquad is dedicated to:
- **Ocean Conservation**: Protecting Singapore's marine environments
- **Community Engagement**: Bringing people together for environmental action
- **Impact Tracking**: Measuring and celebrating cleanup achievements
- **Accessibility**: Making beach cleanups easy for everyone

### Our Mission
Rally crews, track weather, and hit the next beach cleanup! Together, we can make a real difference for our coastlines.

---

**Last Updated**: December 2025  
**Version**: 1.0.0  
**Maintainer**: ShoreSquad Team

🌊 **Let's make our beaches cleaner, one crew at a time!** 🌊
