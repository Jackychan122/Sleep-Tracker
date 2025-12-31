import { useEffect } from "react";
import { InsightsFilterBar } from "./InsightsFilterBar";
import { InsightsList } from "./InsightsList";
import { useInsightsStore } from "../../stores";
import { EmptyState } from "../common";

export function InsightsView() {
  const { insights, generateInsights, getFilteredInsights, getUnreadCount } = useInsightsStore();

  const filteredInsights = getFilteredInsights();
  const unreadCount = getUnreadCount();

  // Generate insights on mount if none exist
  useEffect(() => {
    if (insights.length === 0) {
      generateInsights();
    }
  }, []);

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Insights</h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Personalized insights and recommendations based on your sleep and workout data
            </p>
          </div>
          {unreadCount > 0 && (
            <div className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              {unreadCount} new
            </div>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="grid flex-1 grid-cols-1 gap-6 overflow-hidden lg:grid-cols-4">
        {/* Filters sidebar */}
        <div className="overflow-y-auto lg:col-span-1">
          <div className="sticky top-0">
            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <InsightsFilterBar />
            </div>
          </div>
        </div>

        {/* Insights list */}
        <div className="overflow-y-auto lg:col-span-3">
          {filteredInsights.length === 0 ? (
            <EmptyState type="insights" />
          ) : (
            <>
              <div className="mb-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Showing {filteredInsights.length}{" "}
                  {filteredInsights.length === 1 ? "insight" : "insights"}
                </p>
              </div>
              <InsightsList insights={filteredInsights} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
