import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { SleepRecord } from "../../types";
import { format } from "date-fns";

interface ScheduleScatterProps {
  data: SleepRecord[];
}

interface ScatterDataPoint {
  x: number; // bedtime in hours
  y: number; // wake time in hours
  date: string;
  qualityScore: number;
  duration: number;
}

export function ScheduleScatter({ data }: ScheduleScatterProps) {
  // Convert sleep records to scatter plot data points
  const scatterData: ScatterDataPoint[] = data.map((record) => {
    const bedtimeDate = new Date(record.bedtime);
    const wakeTimeDate = new Date(record.wakeTime);

    // Convert to hours (handle times past midnight)
    const bedtimeHours = bedtimeDate.getHours() + bedtimeDate.getMinutes() / 60;
    let wakeTimeHours = wakeTimeDate.getHours() + wakeTimeDate.getMinutes() / 60;

    // If wake time is earlier than bedtime, it's the next day
    if (wakeTimeHours < bedtimeHours) {
      wakeTimeHours += 24;
    }

    return {
      x: Number(bedtimeHours.toFixed(2)),
      y: Number(wakeTimeHours.toFixed(2)),
      date: record.date,
      qualityScore: record.qualityScore,
      duration: record.duration,
    };
  });

  // Get color based on quality score
  const getColor = (qualityScore: number): string => {
    if (qualityScore >= 80) return "#22c55e"; // green
    if (qualityScore >= 60) return "#3b82f6"; // blue
    if (qualityScore >= 40) return "#eab308"; // yellow
    return "#ef4444"; // red
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as ScatterDataPoint;
      const bedtimeHours = Math.floor(data.x);
      const bedtimeMins = Math.round((data.x - bedtimeHours) * 60);
      const bedtimeFormatted = `${bedtimeHours
        .toString()
        .padStart(2, "0")}:${bedtimeMins.toString().padStart(2, "0")}`;

      const wakeTimeHours = Math.floor(data.y % 24);
      const wakeTimeMins = Math.round((data.y - Math.floor(data.y)) * 60);
      const wakeTimeFormatted = `${wakeTimeHours
        .toString()
        .padStart(2, "0")}:${wakeTimeMins.toString().padStart(2, "0")}`;

      return (
        <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-lg dark:border-gray-700 dark:bg-gray-800">
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {format(new Date(data.date), "MMM d, yyyy")}
          </p>
          <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
            Bedtime: {bedtimeFormatted}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400">Wake Time: {wakeTimeFormatted}</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Duration: {Math.floor(data.duration / 60)}h {data.duration % 60}m
          </p>
          <p className="mt-1 text-xs font-medium" style={{ color: getColor(data.qualityScore) }}>
            Quality: {data.qualityScore}
          </p>
        </div>
      );
    }
    return null;
  };

  // Format axis labels
  const formatHour = (hour: number): string => {
    const adjustedHour = hour % 24;
    const h = Math.floor(adjustedHour);
    const m = Math.round((adjustedHour - h) * 60);
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
  };

  if (scatterData.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">No schedule data available</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
        <XAxis
          type="number"
          dataKey="x"
          domain={[18, 30]} // 6 PM to 6 AM next day
          tickFormatter={formatHour}
          tick={{ fill: "#9CA3AF", fontSize: 12 }}
          label={{
            value: "Bedtime",
            position: "insideBottom",
            offset: -10,
            fill: "#9CA3AF",
            fontSize: 12,
          }}
        />
        <YAxis
          type="number"
          dataKey="y"
          domain={[4, 12]} // 4 AM to 12 PM
          tickFormatter={formatHour}
          tick={{ fill: "#9CA3AF", fontSize: 12 }}
          label={{
            value: "Wake Time",
            angle: -90,
            position: "insideLeft",
            offset: -5,
            fill: "#9CA3AF",
            fontSize: 12,
          }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Scatter data={scatterData}>
          {scatterData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={getColor(entry.qualityScore)}
              fillOpacity={0.7}
              stroke={getColor(entry.qualityScore)}
              strokeWidth={1}
            />
          ))}
        </Scatter>
      </ScatterChart>
    </ResponsiveContainer>
  );
}
