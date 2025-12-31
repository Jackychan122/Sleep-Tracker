// Recent activity component showing recent records

import { format, parseISO } from "date-fns";
import { Link } from "react-router-dom";
import { Moon, Dumbbell, Smile, Clock, ArrowRight } from "lucide-react";
import { useStats } from "../../hooks";
import { formatDuration } from "../../utils/chart";

export function RecentActivity() {
  const { recentSleepRecords, recentWorkoutCount, recentMoodEnergyCount } = useStats(7);

  const activityItems = recentSleepRecords.map((record) => ({
    id: record.id,
    type: "sleep" as const,
    date: record.date,
    data: record,
  }));

  if (activityItems.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">Recent Activity</h3>
        <div className="py-8 text-center text-gray-500">
          <p>No recent activity</p>
          <p className="mt-2 text-sm">Start tracking to see your activity here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
        <Link
          to="/sleep"
          className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
        >
          View all
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="space-y-4">
        {activityItems.map((item) => {
          if (item.type === "sleep") {
            const record = item.data as any;
            return (
              <div
                key={item.id}
                className="flex items-start gap-3 rounded-lg p-3 transition-colors hover:bg-gray-50"
              >
                <div className="rounded-lg bg-blue-100 p-2">
                  <Moon className="h-4 w-4 text-blue-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-gray-900">Sleep Record</p>
                    <p className="text-xs text-gray-500">{format(parseISO(item.date), "MMM d")}</p>
                  </div>
                  <div className="mt-1 flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{formatDuration(record.duration)}</span>
                    </div>
                    <div>
                      Quality: <span className="font-medium">{record.qualityScore}/10</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          }

          return null;
        })}
      </div>

      {/* Quick stats for other activities */}
      <div className="mt-4 border-t border-gray-200 pt-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-green-100 p-1.5">
              <Dumbbell className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Workouts</p>
              <p className="text-xs text-gray-500">{recentWorkoutCount} this week</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-purple-100 p-1.5">
              <Smile className="h-4 w-4 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Mood Logs</p>
              <p className="text-xs text-gray-500">{recentMoodEnergyCount} this week</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
