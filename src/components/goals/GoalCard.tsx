import { Progress } from "../common/Progress";
import { Trophy, Target, Calendar, Trash2, Pause, Play } from "lucide-react";
import type { Goal, GoalProgress } from "../../types";
import { Button } from "../common";
import { format } from "date-fns";

interface GoalCardProps {
  goal: Goal;
  progress: GoalProgress;
  onDelete: (id: string) => void;
  onPause?: (id: string) => void;
  onResume?: (id: string) => void;
}

export function GoalCard({ goal, progress, onDelete, onPause, onResume }: GoalCardProps) {
  const getStatusColor = () => {
    switch (goal.status) {
      case "active":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "paused":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "failed":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
    }
  };

  const getProgressColor = () => {
    if (progress.percentage >= 100) return "bg-green-500";
    if (progress.percentage >= 75) return "bg-blue-500";
    if (progress.percentage >= 50) return "bg-yellow-500";
    return "bg-gray-400 dark:bg-gray-600";
  };

  const getGoalIcon = () => {
    if (progress.isCompleted) {
      return <Trophy className="h-6 w-6 text-yellow-500" />;
    }
    return <Target className="h-6 w-6 text-blue-500" />;
  };

  const getTargetLabel = () => {
    switch (goal.type) {
      case "sleep-duration":
      case "workout-duration":
        return `${Math.floor(goal.targetValue / 60)}h ${goal.targetValue % 60}m`;
      case "sleep-quality":
      case "sleep-efficiency":
      case "bedtime-consistency":
        return `${goal.targetValue}%`;
      case "workout-frequency":
      case "streak-days":
        return `${goal.targetValue} ${goal.period}`;
      default:
        return `${goal.targetValue}`;
    }
  };

  const getCurrentLabel = () => {
    switch (goal.type) {
      case "sleep-duration":
      case "workout-duration":
        return `${Math.floor(progress.currentValue / 60)}h ${progress.currentValue % 60}m`;
      case "sleep-quality":
      case "sleep-efficiency":
      case "bedtime-consistency":
        return `${progress.currentValue.toFixed(1)}%`;
      case "workout-frequency":
      case "streak-days":
        return `${Math.floor(progress.currentValue)}`;
      default:
        return `${progress.currentValue.toFixed(1)}`;
    }
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
      {/* Header */}
      <div className="mb-4 flex items-start justify-between">
        <div className="flex flex-1 items-start space-x-3">
          <div className="flex-shrink-0">{getGoalIcon()}</div>

          <div className="min-w-0 flex-1">
            <div className="mb-1 flex items-center space-x-2">
              <h3 className="truncate text-lg font-semibold text-gray-900 dark:text-gray-100">
                {goal.title}
              </h3>
              <span
                className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ${getStatusColor()}`}
              >
                {goal.status}
              </span>
            </div>

            {goal.description && (
              <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">{goal.description}</p>
            )}

            <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
              <span className="inline-flex items-center">
                <Calendar className="mr-1 h-3 w-3" />
                Since {format(new Date(goal.startDate), "MMM d, yyyy")}
              </span>
              {goal.endDate && (
                <span className="inline-flex items-center">
                  <Calendar className="mr-1 h-3 w-3" />
                  Until {format(new Date(goal.endDate), "MMM d, yyyy")}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="ml-4 flex items-center space-x-1">
          {goal.status === "active" && onPause && (
            <Button size="sm" variant="ghost" onClick={() => onPause(goal.id)} title="Pause goal">
              <Pause className="h-4 w-4" />
            </Button>
          )}
          {(goal.status === "paused" || goal.status === "failed") && onResume && (
            <Button size="sm" variant="ghost" onClick={() => onResume(goal.id)} title="Resume goal">
              <Play className="h-4 w-4" />
            </Button>
          )}
          <Button size="sm" variant="ghost" onClick={() => onDelete(goal.id)} title="Delete goal">
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      </div>

      {/* Progress */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Progress</span>
          <span className="font-medium text-gray-900 dark:text-gray-100">
            {getCurrentLabel()} / {getTargetLabel()}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="relative">
          <Progress value={progress.percentage} className="h-3" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-bold text-gray-700 mix-blend-multiply dark:text-gray-300">
              {progress.percentage.toFixed(0)}%
            </span>
          </div>
        </div>

        {/* Remaining Info */}
        {progress.remainingDays !== undefined && goal.status === "active" && (
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {progress.remainingDays === 0
              ? "Ends today"
              : progress.remainingDays === 1
                ? "1 day remaining"
                : `${progress.remainingDays} days remaining`}
          </div>
        )}

        {/* Completion Message */}
        {progress.isCompleted && (
          <div className="mt-3 rounded-lg border border-green-200 bg-green-50 p-3 dark:border-green-800 dark:bg-green-900/20">
            <p className="text-sm font-medium text-green-800 dark:text-green-200">
              🎉 Congratulations! You've achieved this goal!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
