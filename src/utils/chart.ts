// Chart utility functions for data formatting and transformations

import { format, parseISO, startOfDay, endOfDay, subDays, subMonths } from "date-fns";
import type { SleepRecord } from "../types";

export interface ChartDataPoint {
  date: string;
  value: number;
  label?: string;
}

export interface ContributionData {
  date: string;
  value: number;
  record?: SleepRecord;
}

/**
 * Format sleep duration from minutes to hours and minutes
 */
export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}

/**
 * Format date for chart labels
 */
export function formatChartDate(date: string, formatStr: string = "MMM dd"): string {
  try {
    return format(parseISO(date), formatStr);
  } catch {
    return date;
  }
}

/**
 * Convert sleep records to chart data points for duration trend
 */
export function sleepRecordsToDurationData(records: SleepRecord[]): ChartDataPoint[] {
  return records
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((record) => ({
      date: record.date,
      value: record.duration,
      label: formatChartDate(record.date),
    }));
}

/**
 * Convert sleep records to chart data points for efficiency trend
 */
export function sleepRecordsToEfficiencyData(records: SleepRecord[]): ChartDataPoint[] {
  return records
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((record) => ({
      date: record.date,
      value: record.efficiency,
      label: formatChartDate(record.date),
    }));
}

/**
 * Calculate sleep phase distribution data
 */
export interface PhaseDistribution {
  name: string;
  value: number;
  color: string;
}

export function calculatePhaseDistribution(records: SleepRecord[]): PhaseDistribution[] {
  const totalDeep = records.reduce((sum, r) => sum + r.deepSleep, 0);
  const totalREM = records.reduce((sum, r) => sum + r.remSleep, 0);
  const totalLight = records.reduce((sum, r) => sum + r.lightSleep, 0);

  return [
    { name: "Deep Sleep", value: totalDeep, color: "#3b82f6" },
    { name: "REM Sleep", value: totalREM, color: "#8b5cf6" },
    { name: "Light Sleep", value: totalLight, color: "#94a3b8" },
  ];
}

/**
 * Calculate average duration for a set of records
 */
export function calculateAverageDuration(records: SleepRecord[]): number {
  if (records.length === 0) return 0;
  const total = records.reduce((sum, r) => sum + r.duration, 0);
  return Math.round(total / records.length);
}

/**
 * Calculate average efficiency for a set of records
 */
export function calculateAverageEfficiency(records: SleepRecord[]): number {
  if (records.length === 0) return 0;
  const total = records.reduce((sum, r) => sum + r.efficiency, 0);
  return Math.round(total / records.length);
}

/**
 * Calculate average quality score for a set of records
 */
export function calculateAverageQuality(records: SleepRecord[]): number {
  if (records.length === 0) return 0;
  const total = records.reduce((sum, r) => sum + r.qualityScore, 0);
  return Math.round((total / records.length) * 10) / 10;
}

/**
 * Generate contribution graph data for a date range
 */
export function generateContributionData(
  records: SleepRecord[],
  startDate: Date,
  endDate: Date,
  metric: "duration" | "quality" | "efficiency" = "quality"
): ContributionData[] {
  const data: ContributionData[] = [];
  const recordMap = new Map(records.map((r) => [r.date, r]));

  const currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    const dateStr = format(currentDate, "yyyy-MM-dd");
    const record = recordMap.get(dateStr);

    let value = 0;
    if (record) {
      switch (metric) {
        case "duration":
          value = record.duration;
          break;
        case "quality":
          value = record.qualityScore;
          break;
        case "efficiency":
          value = record.efficiency;
          break;
      }
    }

    data.push({
      date: dateStr,
      value,
      record,
    });

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return data;
}

/**
 * Get date range presets
 */
export interface DateRangePreset {
  label: string;
  startDate: Date;
  endDate: Date;
}

