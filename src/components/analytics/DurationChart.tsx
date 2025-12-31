// Duration chart component showing sleep duration over time

import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { Clock } from "lucide-react";
import { useAnalytics } from "../../hooks";
import { formatDuration } from "../../utils/chart";

export interface DurationChartProps {
  startDate?: string;
  endDate?: string;
}

export function DurationChart({ startDate, endDate }: DurationChartProps) {
  const { durationData, averageDuration } = useAnalytics(startDate, endDate);

  const chartData = useMemo(() => {
    return durationData.map((point) => ({
      date: point.label || point.date,
      duration: Math.round((point.value / 60) * 10) / 10, // Convert to hours
      rawDuration: point.value,
    }));
  }, [durationData]);

  const recommendedMin = 7; // 7 hours
  const recommendedMax = 9; // 9 hours

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="rounded-lg border border-gray-200 bg-white px-4 py-2 shadow-lg">
          <p className="text-sm font-medium text-gray-900">{data.date}</p>
          <p className="text-sm text-gray-600">
            Duration: <span className="font-medium">{formatDuration(data.rawDuration)}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Sleep Duration</h3>
        </div>
        <div className="text-sm text-gray-600">
          Avg: <span className="font-medium">{formatDuration(averageDuration)}</span>
        </div>
      </div>

      {chartData.length === 0 ? (
        <div className="py-12 text-center text-gray-500">
          <p>No data available</p>
          <p className="mt-2 text-sm">Add sleep records to see the chart</p>
        </div>
      ) : (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#6b7280" }}
                tickFormatter={(value) => {
                  const parts = value.split(" ");
                  return parts.length > 1 ? `${parts[0]} ${parts[1]}` : value;
                }}
              />
              <YAxis
                domain={[0, "dataMax + 1"]}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#6b7280" }}
                tickFormatter={(value) => `${value}h`}
              />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine
                y={recommendedMin}
                stroke="#22c55e"
                strokeDasharray="3 3"
                label={{ value: "Min", position: "left", fontSize: 10 }}
              />
              <ReferenceLine
                y={recommendedMax}
                stroke="#22c55e"
                strokeDasharray="3 3"
                label={{ value: "Max", position: "left", fontSize: 10 }}
              />
              <Line
                type="monotone"
                dataKey="duration"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: "#3b82f6", r: 4 }}
                activeDot={{ r: 6, fill: "#2563eb" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Recommended range info */}
      {chartData.length > 0 && (
        <div className="mt-4 border-t border-gray-200 pt-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-green-500" />
              <span className="text-gray-600">
                Recommended: {recommendedMin}-{recommendedMax} hours
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-blue-500" />
              <span className="text-gray-600">Your sleep</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
