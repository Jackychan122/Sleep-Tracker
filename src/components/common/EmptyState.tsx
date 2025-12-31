import { FileText, Moon, Activity, Target, BarChart3, TrendingUp } from "lucide-react";

interface EmptyStateProps {
  type:
    | "sleep"
    | "workout"
    | "mood"
    | "goals"
    | "analytics"
    | "insights"
    | "reports"
    | "settings"
    | "default";
  title?: string;
  message?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ type, title, message, action }: EmptyStateProps) {
  const getDefaultContent = () => {
    switch (type) {
      case "sleep":
        return {
          icon: <Moon className="h-12 w-12" />,
          title: title || "No sleep records yet",
          message:
            message ||
            "Start tracking your sleep to see patterns and insights. Your first record is just a click away!",
        };
      case "workout":
        return {
          icon: <Activity className="h-12 w-12" />,
          title: title || "No workouts recorded",
          message:
            message ||
            "Log your workouts to track your fitness journey and see how exercise impacts your sleep.",
        };
      case "mood":
        return {
          icon: <TrendingUp className="h-12 w-12" />,
          title: title || "No mood entries yet",
          message:
            message || "Track your mood and energy levels throughout the day to discover patterns.",
        };
      case "goals":
        return {
          icon: <Target className="h-12 w-12" />,
          title: title || "No goals set yet",
          message:
            message ||
            "Set personal goals for sleep, workouts, or consistency to stay motivated and track your progress.",
        };
      case "analytics":
        return {
          icon: <BarChart3 className="h-12 w-12" />,
          title: title || "No data to analyze",
          message:
            message ||
            "Start tracking your sleep and activities to see detailed analytics and trends.",
        };
      case "insights":
        return {
          icon: <TrendingUp className="h-12 w-12" />,
          title: title || "No insights available",
          message:
            message ||
            "Keep tracking to receive personalized insights based on your data patterns.",
        };
      case "reports":
        return {
          icon: <FileText className="h-12 w-12" />,
          title: title || "No reports available",
          message: message || "Reports will be generated once you have enough tracking data.",
        };
      default:
        return {
          icon: <FileText className="h-12 w-12" />,
          title: title || "Nothing here yet",
          message: message || "Get started by adding some data.",
        };
    }
  };

  const content = getDefaultContent();

  return (
    <div className="flex flex-col items-center justify-center px-4 py-16 text-center">
      <div className={`${content.icon} mb-4 text-gray-400 dark:text-gray-600`}>{content.icon}</div>
      <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-gray-100">{content.title}</h3>
      <p className="mb-6 max-w-md text-sm text-gray-600 dark:text-gray-400">{content.message}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
