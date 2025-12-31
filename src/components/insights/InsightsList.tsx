import { InsightCard } from "./InsightCard";
import type { Insight } from "../../types";
import { useInsightsStore } from "../../stores";

interface InsightsListProps {
  insights: Insight[];
}

export function InsightsList({ insights }: InsightsListProps) {
  const { markAsRead, markAsDismissed, markAsImplemented } = useInsightsStore();

  const handleRead = (id: string) => {
    markAsRead(id);
  };

  const handleDismiss = (id: string) => {
    markAsDismissed(id);
  };

  const handleImplement = (id: string) => {
    markAsImplemented(id);
  };

  if (insights.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center px-4 py-12">
        <div className="text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
            No insights available
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{getEmptyMessage()}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {insights.map((insight) => (
        <InsightCard
          key={insight.id}
          insight={insight}
          onRead={handleRead}
          onDismiss={handleDismiss}
          onImplement={handleImplement}
        />
      ))}
    </div>
  );
}

function getEmptyMessage(): string {
  return "Start tracking your sleep and workouts to receive personalized insights and recommendations.";
}
