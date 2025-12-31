// Streak display component showing current and best streaks

import { Flame, Trophy, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { useStats } from "../../hooks";

export function StreakDisplay() {
  const { currentStreak, bestStreak, averageSleepQuality } = useStats(30);

  const streakPercentage = bestStreak > 0 ? (currentStreak / bestStreak) * 100 : 0;

  const getTrendIcon = () => {
    if (currentStreak === bestStreak) {
      return <Trophy className="h-4 w-4 text-yellow-500" />;
    }
    if (currentStreak > 0) {
      return <TrendingUp className="h-4 w-4 text-green-500" />;
    }
    return <TrendingDown className="h-4 w-4 text-red-500" />;
  };

  const getTrendText = () => {
    if (currentStreak === bestStreak && currentStreak > 0) {
      return "Personal best!";
    }
    if (currentStreak > 0) {
      return `${bestStreak - currentStreak} days to beat your best`;
    }
    return "Start logging to build your streak";
  };

  const getStreakColor = () => {
    if (currentStreak >= 14) return "orange";
    if (currentStreak >= 7) return "yellow";
    if (currentStreak >= 3) return "green";
    return "gray";
  };

  const colorClasses = {
    orange: {
      bg: "bg-orange-50",
      border: "border-orange-200",
      text: "text-orange-700",
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
    },
    yellow: {
      bg: "bg-yellow-50",
      border: "border-yellow-200",
      text: "text-yellow-700",
      iconBg: "bg-yellow-100",
      iconColor: "text-yellow-600",
    },
    green: {
      bg: "bg-green-50",
      border: "border-green-200",
      text: "text-green-700",
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },
    gray: {
      bg: "bg-gray-50",
      border: "border-gray-200",
      text: "text-gray-700",
      iconBg: "bg-gray-100",
      iconColor: "text-gray-600",
    },
  };

  const colors = colorClasses[getStreakColor()];

  return (
    <div className={`${colors.bg} rounded-xl border ${colors.border} p-6`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="mb-2 flex items-center gap-2">
            <h3 className="text-lg font-semibold text-gray-900">Streak</h3>
            {getTrendIcon()}
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-4xl font-bold ${colors.text}`}>{currentStreak}</span>
            <span className="text-gray-600">days</span>
          </div>
          <p className="mt-1 text-sm text-gray-600">{getTrendText()}</p>
        </div>
        <div className={`${colors.iconBg} rounded-lg p-3`}>
          <Flame className={`h-6 w-6 ${colors.iconColor}`} />
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-4">
        <div className="mb-1 flex items-center justify-between text-xs text-gray-500">
          <span>Progress to personal best</span>
          <span>{bestStreak} days</span>
        </div>
        <div className="h-2 w-full rounded-full bg-white">
          <div
            className={`${colors.bg} h-2 rounded-full transition-all duration-500`}
            style={{ width: `${Math.min(streakPercentage, 100)}%` }}
          />
        </div>
      </div>

      {/* Milestones */}
      <div className="mt-4 border-t border-gray-200 pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Minus className="h-3 w-3 text-gray-400" />
            <span className="text-xs text-gray-500">3 days</span>
          </div>
          <div className="flex items-center gap-1">
            <Minus className="h-3 w-3 text-gray-400" />
            <span className="text-xs text-gray-500">7 days</span>
          </div>
          <div className="flex items-center gap-1">
            <Minus className="h-3 w-3 text-gray-400" />
            <span className="text-xs text-gray-500">14 days</span>
          </div>
          <div className="flex items-center gap-1">
            <Minus className="h-3 w-3 text-gray-400" />
            <span className="text-xs text-gray-500">30 days</span>
          </div>
        </div>
      </div>
    </div>
  );
}
