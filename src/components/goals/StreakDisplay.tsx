import { Flame, Award, TrendingUp } from "lucide-react";
import type { Streak } from "../../types";
import { format, differenceInDays } from "date-fns";

interface StreakDisplayProps {
  streak: Streak;
  showDetails?: boolean;
}

export function StreakDisplay({ streak, showDetails = true }: StreakDisplayProps) {
  const getStreakColor = () => {
    if (streak.current >= 30) return "text-purple-600 dark:text-purple-400";
    if (streak.current >= 14) return "text-orange-600 dark:text-orange-400";
    if (streak.current >= 7) return "text-yellow-600 dark:text-yellow-400";
    return "text-blue-600 dark:text-blue-400";
  };

  const getStreakBg = () => {
    if (streak.current >= 30) return "bg-purple-100 dark:bg-purple-900/20";
    if (streak.current >= 14) return "bg-orange-100 dark:bg-orange-900/20";
    if (streak.current >= 7) return "bg-yellow-100 dark:bg-yellow-900/20";
    return "bg-blue-100 dark:bg-blue-900/20";
  };

  const getStreakMessage = () => {
    if (streak.current >= 100) return "Legendary! 🔥🔥🔥";
    if (streak.current >= 30) return "Amazing streak! Keep it up!";
    if (streak.current >= 14) return "Great consistency!";
    if (streak.current >= 7) return "You're on fire!";
    if (streak.current >= 3) return "Building momentum!";
    return "Every day counts!";
  };

  const daysSinceStart = differenceInDays(new Date(), new Date(streak.startDate));

  return (
    <div className={`${getStreakBg()} rounded-lg border border-gray-200 p-6 dark:border-gray-700`}>
      {/* Main Streak Display */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`rounded-full p-3 ${getStreakBg()}`}>
            <Flame className={`h-8 w-8 ${getStreakColor()}`} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Current Streak</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {streak.current}{" "}
              <span className="text-lg font-normal text-gray-600 dark:text-gray-400">days</span>
            </p>
          </div>
        </div>

        {showDetails && (
          <div className="text-right">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Best Streak</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {streak.best}{" "}
              <span className="text-sm font-normal text-gray-600 dark:text-gray-400">days</span>
            </p>
          </div>
        )}
      </div>

      {/* Motivational Message */}
      <div className="mb-4">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{getStreakMessage()}</p>
      </div>

      {/* Progress to next milestone */}
      {showDetails && streak.current < streak.best && (
        <div className="mb-4">
          <div className="mb-1 flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
            <span>Progress to best streak</span>
            <span>
              {streak.current} / {streak.best} days
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
            <div
              className="h-2 rounded-full bg-blue-600 transition-all duration-300"
              style={{
                width: `${Math.min(100, (streak.current / streak.best) * 100)}%`,
              }}
            />
          </div>
        </div>
      )}

      {/* Milestones */}
      {showDetails && (
        <div className="space-y-2">
          <p className="flex items-center text-xs font-medium text-gray-600 dark:text-gray-400">
            <Award className="mr-1 h-3 w-3" />
            Milestones
          </p>
          <div className="flex items-center space-x-2">
            {getMilestoneBadge(7, streak.current)}
            {getMilestoneBadge(14, streak.current)}
            {getMilestoneBadge(30, streak.current)}
            {getMilestoneBadge(60, streak.current)}
            {getMilestoneBadge(100, streak.current)}
          </div>
        </div>
      )}

      {/* Stats */}
      {showDetails && (
        <div className="mt-4 grid grid-cols-2 gap-4 border-t border-gray-300 pt-4 dark:border-gray-600">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Started</p>
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {format(new Date(streak.startDate), "MMM d, yyyy")}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Last Tracked</p>
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {format(new Date(streak.lastDate), "MMM d, yyyy")}
            </p>
          </div>
        </div>
      )}

      {/* Trend indicator */}
      {streak.current >= 3 && (
        <div className="mt-4 flex items-center text-sm text-green-600 dark:text-green-400">
          <TrendingUp className="mr-1 h-4 w-4" />
          <span>Great consistency! Keep going!</span>
        </div>
      )}
    </div>
  );
}

function getMilestoneBadge(days: number, currentStreak: number) {
  const isAchieved = currentStreak >= days;
  const isNext = !isAchieved && currentStreak >= days * 0.7;

  return (
    <div
      className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all ${
        isAchieved
          ? "bg-green-500 text-white"
          : isNext
            ? "bg-yellow-500 text-white"
            : "bg-gray-300 text-gray-600 dark:bg-gray-600 dark:text-gray-400"
      }`}
      title={`${days} day streak`}
    >
      {days}
    </div>
  );
}
