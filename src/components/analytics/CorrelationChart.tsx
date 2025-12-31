import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import type { CorrelationData } from "../../types";
import { format } from "date-fns";

interface CorrelationChartProps {
  data: CorrelationData;
  xLabel?: string;
  yLabel?: string;
}

export function CorrelationChart({
  data,
  xLabel = "Workout Intensity",
  yLabel = "Sleep Quality",
}: CorrelationChartProps) {
  // Get color based on correlation strength
  const getCorrelationColor = (): string => {
    if (data.strength === "strong") return "#22c55e";
    if (data.strength === "moderate") return "#3b82f6";
    if (data.strength === "weak") return "#eab308";
    return "#9ca3af";
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const point = payload[0].payload;
      return (
        <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-lg dark:border-gray-700 dark:bg-gray-800">
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {format(new Date(point.date), "MMM d, yyyy")}
          </p>
          <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
            {xLabel}: {point.x.toFixed(1)}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            {yLabel}: {point.y.toFixed(1)}
          </p>
        </div>
      );
    }
    return null;
  };

  if (data.dataPoints.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">No correlation data available</p>
      </div>
    );
  }

  // Calculate domain
  const xValues = data.dataPoints.map((p) => p.x);
  const yValues = data.dataPoints.map((p) => p.y);
  const xMin = Math.min(...xValues) - 0.5;
  const xMax = Math.max(...xValues) + 0.5;
  const yMin = Math.min(...yValues) - 5;
  const yMax = Math.max(...yValues) + 5;

  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height="90%">
        <ScatterChart margin={{ top: 20, right: 20, bottom: 40, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
          <XAxis
            type="number"
            dataKey="x"
            domain={[xMin, xMax]}
            tick={{ fill: "#9CA3AF", fontSize: 12 }}
            label={{
              value: xLabel,
              position: "insideBottom",
              offset: -10,
              fill: "#9CA3AF",
              fontSize: 12,
            }}
          />
          <YAxis
            type="number"
            dataKey="y"
            domain={[yMin, yMax]}
            tick={{ fill: "#9CA3AF", fontSize: 12 }}
            label={{
              value: yLabel,
              angle: -90,
              position: "insideLeft",
              offset: -5,
              fill: "#9CA3AF",
              fontSize: 12,
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Scatter data={data.dataPoints} fill={getCorrelationColor()} fillOpacity={0.6} />
          {data.strength !== "none" && Math.abs(data.correlation) > 0.3 && (
            <ReferenceLine
              segment={[
                { x: xMin, y: xMin * data.correlation },
                { x: xMax, y: xMax * data.correlation },
              ]}
              stroke={getCorrelationColor()}
              strokeWidth={2}
              strokeDasharray="5 5"
            />
          )}
        </ScatterChart>
      </ResponsiveContainer>

      {/* Correlation info */}
      <div className="mt-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Correlation:{" "}
              <span className="font-bold" style={{ color: getCorrelationColor() }}>
                {data.correlation.toFixed(2)}
              </span>
            </p>
            <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
              Strength: <span className="font-medium capitalize">{data.strength}</span>
            </p>
          </div>
          <div className="text-right">
            <p className="max-w-xs text-xs text-gray-500 dark:text-gray-400">
              {data.interpretation}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
