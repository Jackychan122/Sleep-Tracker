import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { WeeklyComparison } from "../../types";

interface WeeklyComparisonProps {
  data: WeeklyComparison;
  metric: "duration" | "efficiency" | "quality";
}

export function WeeklyComparisonChart({ data, metric }: WeeklyComparisonProps) {
  // Convert WeeklyComparison to chart data format
  const chartData = [
    {
      day: "Mon",
      value:
        metric === "duration"
          ? data.monday.averageDuration / 60
          : metric === "efficiency"
            ? data.monday.averageEfficiency
            : data.monday.averageQuality,
      count: data.monday.recordCount,
    },
    {
      day: "Tue",
      value:
        metric === "duration"
          ? data.tuesday.averageDuration / 60
          : metric === "efficiency"
            ? data.tuesday.averageEfficiency
            : data.tuesday.averageQuality,
      count: data.tuesday.recordCount,
    },
    {
      day: "Wed",
      value:
        metric === "duration"
          ? data.wednesday.averageDuration / 60
          : metric === "efficiency"
            ? data.wednesday.averageEfficiency
            : data.wednesday.averageQuality,
      count: data.wednesday.recordCount,
    },
    {
      day: "Thu",
      value:
        metric === "duration"
          ? data.thursday.averageDuration / 60
          : metric === "efficiency"
            ? data.thursday.averageEfficiency
            : data.thursday.averageQuality,
      count: data.thursday.recordCount,
    },
    {
      day: "Fri",
      value:
        metric === "duration"
          ? data.friday.averageDuration / 60
          : metric === "efficiency"
            ? data.friday.averageEfficiency
            : data.friday.averageQuality,
      count: data.friday.recordCount,
    },
    {
      day: "Sat",
      value:
        metric === "duration"
          ? data.saturday.averageDuration / 60
          : metric === "efficiency"
            ? data.saturday.averageEfficiency
            : data.saturday.averageQuality,
      count: data.saturday.recordCount,
    },
    {
      day: "Sun",
      value:
        metric === "duration"
          ? data.sunday.averageDuration / 60
          : metric === "efficiency"
            ? data.sunday.averageEfficiency
            : data.sunday.averageQuality,
      count: data.sunday.recordCount,
    },
  ];

  const getMetricLabel = () => {
    switch (metric) {
      case "duration":
        return "Avg Duration (hours)";
      case "efficiency":
        return "Avg Efficiency (%)";
      case "quality":
        return "Avg Quality Score";
    }
  };

  const getMetricColor = () => {
    switch (metric) {
      case "duration":
        return "#3b82f6";
      case "efficiency":
        return "#22c55e";
      case "quality":
        return "#8b5cf6";
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const value = data.value;

      let formattedValue: string;
      if (metric === "duration") {
        formattedValue = `${value.toFixed(1)} hours`;
      } else if (metric === "efficiency") {
        formattedValue = `${value.toFixed(1)}%`;
      } else {
        formattedValue = value.toFixed(1);
      }

      return (
        <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-lg dark:border-gray-700 dark:bg-gray-800">
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{label}</p>
          <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
            {getMetricLabel()}: {formattedValue}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500">Records: {data.count}</p>
        </div>
      );
    }
    return null;
  };

  // Check if there's any data
  const hasData = chartData.some((item) => item.count > 0);

  if (!hasData) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">No weekly data available</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
        <XAxis dataKey="day" tick={{ fill: "#9CA3AF", fontSize: 12 }} stroke="#9CA3AF" />
        <YAxis
          label={{
            value: getMetricLabel(),
            angle: -90,
            position: "insideLeft",
            offset: -5,
            fill: "#9CA3AF",
            fontSize: 12,
          }}
          tick={{ fill: "#9CA3AF", fontSize: 12 }}
          stroke="#9CA3AF"
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Bar
          dataKey="value"
          name={getMetricLabel()}
          fill={getMetricColor()}
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
