// Quick stats component showing summary statistics

import { Clock, Zap, Star, Flame } from "lucide-react";
import { useStats } from "../../hooks";

export function QuickStats() {
  const {
    averageSleepDuration,
    averageSleepDurationFormatted,
    averageSleepEfficiency,
    averageSleepQuality,
    currentStreak,
    bestStreak,
  } = useStats(7);

  const stats = [
    {
      label: "Avg. Sleep Duration",
      value: averageSleepDurationFormatted,
      subtext: `${averageSleepDuration} min`,
      icon: Clock,
      color: "blue",
    },
    {
      label: "Avg. Sleep Efficiency",
      value: `${averageSleepEfficiency}%`,
      subtext: "Sleep quality",
      icon: Zap,
      color: "yellow",
    },
    {
      label: "Avg. Quality Score",
      value: `${averageSleepQuality}/10`,
      subtext: "Based on last 7 days",
      icon: Star,
      color: "purple",
    },
    {
      label: "Current Streak",
      value: `${currentStreak} days`,
      subtext: `Best: ${bestStreak} days`,
      icon: Flame,
      color: "orange",
    },
  ];

  const colorClasses = {
    blue: {
      bg: "bg-blue-50",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      value: "text-blue-700",
    },
    yellow: {
      bg: "bg-yellow-50",
      iconBg: "bg-yellow-100",
      iconColor: "text-yellow-600",
      value: "text-yellow-700",
    },
    purple: {
      bg: "bg-purple-50",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      value: "text-purple-700",
    },
    orange: {
      bg: "bg-orange-50",
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
      value: "text-orange-700",
    },
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        const colors = colorClasses[stat.color as keyof typeof colorClasses];

        return (
          <div key={stat.label} className={`${colors.bg} rounded-xl border border-gray-200 p-6`}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="mb-1 text-sm font-medium text-gray-600">{stat.label}</p>
                <p className={`text-2xl font-bold ${colors.value}`}>{stat.value}</p>
                <p className="mt-1 text-xs text-gray-500">{stat.subtext}</p>
              </div>
              <div className={`${colors.iconBg} rounded-lg p-2`}>
                <Icon className={`h-5 w-5 ${colors.iconColor}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