export function getDateRangePresets(): DateRangePreset[] {
  const now = new Date();
  const today = startOfDay(now);

  return [
    {
      label: "Last 7 Days",
      startDate: subDays(today, 6),
      endDate: endOfDay(now),
    },
    {
      label: "Last 30 Days",
      startDate: subDays(today, 29),
      endDate: endOfDay(now),
    },
    {
      label: "Last 90 Days",
      startDate: subDays(today, 89),
      endDate: endOfDay(now),
    },
    {
      label: "Last 3 Months",
      startDate: subMonths(today, 3),
      endDate: endOfDay(now),
    },
    {
      label: "Last 6 Months",
      startDate: subMonths(today, 6),
      endDate: endOfDay(now),
    },
    {
      label: "Last Year",
      startDate: subMonths(today, 12),
      endDate: endOfDay(now),
    },
  ];
}

/**
 * Calculate color scale value for contribution graph
 */
export function getColorScale(
  value: number,
  metric: "duration" | "quality" | "efficiency" = "quality"
): string {
  if (value === 0) return "#ebedf0"; // No data

  switch (metric) {
    case "duration":
      // Duration: 0-300 min (5 hours) to 600+ min (10 hours)
      if (value < 300) return "#9be9a8";
      if (value < 360) return "#40c463";
      if (value < 420) return "#30a14e";
      if (value < 480) return "#216e39";
      return "#0e4429";
    case "quality":
      // Quality: 1-10 scale
      if (value < 4) return "#9be9a8";
      if (value < 6) return "#40c463";
      if (value < 8) return "#30a14e";
      if (value < 9) return "#216e39";
      return "#0e4429";
    case "efficiency":
      // Efficiency: 0-100%
      if (value < 60) return "#9be9a8";
      if (value < 70) return "#40c463";
      if (value < 80) return "#30a14e";
      if (value < 90) return "#216e39";
      return "#0e4429";
    default:
      return "#ebedf0";
  }
}

/**
 * Calculate streak (consecutive days with records)
 */
export function calculateStreak(records: SleepRecord[]): { current: number; best: number } {
  if (records.length === 0) return { current: 0, best: 0 };

  const sortedRecords = [...records].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  const recordDates = new Set(sortedRecords.map((r) => r.date));

  // Calculate current streak
  let currentStreak = 0;
  const checkDate = new Date();
  const todayStr = format(checkDate, "yyyy-MM-dd");

  // If no record today, check from yesterday
  if (!recordDates.has(todayStr)) {
    checkDate.setDate(checkDate.getDate() - 1);
  }

  // Calculate current streak with safety limit
  const maxIterations = 1000;
  let iterations = 0;
  while (iterations < maxIterations) {
    iterations++;
    const dateStr = format(checkDate, "yyyy-MM-dd");
    if (recordDates.has(dateStr)) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  // Calculate best streak
  let bestStreak = 0;
  let tempStreak = 0;
  const allDates = Array.from(recordDates).sort();

  for (let i = 0; i < allDates.length; i++) {
    if (i === 0) {
      tempStreak = 1;
    } else {
      const prevDate = parseISO(allDates[i - 1]);
      const currDate = parseISO(allDates[i]);
      const diffDays = (currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24);

      if (diffDays === 1) {
        tempStreak++;
      } else {
        bestStreak = Math.max(bestStreak, tempStreak);
        tempStreak = 1;
      }
    }
  }
  bestStreak = Math.max(bestStreak, tempStreak);

  return { current: currentStreak, best: bestStreak };
}

/**
 * Group records by week for contribution graph
 */
export interface WeekData {
  days: ContributionData[];
  weekStart: string;
}

export function groupByWeek(data: ContributionData[]): WeekData[] {
  const weeks: WeekData[] = [];
  let currentWeek: ContributionData[] = [];

  for (let i = 0; i < data.length; i++) {
    const dayData = data[i];
    const dayOfWeek = new Date(dayData.date).getDay();

    if (dayOfWeek === 0 && currentWeek.length > 0) {
      weeks.push({
        days: currentWeek,
        weekStart: currentWeek[0].date,
      });
      currentWeek = [];
    }

    currentWeek.push(dayData);
  }

  if (currentWeek.length > 0) {
    weeks.push({
      days: currentWeek,
      weekStart: currentWeek[0].date,
    });
  }

  return weeks;
}
