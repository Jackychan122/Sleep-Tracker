// Phase chart component showing sleep phase distribution

import { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Moon } from "lucide-react";
import { useAnalytics } from "../../hooks";
import { formatDuration } from "../../utils/chart";

export interface PhaseChartProps {
  startDate?: string;
  endDate?: string;
}

export function PhaseChart({ startDate, endDate }: PhaseChartProps) {
  const { phaseDistribution, totalRecords } = useAnalytics(startDate, endDate);

  const chartData = useMemo(() => {
    const total = phaseDistribution.reduce((sum, phase) => sum + phase.value, 0);
    return phaseDistribution.map((phase) => ({
      ...phase,
      percentage: total > 0 ? Math.round((phase.value / total) * 100) : 0,
      hours: Math.round((phase.value / 60) * 10) / 10,
    }));
  }, [phaseDistribution]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="rounded-lg border border-gray-200 bg-white px-4 py-2 shadow-lg">
          <p className="text-sm font-medium text-gray-900">{data.name}</p>
          <p className="text-sm text-gray-600">
            {formatDuration(data.value)} ({data.percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }: any) => {
    return (
      <div className="mt-4 flex flex-wrap justify-center gap-4">
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-sm text-gray-600">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Moon className="h-5 w-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900">Sleep Phase Distribution</h3>
        </div>
        <div className="text-sm text-gray-600">
          {totalRecords} {totalRecords === 1 ? "record" : "records"}
        </div>
      </div>

      {chartData.every((d) => d.value === 0) ? (
        <div className="py-12 text-center text-gray-500">
          <p>No data available</p>
          <p className="mt-2 text-sm">Add sleep records to see phase distribution</p>
        </div>
      ) : (
        <>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                  label={(entry) => `${entry.percentage}%`}
                  labelLine={false}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend content={<CustomLegend />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Phase breakdown */}
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {chartData.map((phase) => (
              <div
                key={phase.name}
                className="flex items-center justify-between rounded-lg bg-gray-50 p-3"
              >
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: phase.color }} />
                  <span className="text-sm font-medium text-gray-900">{phase.name}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{phase.hours}h</p>
                  <p className="text-xs text-gray-500">{phase.percentage}%</p>
                </div>
              </div>
            ))}
          </div>

          {/* Phase info */}
          <div className="mt-4 border-t border-gray-200 pt-4">
            <div className="space-y-1 text-xs text-gray-500">
              <p>
                <span className="font-medium">Deep Sleep:</span> Restorative sleep for physical
                recovery
              </p>
              <p>
                <span className="font-medium">REM Sleep:</span> Important for memory and learning
              </p>
              <p>
                <span className="font-medium">Light Sleep:</span> Transitional sleep between phases
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
