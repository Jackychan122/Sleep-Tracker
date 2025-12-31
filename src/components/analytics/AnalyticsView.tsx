// Analytics view component with all charts and date range picker

import { useState, useMemo } from "react";
import { BarChart3, TrendingUp } from "lucide-react";
import {
  DurationChart,
  PhaseChart,
  EfficiencyChart,
  ScheduleScatter,
  WeeklyComparisonChart,
  CorrelationChart,
  DateRangePicker,
} from "./index";
import type { DateRange } from "./DateRangePicker";
import { useSleepStore, useWorkoutStore } from "../../stores";
import { getWeeklySleepComparison, getSleepWorkoutCorrelation } from "../../services";

export function AnalyticsView() {
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
  });

  const [weeklyMetric, setWeeklyMetric] = useState<"duration" | "efficiency" | "quality">(
    "duration"
  );

  const sleepRecords = useSleepStore((state) => state.records);
  const workoutRecords = useWorkoutStore((state) => state.records);

  // Filter records by date range
  const filteredSleepRecords = useMemo(() => {
    return sleepRecords.filter((r) => r.date >= dateRange.startDate && r.date <= dateRange.endDate);
  }, [sleepRecords, dateRange]);

  const filteredWorkoutRecords = useMemo(() => {
    return workoutRecords.filter(
      (r) => r.date >= dateRange.startDate && r.date <= dateRange.endDate
    );
  }, [workoutRecords, dateRange]);

  // Calculate weekly comparison data
  const weeklyData = useMemo(() => {
    return getWeeklySleepComparison(filteredSleepRecords);
  }, [filteredSleepRecords]);

  // Calculate correlation data
  const correlationData = useMemo(() => {
    return getSleepWorkoutCorrelation(filteredSleepRecords, filteredWorkoutRecords);
  }, [filteredSleepRecords, filteredWorkoutRecords]);

  const handleDateRangeChange = (range: DateRange) => {
    setDateRange(range);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-blue-100 p-2">
            <BarChart3 className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Analytics</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Track your sleep patterns and trends
            </p>
          </div>
        </div>

        <DateRangePicker value={dateRange} onChange={handleDateRangeChange} />
      </div>

      {/* Basic Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <DurationChart startDate={dateRange.startDate} endDate={dateRange.endDate} />
        <PhaseChart startDate={dateRange.startDate} endDate={dateRange.endDate} />
      </div>

      <EfficiencyChart startDate={dateRange.startDate} endDate={dateRange.endDate} />

      {/* Advanced Analytics Section */}
      <div className="border-t border-gray-200 pt-6 dark:border-gray-700">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-lg bg-purple-100 p-2">
            <TrendingUp className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              Advanced Analytics
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Deep dive into your sleep patterns
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Schedule Scatter Plot */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
              Bedtime vs Wake Time
            </h3>
            <div className="h-80">
              <ScheduleScatter data={filteredSleepRecords} />
            </div>
          </div>

          {/* Weekly Comparison */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Weekly Comparison
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setWeeklyMetric("duration")}
                  className={`rounded-md px-3 py-1 text-sm font-medium transition-colors ${
                    weeklyMetric === "duration"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300"
                  }`}
                >
                  Duration
                </button>
                <button
                  onClick={() => setWeeklyMetric("efficiency")}
                  className={`rounded-md px-3 py-1 text-sm font-medium transition-colors ${
                    weeklyMetric === "efficiency"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300"
                  }`}
                >
                  Efficiency
                </button>
                <button
                  onClick={() => setWeeklyMetric("quality")}
                  className={`rounded-md px-3 py-1 text-sm font-medium transition-colors ${
                    weeklyMetric === "quality"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300"
                  }`}
                >
                  Quality
                </button>
              </div>
            </div>
            <div className="h-80">
              <WeeklyComparisonChart data={weeklyData} metric={weeklyMetric} />
            </div>
          </div>
        </div>

        {/* Sleep-Workout Correlation */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
            Sleep vs Workout Correlation
          </h3>
          <div className="h-96">
            <CorrelationChart
              data={correlationData}
              xLabel="Workout Intensity"
              yLabel="Sleep Quality"
            />
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="rounded-xl border border-blue-200 bg-blue-50 p-6 dark:border-blue-800 dark:bg-blue-900/20">
        <h3 className="mb-3 text-lg font-semibold text-blue-900 dark:text-blue-100">
          Tips for Better Sleep
        </h3>
        <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
          <li className="flex items-start gap-2">
            <span className="text-blue-600 dark:text-blue-400">•</span>
            <span>Aim for 7-9 hours of sleep per night for optimal health and performance</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 dark:text-blue-400">•</span>
            <span>Maintain a consistent sleep schedule, even on weekends</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 dark:text-blue-400">•</span>
            <span>Create a relaxing bedtime routine to signal your body it's time to sleep</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 dark:text-blue-400">•</span>
            <span>Avoid screens and bright lights at least 1 hour before bedtime</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 dark:text-blue-400">•</span>
            <span>Keep your bedroom cool, dark, and quiet for optimal sleep environment</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
