// Efficiency chart component showing sleep efficiency over time

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
  Area,
  AreaChart,
} from "recharts";
import { Zap } from "lucide-react";
import { useAnalytics } from "../../hooks";

export interface EfficiencyChartProps {
  startDate?: string;
  endDate?: string;
}

export function EfficiencyChart({ startDate, endDate }: EfficiencyChartProps) {
  const { efficiencyData, averageEfficiency } = useAnalytics(startDate, endDate);

  const chartData = useMemo(() => {
    return efficiencyData.map((point) => ({
      date: point.label || point.date,
      efficiency: point.value,
    }));
  }, [efficiencyData]);

  const goodThreshold = 85; // 85% is considered good sleep efficiency
  const excellentThreshold = 90; // 90% is excellent

  const getEfficiencyColor = (value: number) => {
    if (value >= excellentThreshold) return "#22c55e"; // green
    if (value >= goodThreshold) return "#3b82f6"; // blue
    if (value >= 70) return "#f59e0b"; // yellow
    return "#ef4444"; // red
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="rounded-lg border border-gray-200 bg-white px-4 py-2 shadow-lg">
          <p className="text-sm font-medium text-gray-900">{data.date}</p>
          <p className="text-sm text-gray-600">
            Efficiency: <span className="font-medium">{data.efficiency}%</span>
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
          <Zap className="h-5 w-5 text-yellow-600" />
          <h3 className="text-lg font-semibold text-gray-900">Sleep Efficiency</h3>
        </div>
        <div className="text-sm text-gray-600">
          Avg: <span className="font-medium">{averageEfficiency}%</span>
        </div>
      </div>

      {chartData.length === 0 ? (
        <div className="py-12 text-center text-gray-500">
          <p>No data available</p>
          <p className="mt-2 text-sm">Add sleep records to see the chart</p>
        </div>
      ) : (
        <>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                <defs>
                  <linearGradient id="efficiencyGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
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
                  domain={[0, 100]}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#6b7280" }}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine
                  y={goodThreshold}
                  stroke="#22c55e"
                  strokeDasharray="3 3"
                  label={{ value: "Good", position: "left", fontSize: 10 }}
                />
                <ReferenceLine
                  y={excellentThreshold}
                  stroke="#3b82f6"
                  strokeDasharray="3 3"
                  label={{ value: "Excellent", position: "left", fontSize: 10 }}
                />
                <Area
                  type="monotone"
                  dataKey="efficiency"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#efficiencyGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Efficiency info */}
          <div className="mt-4 border-t border-gray-200 pt-4">
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500" />
                <span className="text-sm text-gray-600">&lt; 70%: Needs improvement</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-yellow-500" />
                <span className="text-sm text-gray-600">70-84%: Fair</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-green-500" />
                <span className="text-sm text-gray-600">85%+: Good</span>
              </div>
            </div>
          </div>

          {/* Current efficiency rating */}
          <div className="mt-4 rounded-lg bg-gray-50 p-3">
            <p className="text-sm text-gray-600">
              Your average efficiency of{" "}
              <span className="font-medium text-gray-900">{averageEfficiency}%</span> is{" "}
              {averageEfficiency >= excellentThreshold ? (
                <span className="font-medium text-green-600">excellent!</span>
              ) : averageEfficiency >= goodThreshold ? (
                <span className="font-medium text-blue-600">good.</span>
              ) : averageEfficiency >= 70 ? (
                <span className="font-medium text-yellow-600">fair. Try to improve it.</span>
              ) : (
                <span className="font-medium text-red-600">
                  below average. Focus on better sleep habits.
                </span>
              )}
            </p>
          </div>
        </>
      )}
    </div>
  );
}
