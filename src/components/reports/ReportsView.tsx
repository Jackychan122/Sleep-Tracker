import { useState } from "react";
import { Calendar, BarChart3, TrendingUp, Download } from "lucide-react";
import { useSleepStore, useWorkoutStore, useMoodEnergyStore, useToastStore } from "../../stores";
import { generateWeeklyReport, generateMonthlyReport } from "../../services";
import type { WeeklyReport, MonthlyReport } from "../../types";
import { format } from "date-fns";
import { EmptyState } from "../common";

export function ReportsView() {
  const sleepRecords = useSleepStore((state) => state.records);
  const workoutRecords = useWorkoutStore((state) => state.records);
  const moodRecords = useMoodEnergyStore((state) => state.records);
  const { addToast } = useToastStore();

  const [reportType, setReportType] = useState<"weekly" | "monthly">("weekly");

  // Generate reports
  const weeklyReport = generateWeeklyReport(sleepRecords, workoutRecords, moodRecords);
  const monthlyReport = generateMonthlyReport(sleepRecords, workoutRecords, moodRecords);

  const currentReport = reportType === "weekly" ? weeklyReport : monthlyReport;

  const handleExportReport = () => {
    try {
      const reportData = JSON.stringify(currentReport, null, 2);
      const blob = new Blob([reportData], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `sleep-tracker-${reportType}-report-${format(new Date(), "yyyy-MM-dd")}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      addToast({
        type: "success",
        title: "Report exported",
        message: `Your ${reportType} report has been downloaded.`,
      });
    } catch (error) {
      addToast({
        type: "error",
        title: "Export failed",
        message: error instanceof Error ? error.message : "An unknown error occurred",
      });
    }
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Reports</h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              View your weekly and monthly summaries
            </p>
          </div>

          <button
            onClick={handleExportReport}
            aria-label="Export current report as JSON"
            className="flex items-center space-x-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
          >
            <Download className="h-4 w-4" aria-hidden="true" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Report Type Selector */}
      <div className="mb-6">
        <div className="flex space-x-1 rounded-lg bg-gray-100 p-1 dark:bg-gray-800">
          <button
            onClick={() => setReportType("weekly")}
            className={`flex flex-1 items-center justify-center space-x-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              reportType === "weekly"
                ? "bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-gray-100"
                : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
            }`}
          >
            <Calendar className="h-4 w-4" />
            <span>Weekly Report</span>
          </button>
          <button
            onClick={() => setReportType("monthly")}
            className={`flex flex-1 items-center justify-center space-x-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              reportType === "monthly"
                ? "bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-gray-100"
                : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
            }`}
          >
            <BarChart3 className="h-4 w-4" />
            <span>Monthly Report</span>
          </button>
        </div>
      </div>

      {/* Report Content */}
      <div className="flex-1 space-y-6 overflow-y-auto">
        {currentReport.sleepStats.totalRecords === 0 &&
        currentReport.workoutStats.totalRecords === 0 ? (
          <EmptyState type="reports" />
        ) : (
          <>
            {/* Report Header */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    {reportType === "weekly" ? "Weekly" : "Monthly"} Report
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {format(new Date(currentReport.startDate), "MMM d, yyyy")} -{" "}
                    {format(new Date(currentReport.endDate), "MMM d, yyyy")}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Generated</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {format(new Date(currentReport.generatedAt), "MMM d, yyyy HH:mm")}
                  </p>
                </div>
              </div>

              {/* Overall Summary */}
              {currentReport.summary.overall && (
                <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    {currentReport.summary.overall}
                  </p>
                </div>
              )}

              {/* Highlights */}
              {currentReport.summary.highlights.length > 0 && (
                <div>
                  <h3 className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Highlights
                  </h3>
                  <ul className="space-y-1">
                    {currentReport.summary.highlights.map((highlight, i) => (
                      <li
                        key={i}
                        className="flex items-start text-sm text-gray-600 dark:text-gray-400"
                      >
                        <span className="mr-2">•</span>
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Sleep Stats */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
                Sleep Statistics
              </h3>

              {currentReport.sleepStats.totalRecords === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No sleep records for this period
                </p>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <StatCard
                    label="Total Records"
                    value={currentReport.sleepStats.totalRecords.toString()}
                  />
                  <StatCard
                    label="Average Duration"
                    value={`${Math.floor(currentReport.sleepStats.averageValue / 60)}h ${Math.floor(
                      currentReport.sleepStats.averageValue % 60
                    )}m`}
                  />
                  <StatCard
                    label="Best Sleep"
                    value={`${Math.floor(currentReport.sleepStats.bestValue / 60)}h ${Math.floor(
                      currentReport.sleepStats.bestValue % 60
                    )}m`}
                  />
                  <StatCard label="Trend" value={currentReport.sleepStats.trend} trend={true} />
                </div>
              )}
            </div>

            {/* Workout Stats */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
                Workout Statistics
              </h3>

              {currentReport.workoutStats.totalRecords === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No workout records for this period
                </p>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <StatCard
                    label="Total Workouts"
                    value={currentReport.workoutStats.totalRecords.toString()}
                  />
                  <StatCard
                    label="Avg Duration"
                    value={`${Math.floor(currentReport.workoutStats.averageValue / 60)}h ${Math.floor(
                      currentReport.workoutStats.averageValue % 60
                    )}m`}
                  />
                  <StatCard
                    label="Best Workout"
                    value={`${Math.floor(currentReport.workoutStats.bestValue / 60)}h ${Math.floor(
                      currentReport.workoutStats.bestValue % 60
                    )}m`}
                  />
                  <StatCard label="Trend" value={currentReport.workoutStats.trend} trend={true} />
                </div>
              )}
            </div>

            {/* Mood Stats */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
                Mood & Energy Statistics
              </h3>

              {currentReport.moodStats.totalRecords === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No mood records for this period
                </p>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <StatCard
                    label="Total Records"
                    value={currentReport.moodStats.totalRecords.toString()}
                  />
                  <StatCard
                    label="Average Mood"
                    value={`${currentReport.moodStats.averageValue.toFixed(1)} / 5`}
                  />
                  <StatCard label="Best Mood" value={`${currentReport.moodStats.bestValue} / 5`} />
                  <StatCard label="Trend" value={currentReport.moodStats.trend} trend={true} />
                </div>
              )}
            </div>

            {/* Monthly Weekly Breakdown */}
            {reportType === "monthly" && "weeklyBreakdown" in currentReport && (
              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Weekly Breakdown
                </h3>

                <div className="space-y-4">
                  {currentReport.weeklyBreakdown.map((week, i) => (
                    <div
                      key={i}
                      className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-600 dark:bg-gray-700"
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          Week {i + 1}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {format(new Date(week.startDate), "MMM d")} -{" "}
                          {format(new Date(week.endDate), "MMM d")}
                        </p>
                      </div>

                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Sleep</p>
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {week.sleepStats.totalRecords > 0
                              ? `${Math.floor(week.sleepStats.averageValue / 60)}h`
                              : "N/A"}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Workouts</p>
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {week.workoutStats.totalRecords}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Mood</p>
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {week.moodStats.totalRecords > 0
                              ? `${week.moodStats.averageValue.toFixed(1)}`
                              : "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  trend = false,
}: {
  label: string;
  value: string | number;
  trend?: boolean;
}) {
  const getTrendColor = (value: string) => {
    if (value === "increasing") return "text-green-600 dark:text-green-400";
    if (value === "decreasing") return "text-red-600 dark:text-red-400";
    return "text-gray-600 dark:text-gray-400";
  };

  const getTrendIcon = (value: string) => {
    if (value === "increasing") return "↑";
    if (value === "decreasing") return "↓";
    return "→";
  };

  return (
    <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
      <p className="mb-1 text-xs text-gray-500 dark:text-gray-400">{label}</p>
      <p
        className={`text-lg font-semibold text-gray-900 dark:text-gray-100 ${
          trend ? getTrendColor(value.toString()) : ""
        }`}
      >
        {trend && getTrendIcon(value.toString())} {value}
      </p>
    </div>
  );
}
