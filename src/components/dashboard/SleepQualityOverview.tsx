// Sleep quality overview component

import { Star, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { useStats } from "../../hooks";

export function SleepQualityOverview() {
  const { averageSleepQuality, averageSleepDuration } = useStats(7);

  // Calculate trend (simplified - in real app would compare with previous period)
  const previousQuality = averageSleepQuality - 0.5; // Simulated previous value
  const qualityDiff = averageSleepQuality - previousQuality;

  const getTrendIcon = () => {
    if (qualityDiff > 0.3) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (qualityDiff < -0.3) return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-gray-400" />;
  };

  const getTrendText = () => {
    if (qualityDiff > 0.3) return "Improving";
    if (qualityDiff < -0.3) return "Declining";
    return "Stable";
  };

  const getQualityColor = () => {
    if (averageSleepQuality >= 8) return "green";
    if (averageSleepQuality >= 6) return "blue";
    if (averageSleepQuality >= 4) return "yellow";
    return "red";
  };

  const getQualityLabel = () => {
    if (averageSleepQuality >= 8) return "Excellent";
    if (averageSleepQuality >= 6) return "Good";
    if (averageSleepQuality >= 4) return "Fair";
    return "Poor";
  };

  const colorClasses = {
    green: {
      bg: "bg-green-50",
      border: "border-green-200",
      text: "text-green-700",
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      starColor: "text-green-500",
    },
    blue: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      text: "text-blue-700",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      starColor: "text-blue-500",
    },
    yellow: {
      bg: "bg-yellow-50",
      border: "border-yellow-200",
      text: "text-yellow-700",
      iconBg: "bg-yellow-100",
      iconColor: "text-yellow-600",
      starColor: "text-yellow-500",
    },
    red: {
      bg: "bg-red-50",
      border: "border-red-200",
      text: "text-red-700",
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
      starColor: "text-red-500",
    },
  };

  const colors = colorClasses[getQualityColor()];

  // Render stars
  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(averageSleepQuality);
    const hasHalfStar = averageSleepQuality % 1 >= 0.5;

    for (let i = 0; i < 10; i++) {
      if (i < fullStars) {
        stars.push(<Star key={i} className={`h-4 w-4 ${colors.starColor} fill-current`} />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<Star key={i} className={`h-4 w-4 ${colors.starColor} opacity-50`} />);
      } else {
        stars.push(<Star key={i} className="h-4 w-4 text-gray-300" />);
      }
    }
    return stars;
  };

  return (
    <div className={`${colors.bg} rounded-xl border ${colors.border} p-6`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="mb-2 flex items-center gap-2">
            <h3 className="text-lg font-semibold text-gray-900">Sleep Quality</h3>
            {getTrendIcon()}
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-4xl font-bold ${colors.text}`}>
              {averageSleepQuality.toFixed(1)}
            </span>
            <span className="text-gray-600">/ 10</span>
          </div>
          <p className={`text-sm font-medium ${colors.text} mt-1`}>{getQualityLabel()}</p>
          <p className="mt-1 text-xs text-gray-500">{getTrendText()} • Based on last 7 days</p>
        </div>
        <div className={`${colors.iconBg} rounded-lg p-3`}>
          <Star className={`h-6 w-6 ${colors.iconColor}`} />
        </div>
      </div>

      {/* Star rating */}
      <div className="mt-4 flex flex-wrap items-center gap-1">{renderStars()}</div>

      {/* Quality meter */}
      <div className="mt-4">
        <div className="h-3 w-full overflow-hidden rounded-full bg-white">
          <div
            className={`h-3 transition-all duration-500 ${colors.bg.replace("bg-", "bg-")}`}
            style={{
              width: `${(averageSleepQuality / 10) * 100}%`,
              backgroundColor: colors.starColor.replace("text-", "#"),
            }}
          />
        </div>
        <div className="mt-1 flex justify-between">
          <span className="text-xs text-gray-500">Poor</span>
          <span className="text-xs text-gray-500">Excellent</span>
        </div>
      </div>

      {/* Sleep duration note */}
      <div className="mt-4 border-t border-gray-200 pt-4">
        <p className="text-xs text-gray-600">
          Average sleep duration: <span className="font-medium">{averageSleepDuration} min</span>
        </p>
      </div>
    </div>
  );
}
