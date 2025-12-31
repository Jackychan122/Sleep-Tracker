import {
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Minus,
  Lightbulb,
  CheckCircle2,
  X,
} from "lucide-react";
import type { Insight } from "../../types";
import { Button } from "../common";
import { format } from "date-fns";

interface InsightCardProps {
  insight: Insight;
  onRead: (id: string) => void;
  onDismiss: (id: string) => void;
  onImplement?: (id: string) => void;
}

export function InsightCard({ insight, onRead, onDismiss, onImplement }: InsightCardProps) {
  const getPriorityColor = () => {
    switch (insight.priority) {
      case "high":
        return "border-l-red-500 bg-red-50 dark:bg-red-900/20";
      case "medium":
        return "border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/20";
      case "low":
        return "border-l-blue-500 bg-blue-50 dark:bg-blue-900/20";
    }
  };

  const getTypeIcon = () => {
    switch (insight.type) {
      case "trend":
        return insight.data?.direction === "increasing" ? (
          <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
        ) : insight.data?.direction === "decreasing" ? (
          <TrendingDown className="h-5 w-5 text-red-600 dark:text-red-400" />
        ) : (
          <Minus className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        );
      case "anomaly":
        return <AlertCircle className="h-5 w-5 text-orange-600 dark:text-orange-400" />;
      case "correlation":
        return <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />;
      case "recommendation":
        return <Lightbulb className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />;
      case "alert":
        return <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-600 dark:text-gray-400" />;
    }
  };

  const getCategoryLabel = () => {
    switch (insight.category) {
      case "duration":
        return "Duration";
      case "efficiency":
        return "Efficiency";
      case "phases":
        return "Sleep Phases";
      case "consistency":
        return "Consistency";
      case "performance":
        return "Performance";
    }
  };

  const getTypeLabel = () => {
    switch (insight.type) {
      case "trend":
        return "Trend";
      case "anomaly":
        return "Anomaly";
      case "correlation":
        return "Correlation";
      case "recommendation":
        return "Recommendation";
      case "alert":
        return "Alert";
    }
  };

  const handleCardClick = () => {
    if (!insight.isRead) {
      onRead(insight.id);
    }
  };

  return (
    <div
      className={`rounded-lg border-l-4 p-4 shadow-sm transition-all hover:shadow-md ${getPriorityColor()} ${
        !insight.isRead ? "border-l-8" : ""
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex flex-1 items-start space-x-3">
          <div className="mt-0.5 flex-shrink-0">{getTypeIcon()}</div>

          <div className="min-w-0 flex-1">
            <div className="mb-1 flex items-center space-x-2">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {insight.title}
              </h3>
              {!insight.isRead && (
                <span className="inline-flex items-center rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  New
                </span>
              )}
            </div>

            <p className="mb-2 text-sm text-gray-700 dark:text-gray-300">{insight.description}</p>

            <div className="flex items-center space-x-3 text-xs text-gray-500 dark:text-gray-400">
              <span className="inline-flex items-center rounded bg-gray-100 px-2 py-0.5 dark:bg-gray-700">
                {getTypeLabel()}
              </span>
              <span className="inline-flex items-center rounded bg-gray-100 px-2 py-0.5 dark:bg-gray-700">
                {getCategoryLabel()}
              </span>
              <span>{format(new Date(insight.createdAt), "MMM d, yyyy")}</span>
            </div>

            {insight.type === "recommendation" && !(insight as any).implemented && onImplement && (
              <div className="mt-3">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onImplement(insight.id)}
                  className="text-xs"
                >
                  <CheckCircle2 className="mr-1 h-3 w-3" />
                  Mark as Implemented
                </Button>
              </div>
            )}

            {insight.type === "recommendation" && (insight as any).implemented && (
              <div className="mt-3 inline-flex items-center text-xs text-green-600 dark:text-green-400">
                <CheckCircle2 className="mr-1 h-3 w-3" />
                Implemented
              </div>
            )}
          </div>
        </div>

        <div className="ml-4 flex items-start space-x-2">
          {!insight.isRead && (
            <Button
              size="sm"
              variant="ghost"
              onClick={handleCardClick}
              className="flex-shrink-0"
              title="Mark as read"
            >
              <CheckCircle2 className="h-4 w-4" />
            </Button>
          )}
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onDismiss(insight.id)}
            className="flex-shrink-0"
            title="Dismiss"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
