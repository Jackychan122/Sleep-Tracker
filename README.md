# Sleep Tracker

A comprehensive sleep tracking web application designed for fitness enthusiasts to monitor, analyze, and optimize their sleep patterns. Correlate your sleep quality with exercise performance through intuitive data visualization and personalized insights.

## Features

- 📊 **GitHub-Style Contribution Graph** - Visualize your sleep consistency over time
- 📈 **Advanced Analytics** - Sleep quality scoring, trends, and patterns
- 💡 **Smart Insights** - AI-powered recommendations based on your data
- 🎯 **Goal Setting** - Track sleep duration, quality, and consistency goals
- 🔥 **Streak Tracking** - Gamification to encourage consistent habits
- 📱 **Fully Responsive** - Works seamlessly on desktop and mobile
- 💾 **Privacy-First** - All data stored locally in your browser
- 📤 **Data Export** - Full import/export capabilities for backup

## Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **State Management**: Zustand
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod
- **Styling**: Tailwind CSS
- **Testing**: Vitest + React Testing Library
- **Storage**: LocalStorage with JSON export/import

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/sleep-tracker.git
cd sleep-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Running Tests

```bash
# Run tests
npm test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

## Usage Guide

### 1. Track Your Sleep

Navigate to the **Sleep** tab to log your sleep records:

1. Click "Add Sleep Record"
2. Enter your bedtime and wake time
3. Optionally add sleep phase data (deep, REM, light sleep)
4. Add your sleep efficiency percentage
5. Save your record

### 2. Log Workouts

Navigate to the **Workout** tab to track exercise:

1. Click "Add Workout"
2. Select workout type (running, cycling, etc.)
3. Enter duration and intensity
4. Add performance metrics (distance, pace, etc.)
5. Rate your perceived exertion and energy level

### 3. Monitor Mood & Energy

Navigate to the **Mood** tab to track how you feel:

1. Rate your overall mood (1-5 scale)
2. Track your energy levels throughout the day
3. Add notes about how you're feeling

### 4. View Analytics

Navigate to the **Analytics** tab to see:

- **Sleep Duration Trends** - Line chart showing sleep patterns over time
- **Sleep Phase Distribution** - Pie chart of sleep stages
- **Schedule Scatter Plot** - Bedtime vs wake time analysis
- **Weekly Comparison** - Compare sleep by day of week
- **Correlation Charts** - See how sleep relates to workouts

### 5. Get Insights

Navigate to the **Insights** tab to receive:

- **Trend Analysis** - Increasing or decreasing sleep patterns
- **Anomaly Detection** - Unusual sleep patterns flagged
- **Correlations** - Relationships between sleep and exercise
- **Recommendations** - Personalized improvement suggestions

### 6. Set Goals

Navigate to the **Goals** tab to:

1. Click "New Goal"
2. Choose goal type:
   - Sleep duration (hours per night)
   - Sleep quality score
   - Sleep efficiency
   - Bedtime consistency
   - Workout frequency
3. Set your target
4. Track progress with visual indicators

### 7. Generate Reports

Navigate to the **Reports** tab to:

- View weekly summaries
- View monthly summaries
- Export reports as JSON
- Track key metrics over time

### 8. Manage Data

Navigate to the **Settings** tab to:

- Export all your data as JSON
- Import data from backup
- Create data backups
- Clear all data

## Understanding Sleep Quality Score

The sleep quality score (0-100) is calculated using:

- **Duration (40%)**: 7-9 hours is optimal
- **Efficiency (30%)**: Time asleep vs time in bed
- **Sleep Phases (20%)**: Deep sleep ~20%, REM ~25%
- **Consistency (10%)**: Regular sleep schedule

**Score Categories:**
- 80-100: Excellent (green)
- 60-79: Good (blue)
- 40-59: Fair (yellow)
- 0-39: Poor (red)

## Project Structure

```
src/
├── components/          # React components
│   ├── common/         # Shared UI components
│   ├── layout/         # Layout components
│   ├── dashboard/      # Dashboard components
│   ├── sleep/          # Sleep tracking
│   ├── workout/        # Workout tracking
│   ├── moodEnergy/     # Mood & energy tracking
│   ├── analytics/      # Analytics charts
│   ├── insights/       # Insights display
│   ├── goals/          # Goal tracking
│   ├── reports/        # Report generation
│   └── settings/       # Settings & data management
├── services/           # Business logic
├── stores/             # Zustand state management
├── types/              # TypeScript type definitions
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
└── test/               # Test setup and utilities
```

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style
- Write tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting

## Deployment

### GitHub Pages (Recommended for Free Hosting)

The app uses **HashRouter** for GitHub Pages compatibility, which means URLs will include a `#` (e.g., `https://username.github.io/repo/#/analytics`).

1. Install `gh-pages`:
```bash
npm install --save-dev gh-pages
```

2. Add deploy script to package.json (already included):
```json
"scripts": {
  "deploy": "npm run build && gh-pages -d dist"
}
```

3. Deploy:
```bash
npm run deploy
```

4. Your site will be available at:
```
https://yourusername.github.io/your-repo-name/
```

**Note**: The app is configured with HashRouter, so all navigation will work perfectly on GitHub Pages without any additional configuration needed.

### Netlify

1. Connect your GitHub repository to Netlify
2. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
3. Deploy automatically on push

### Vercel

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel
```

## Data Privacy

- All data is stored locally in your browser
- No data is sent to external servers
- You have full control over your data
- Export functionality for backup and portability

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Acknowledgments

- Built with [React](https://react.dev/)
- Charts powered by [Recharts](https://recharts.org/)
- Icons by [Lucide](https://lucide.dev/)
- UI components inspired by [shadcn/ui](https://ui.shadcn.com/)

## Support

For issues, questions, or suggestions, please open an issue on GitHub.

---

Made with ❤️ for better sleep
