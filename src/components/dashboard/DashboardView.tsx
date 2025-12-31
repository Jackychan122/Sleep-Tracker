// Dashboard view component with overview page

import { Home } from "lucide-react";
import {
  QuickStats,
  ContributionGraph,
  RecentActivity,
  StreakDisplay,
  SleepQualityOverview,
} from "./index";

export function DashboardView() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-blue-100 p-2">
          <Home className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-600">Overview of your sleep and activity</p>
        </div>
      </div>

      {/* Quick Stats */}
      <QuickStats />

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Contribution Graph */}
        <div className="lg:col-span-2">
          <ContributionGraph months={6} />
        </div>

        {/* Right Column - Quality and Streak */}
        <div className="space-y-6">
          <SleepQualityOverview />
          <StreakDisplay />
        </div>
      </div>

      {/* Recent Activity */}
      <RecentActivity />

      {/* Quick Links */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <a
          href="/sleep"
          className="group rounded-xl border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md"
        >
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-2 transition-colors group-hover:bg-blue-200">
              <Home className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Add Sleep Record</p>
              <p className="text-xs text-gray-500">Log your sleep</p>
            </div>
          </div>
        </a>

        <a
          href="/workout"
          className="group rounded-xl border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md"
        >
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-green-100 p-2 transition-colors group-hover:bg-green-200">
              <Home className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Log Workout</p>
              <p className="text-xs text-gray-500">Track exercise</p>
            </div>
          </div>
        </a>

        <a
          href="/mood"
          className="group rounded-xl border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md"
        >
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-purple-100 p-2 transition-colors group-hover:bg-purple-200">
              <Home className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Log Mood</p>
              <p className="text-xs text-gray-500">Track feelings</p>
            </div>
          </div>
        </a>

        <a
          href="/analytics"
          className="group rounded-xl border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md"
        >
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-orange-100 p-2 transition-colors group-hover:bg-orange-200">
              <Home className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">View Analytics</p>
              <p className="text-xs text-gray-500">See trends</p>
            </div>
          </div>
        </a>
      </div>

      {/* Welcome Message for New Users */}
      <div className="rounded-xl border border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50 p-6">
        <h3 className="mb-2 text-lg font-semibold text-gray-900">Welcome to Sleep Tracker!</h3>
        <p className="mb-4 text-sm text-gray-600">
          Start tracking your sleep, workouts, and mood to get personalized insights and improve
          your overall well-being.
        </p>
        <div className="flex flex-wrap gap-3">
          <a
            href="/sleep"
            className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            Add Your First Sleep Record
          </a>
          <a
            href="/analytics"
            className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            Explore Analytics
          </a>
        </div>
      </div>
    </div>
  );
}
