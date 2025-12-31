import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import { Sidebar, MobileHeader } from "./components/layout";
import { DashboardView } from "./components/dashboard";
import { AnalyticsView } from "./components/analytics";
import { InsightsView } from "./components/insights";
import { GoalsView } from "./components/goals";
import { ReportsView } from "./components/reports";
import { SettingsView } from "./components/settings";
import { SleepRecordsView } from "./components/sleep";
import { WorkoutRecordsView } from "./components/workout";
import { MoodEnergyRecordsView } from "./components/moodEnergy";
import { Toaster } from "./components/common";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <Router>
      <div className="flex min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

        {/* Main Content */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Mobile Header */}
          <MobileHeader onToggle={() => setSidebarOpen(!sidebarOpen)} />

          {/* Main Content Area */}
          <main className="flex-1 overflow-auto p-4 lg:p-8">
            <Routes>
              {/* Dashboard */}
              <Route path="/" element={<DashboardView />} />

              {/* Sleep Records */}
              <Route path="/sleep" element={<SleepRecordsView />} />

              {/* Workout Log */}
              <Route path="/workout" element={<WorkoutRecordsView />} />

              {/* Mood & Energy */}
              <Route path="/mood" element={<MoodEnergyRecordsView />} />

              {/* Analytics */}
              <Route path="/analytics" element={<AnalyticsView />} />

              {/* Insights */}
              <Route path="/insights" element={<InsightsView />} />

              {/* Goals */}
              <Route path="/goals" element={<GoalsView />} />

              {/* Reports */}
              <Route path="/reports" element={<ReportsView />} />

              {/* Settings */}
              <Route path="/settings" element={<SettingsView />} />
            </Routes>
          </main>

          {/* Footer */}
          <footer className="border-t border-gray-200 bg-white p-4 text-center text-sm text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
            © 2024 Sleep Tracker. All rights reserved.
          </footer>
        </div>

        {/* Toast Notifications */}
        <Toaster />
      </div>
    </Router>
  );
}

export default App;
