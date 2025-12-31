// GitHub-style contribution graph component

import { useState, useMemo } from "react";
import { format, subMonths, startOfMonth, endOfMonth } from "date-fns";
import { useSleepStore } from "../../stores";
import {
  generateContributionData,
  getColorScale,
  groupByWeek,
  formatDuration,
} from "../../utils/chart";
import type { SleepRecord } from "../../types";

export interface ContributionGraphProps {
  metric?: "duration" | "quality" | "efficiency";
  months?: number;
  onDayClick?: (date: string, record?: SleepRecord) => void;
}

export function ContributionGraph({
  metric = "quality",
  months = 6,
  onDayClick,
}: ContributionGraphProps) {
  const records = useSleepStore((state) => state.records);

  const [hoveredDay, setHoveredDay] = useState<{ date: string; record?: SleepRecord } | null>(null);

  const contributionData = useMemo(() => {
    const endDate = endOfMonth(new Date());
    const startDate = startOfMonth(subMonths(endDate, months - 1));
    return generateContributionData(records, startDate, endDate, metric);
  }, [records, metric, months]);

  const weeks = useMemo(() => groupByWeek(contributionData), [contributionData]);

  const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const getMetricLabel = () => {
    switch (metric) {
      case "duration":
        return "Sleep Duration";
      case "quality":
        return "Sleep Quality";
      case "efficiency":
        return "Sleep Efficiency";
    }
  };

  const getMetricValue = (value: number) => {
    switch (metric) {
      case "duration":
        return formatDuration(value);
      case "quality":
        return `${value}/10`;
      case "efficiency":
        return `${value}%`;
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Sleep Activity</h3>
        <div className="flex items-center gap-2">
          <label htmlFor="metric-select" className="text-sm text-gray-600">
            Show:
          </label>
          <select
            id="metric-select"
            value={metric}
            onChange={(e) => {
              // This will be handled by parent component in a real implementation
              // For now, we'll just update the state
            }}
            className="rounded-md border border-gray-300 px-2 py-1 text-sm"
          >
            <option value="quality">Quality</option>
            <option value="duration">Duration</option>
            <option value="efficiency">Efficiency</option>
          </select>
        </div>
      </div>

      {/* Contribution graph */}
      <div className="overflow-x-auto">
        <div className="flex min-w-max gap-1">
          {/* Day labels */}
          <div className="mr-2 flex flex-col gap-1">
            <div className="h-3"></div>
            {dayLabels.map((label) => (
              <div key={label} className="flex h-3 items-center">
                <span className="w-8 text-xs text-gray-400">{label}</span>
              </div>
            ))}
          </div>

          {/* Weeks */}
          <div className="flex gap-1">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-1">
                {/* Week label */}
                <div className="flex h-3 items-center">
                  {weekIndex % 4 === 0 && (
                    <span className="w-8 text-xs text-gray-400">
                      {format(new Date(week.weekStart), "MMM")}
                    </span>
                  )}
                </div>

                {/* Days */}
                {week.days.map((day) => {
                  const color = getColorScale(day.value, metric);
                  const isHovered = hoveredDay?.date === day.date;

                  return (
                    <div
                      key={day.date}
                      className="relative"
                      onMouseEnter={() => setHoveredDay({ date: day.date, record: day.record })}
                      onMouseLeave={() => setHoveredDay(null)}
                    >
                      <div
                        className={`
                          h-3 w-3 cursor-pointer rounded-sm transition-all
                          ${isHovered ? "ring-2 ring-blue-500 ring-offset-1" : ""}
                        `}
                        style={{ backgroundColor: color }}
                        onClick={() => onDayClick?.(day.date, day.record)}
                        title={day.date}
                      />
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center justify-end gap-2">
        <span className="text-xs text-gray-500">Less</span>
        {[0, 1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className="h-3 w-3 rounded-sm"
            style={{
              backgroundColor: getColorScale(
                metric === "duration"
                  ? 300 + level * 75
                  : metric === "quality"
                    ? 3 + level * 1.5
                    : 50 + level * 10,
                metric
              ),
            }}
          />
        ))}
        <span className="text-xs text-gray-500">More</span>
      </div>

      {/* Tooltip */}
      {hoveredDay && (
        <div className="pointer-events-none fixed z-50 rounded-lg bg-gray-900 px-3 py-2 text-xs text-white shadow-lg">
          <div className="mb-1 font-medium">{format(new Date(hoveredDay.date), "MMM d, yyyy")}</div>
          {hoveredDay.record ? (
            <div className="space-y-1">
              <div>
                {getMetricLabel()}:{" "}
                {getMetricValue(
                  hoveredDay.record[
                    metric === "duration"
                      ? "duration"
                      : metric === "quality"
                        ? "qualityScore"
                        : "efficiency"
                  ]
                )}
              </div>
              {metric !== "duration" && (
                <div>Duration: {formatDuration(hoveredDay.record.duration)}</div>
              )}
              {metric !== "quality" && <div>Quality: {hoveredDay.record.qualityScore}/10</div>}
              {metric !== "efficiency" && <div>Efficiency: {hoveredDay.record.efficiency}%</div>}
            </div>
          ) : (
            <div className="text-gray-400">No sleep data</div>
          )}
        </div>
      )}
    </div>
  );
}
