import { Filter, CheckCircle } from "lucide-react";
import { Button } from "../common";
import type { InsightCategory } from "../../types";
import { useInsightsStore } from "../../stores";

export function InsightsFilterBar() {
  const {
    selectedCategory,
    selectedType,
    showUnreadOnly,
    showActiveOnly,
    setSelectedCategory,
    setSelectedType,
    setShowUnreadOnly,
    setShowActiveOnly,
    getUnreadCount,
    generateInsights,
  } = useInsightsStore();

  const unreadCount = getUnreadCount();

  const categories: Array<{ value: InsightCategory | "all"; label: string }> = [
    { value: "all", label: "All" },
    { value: "duration", label: "Duration" },
    { value: "efficiency", label: "Efficiency" },
    { value: "phases", label: "Phases" },
    { value: "consistency", label: "Consistency" },
    { value: "performance", label: "Performance" },
  ];

  const types: Array<{ value: string; label: string }> = [
    { value: "all", label: "All Types" },
    { value: "trend", label: "Trends" },
    { value: "anomaly", label: "Anomalies" },
    { value: "correlation", label: "Correlations" },
    { value: "recommendation", label: "Recommendations" },
    { value: "alert", label: "Alerts" },
  ];

  return (
    <div className="space-y-4">
      {/* Header with regenerate button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Filters</h2>
        </div>
        <Button size="sm" variant="outline" onClick={generateInsights}>
          Regenerate Insights
        </Button>
      </div>

      {/* Category filter */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Category
        </label>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.value}
              onClick={() => setSelectedCategory(category.value)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                selectedCategory === category.value
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* Type filter */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Type
        </label>
        <div className="flex flex-wrap gap-2">
          {types.map((type) => (
            <button
              key={type.value}
              onClick={() => setSelectedType(type.value)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                selectedType === type.value
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Toggle filters */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => setShowUnreadOnly(!showUnreadOnly)}
          className={`flex items-center space-x-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
            showUnreadOnly
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
          }`}
        >
          <CheckCircle className="h-4 w-4" />
          <span>Unread Only</span>
          {unreadCount > 0 && (
            <span className="ml-1 inline-flex items-center justify-center rounded-full bg-red-600 px-2 py-0.5 text-xs font-bold leading-none text-white">
              {unreadCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setShowActiveOnly(!showActiveOnly)}
          className={`flex items-center space-x-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
            showActiveOnly
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
          }`}
        >
          <span>Active Only</span>
        </button>
      </div>
    </div>
  );
}
