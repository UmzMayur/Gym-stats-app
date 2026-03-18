# Gym Stats Tracker

A modern, responsive web application for tracking your gym workouts, exercises, and fitness progress.

## Features

### 📊 Dashboard
- **Overview Stats**: Total workouts, weekly activity, total volume lifted, and personal records
- **Progress Charts**: Visual representation of your weekly workout volume and frequency
- **Recent Workouts**: Quick view of your latest training sessions

### 💪 Workout Logging
- **Flexible Exercise Entry**: Add multiple exercises with sets, reps, weight, and duration
- **Exercise Library**: Pre-loaded with common exercises, plus ability to add custom ones
- **Workout Notes**: Track how you felt and any achievements during each session
- **Auto-calculation**: Automatic volume calculations for each workout

### 📈 History & Analytics
- **Workout History**: Complete log of all your past workouts
- **Date Filtering**: View workouts within specific date ranges
- **Data Export**: Export your data as JSON for backup or analysis

### 🏋️ Exercise Management
- **Exercise Library**: Manage your custom exercise database
- **Personal Records**: Track your best lifts for each exercise
- **Search Functionality**: Quickly find exercises in your library

## Technology Stack

- **Frontend**: Pure HTML5, CSS3, and JavaScript (ES6+)
- **Styling**: Tailwind CSS for modern, responsive design
- **Charts**: Chart.js for data visualization
- **Icons**: Font Awesome for UI icons
- **Storage**: LocalStorage for data persistence
- **Design**: Mobile-first responsive design

## Getting Started

1. **Download the files**
   ```bash
   # Clone or download the project files
   # You should have: index.html, app.js, and README.md
   ```

2. **Open the application**
   - **Desktop**: Simply open `index.html` in your web browser
   - **Phone**: Follow the phone instructions below
   - No installation or setup required!

3. **Start tracking**
   - Add your first workout using the "Log Workout" button
   - View your progress on the dashboard
   - Manage your exercise library as needed

## 📱 Phone Usage

### Method 1: Direct File Access (Easiest)
1. **Transfer files to your phone**:
   - Email the files to yourself
   - Use USB cable to transfer files
   - Use cloud storage (Google Drive, Dropbox, etc.)

2. **Open on phone**:
   - Find `index.html` in your phone's file manager
   - Tap to open in your phone's web browser
   - **Bookmark the page** for easy access

### Method 2: Local Web Server (Better Experience)
1. **Install a local server app**:
   - **Android**: "HTTP Server" or "KWS" from Play Store
   - **iPhone**: "Servers Ultimate" or "Pythonista" from App Store

2. **Run the server**:
   - Start the server app
   - Point it to the folder containing your gym tracker files
   - Note the local IP address (e.g., `http://192.168.1.100:8080`)

3. **Access from phone**:
   - Connect phone to same WiFi network
   - Open browser and enter the IP address
   - **Bookmark the page** for quick access

### Method 3: GitHub Pages (Free Hosting)
1. **Upload to GitHub**:
   - Create a free GitHub account
   - Create a new repository
   - Upload the gym tracker files

2. **Enable GitHub Pages**:
   - Go to repository Settings → Pages
   - Select "Deploy from a branch"
   - Choose main branch and save

3. **Access from any device**:
   - Get your GitHub Pages URL
   - Access from any phone or computer
   - Works offline after first load

### Phone-Specific Tips:
- **Add to Home Screen**: In browser menu → "Add to Home Screen" for app-like experience
- **Landscape Mode**: Rotate phone for better form filling
- **Data Backup**: Regularly export data to avoid loss
- **WiFi Recommended**: Faster loading and data saving

### Mobile Features:
- ✅ **Touch-friendly**: Large buttons and touch targets
- ✅ **Responsive**: Works on any screen size
- ✅ **Offline Ready**: Works without internet after first load
- ✅ **Fast Loading**: Optimized for mobile performance

## Data Storage

Your data is stored in **IndexedDB**, which is a built-in browser database that provides:
- ✅ **Larger storage capacity** than LocalStorage (typically 50MB+ vs 5MB)
- ✅ **Better performance** for larger datasets
- ✅ **Structured storage** with indexes for faster queries
- ✅ **Transactional operations** for data integrity
- ✅ **Still private and local** - no data sent to external servers

### Database Structure:
- **Database Name**: `GymStatsDB`
- **Workouts Store**: All workout data with exercises, sets, reps, weights
- **Exercises Store**: Your custom exercise library
- **Indexes**: Date and category indexes for faster searching

### Advantages over LocalStorage:
- **More storage space** for extensive workout history
- **Faster queries** with indexed data
- **Better reliability** with transaction-based operations
- **Still completely private** - stored locally in your browser

### Important Notes:
⚠️ **Browser-specific**: Data stays in the browser where you log workouts  
⚠️ **Device-specific**: Won't sync across different computers automatically  
⚠️ **Backup recommended**: Use Export feature to save your data externally  

### Data Management:
- **Automatic saving**: All changes are saved immediately to the database
- **Error handling**: Built-in fallbacks if database operations fail
- **Data integrity**: Transactions ensure your data stays consistent

## Browser Compatibility

This application works on all modern browsers:
- Chrome (recommended)
- Firefox
- Safari
- Edge

## Mobile Usage

The app is fully responsive and works great on mobile devices. You can:
- Log workouts at the gym using your phone
- Check your progress on the go
- Access all features from any device

## Data Export

To backup or analyze your data:
1. Go to the History tab
2. Click the "Export" button
3. Save the JSON file to your device
4. You can import this data later or analyze it in Excel/Google Sheets

## Privacy

- No data is sent to external servers
- All information is stored locally in your browser
- No tracking or analytics are used
- Your workout data remains completely private

## Future Enhancements

Potential features to consider:
- Cloud sync across devices
- Exercise animations and instructions
- Workout templates and programs
- Social sharing features
- Advanced analytics and insights
- Integration with fitness trackers

## Support

If you encounter any issues or have suggestions:
1. Make sure you're using a modern browser
2. Try clearing your browser cache
3. Check that LocalStorage is enabled in your browser settings

---

**Happy lifting! 💪**
