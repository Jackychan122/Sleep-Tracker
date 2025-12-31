import type { SleepRecord, WorkoutRecord, MoodEnergyRecord } from "../types";
import type {
  WeeklyReport,
  MonthlyReport,
  ReportStats,
  ReportSummary,
} from "../types/reports.types";
import {
  format,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  subWeeks,
  subMonths,
} from "date-fns";

/**
 * Reports Service
 * Generates weekly and monthly reports with statistics and insights
 */

// ==================== Weekly Reports ====================

export function generateWeeklyReport(
  sleepRecords: SleepRecord[],
  workoutRecords: WorkoutRecord[],
  moodRecords?: MoodEnergyRecord[]
): WeeklyReport {
  const now = new Date();
  const weekStart = startOfWeek(subWeeks(now, 1));
  const weekEnd = endOfWeek(subWeeks(now, 1));

  // Filter records for the week
  const weekSleepRecords = sleepRecords.filter((r) => {
    const recordDate = new Date(r.date);
    return recordDate >= weekStart && recordDate <= weekEnd;
  });

  const weekWorkoutRecords = workoutRecords.filter((r) => {
    const recordDate = new Date(r.date);
    return recordDate >= weekStart && recordDate <= weekEnd;
  });

  const weekMoodRecords = moodRecords?.filter((r) => {
    const recordDate = new Date(r.date);
    return recordDate >= weekStart && recordDate <= weekEnd;
  });

  // Calculate statistics
  const sleepStats = calculateSleepStats(weekSleepRecords);
  const workoutStats = calculateWorkoutStats(weekWorkoutRecords);
  const moodStats = calculateMoodStats(weekMoodRecords || []);

  // Generate summary
  const summary = generateWeeklySummary(sleepStats, workoutStats, moodStats);

  return {
    type: "weekly",
    startDate: format(weekStart, "yyyy-MM-dd"),
    endDate: format(weekEnd, "yyyy-MM-dd"),
    sleepStats,
    workoutStats,
    moodStats,
    summary,
    generatedAt: new Date().toISOString(),
  };
}

// ==================== Monthly Reports ====================

export function generateMonthlyReport(
  sleepRecords: SleepRecord[],
  workoutRecords: WorkoutRecord[],
  moodRecords?: MoodEnergyRecord[]
): MonthlyReport {
  const now = new Date();
  const monthStart = startOfMonth(subMonths(now, 1));
  const monthEnd = endOfMonth(subMonths(now, 1));

  // Filter records for the month
  const monthSleepRecords = sleepRecords.filter((r) => {
    const recordDate = new Date(r.date);
    return recordDate >= monthStart && recordDate <= monthEnd;
  });

  const monthWorkoutRecords = workoutRecords.filter((r) => {
    const recordDate = new Date(r.date);
    return recordDate >= monthStart && recordDate <= monthEnd;
  });

  const monthMoodRecords = moodRecords?.filter((r) => {
    const recordDate = new Date(r.date);
    return recordDate >= monthStart && recordDate <= monthEnd;
  });

  // Calculate statistics
  const sleepStats = calculateSleepStats(monthSleepRecords);
  const workoutStats = calculateWorkoutStats(monthWorkoutRecords);
  const moodStats = calculateMoodStats(monthMoodRecords || []);

  // Generate summary
  const summary = generateMonthlySummary(sleepStats, workoutStats, moodStats);

  // Weekly breakdown
  const weeklyBreakdown = generateWeeklyBreakdown(sleepRecords, workoutRecords, moodRecords);

  return {
    type: "monthly",
    startDate: format(monthStart, "yyyy-MM-dd"),
    endDate: format(monthEnd, "yyyy-MM-dd"),
    sleepStats,
    workoutStats,
    moodStats,
    weeklyBreakdown,
    summary,
    generatedAt: new Date().toISOString(),
  };
}

// ==================== Statistics Calculation ====================

function calculateSleepStats(records: SleepRecord[]): ReportStats {
  if (records.length === 0) {
    return {
      totalRecords: 0,
      averageValue: 0,
      bestValue: 0,
      worstValue: 0,
      trend: "stable",
    };
  }

  const durations = records.map((r) => r.duration);
  const avgDuration = durations.reduce((a, b) => a + b, 0) / durations.length;
  const bestDuration = Math.max(...durations);
  const worstDuration = Math.min(...durations);

  // Simple trend calculation
  const firstHalf = durations.slice(0, Math.floor(durations.length / 2));
  const secondHalf = durations.slice(Math.floor(durations.length / 2));
  const avgFirst = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
  const avgSecond = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;

  let trend: "increasing" | "decreasing" | "stable" = "stable";
  if (avgSecond > avgFirst * 1.05) trend = "increasing";
  else if (avgSecond < avgFirst * 0.95) trend = "decreasing";

  return {
    totalRecords: records.length,
    averageValue: avgDuration,
    bestValue: bestDuration,
    worstValue: worstDuration,
    trend,
  };
}

function calculateWorkoutStats(records: WorkoutRecord[]): ReportStats {
  if (records.length === 0) {
    return {
      totalRecords: 0,
      averageValue: 0,
      bestValue: 0,
      worstValue: 0,
      trend: "stable",
    };
  }

  const durations = records.map((r) => r.duration);
  const avgDuration = durations.reduce((a, b) => a + b, 0) / durations.length;
  const bestDuration = Math.max(...durations);
  const worstDuration = Math.min(...durations);

  return {
    totalRecords: records.length,
    averageValue: avgDuration,
    bestValue: bestDuration,
    worstValue: worstDuration,
    trend: "stable", // Would need more complex calculation
  };
}

function calculateMoodStats(records: MoodEnergyRecord[]): ReportStats {
  if (records.length === 0) {
    return {
      totalRecords: 0,
      averageValue: 0,
      bestValue: 0,
      worstValue: 0,
      trend: "stable",
    };
  }

  const moods = records.map((r) => r.mood);
  // Mood is already stored as a number (1-5), so use it directly
  const moodValues = moods;

  const avgMood = moodValues.reduce((a, b) => a + b, 0) / moodValues.length;
  const bestMood = Math.max(...moodValues);
  const worstMood = Math.min(...moodValues);

  return {
    totalRecords: records.length,
    averageValue: avgMood,
    bestValue: bestMood,
    worstValue: worstMood,
    trend: "stable",
  };
}

// ==================== Summary Generation ====================

function generateWeeklySummary(
  sleepStats: ReportStats,
  workoutStats: ReportStats,
  moodStats: ReportStats
): ReportSummary {
  const summaries: string[] = [];

  if (sleepStats.totalRecords > 0) {
    const avgHours = Math.floor(sleepStats.averageValue / 60);
    const avgMins = Math.floor(sleepStats.averageValue % 60);
    summaries.push(
      `Average sleep: ${avgHours}h ${avgMins}m over ${sleepStats.totalRecords} nights`
    );

    if (sleepStats.trend === "increasing") {
      summaries.push("Sleep duration is improving");
    } else if (sleepStats.trend === "decreasing") {
      summaries.push("Sleep duration is declining");
    }
  } else {
    summaries.push("No sleep records this week");
  }

  if (workoutStats.totalRecords > 0) {
    summaries.push(
      `${workoutStats.totalRecords} workout(s) completed, averaging ${Math.floor(
        workoutStats.averageValue / 60
      )}h ${Math.floor(workoutStats.averageValue % 60)}m each`
    );
  } else {
    summaries.push("No workouts this week");
  }

  if (moodStats.totalRecords > 0) {
    const moodLabels = ["Very Bad", "Bad", "Neutral", "Good", "Very Good"];
    const avgMoodLabel = moodLabels[Math.round(moodStats.averageValue) - 1] || "Neutral";
    summaries.push(`Average mood: ${avgMoodLabel}`);
  }

  return {
    highlights: summaries,
    overall: getOverallSummary(sleepStats, workoutStats, moodStats),
  };
}

function generateMonthlySummary(
  sleepStats: ReportStats,
  workoutStats: ReportStats,
  moodStats: ReportStats
): ReportSummary {
  const summaries: string[] = [];

  if (sleepStats.totalRecords > 0) {
    const avgHours = Math.floor(sleepStats.averageValue / 60);
    const avgMins = Math.floor(sleepStats.averageValue % 60);
    const consistency = (sleepStats.totalRecords / 30) * 100;

    summaries.push(
      `Average sleep: ${avgHours}h ${avgMins}m (${consistency.toFixed(0)}% tracking consistency)`
    );
  }

  if (workoutStats.totalRecords > 0) {
    summaries.push(`${workoutStats.totalRecords} workouts completed this month`);
  }

  if (moodStats.totalRecords > 0) {
    summaries.push(`${moodStats.totalRecords} mood entries logged`);
  }

  return {
    highlights: summaries,
    overall: getOverallSummary(sleepStats, workoutStats, moodStats),
  };
}

function getOverallSummary(
  sleepStats: ReportStats,
  workoutStats: ReportStats,
  _moodStats: ReportStats
): string {
  const scores = [];

  if (sleepStats.totalRecords > 0) {
    const targetSleep = 8 * 60; // 8 hours
    const sleepScore = Math.min(100, (sleepStats.averageValue / targetSleep) * 100);
    scores.push(sleepScore);
  }

  if (workoutStats.totalRecords > 0) {
    const targetWorkouts = 12; // 3x per week
    const workoutScore = Math.min(100, (workoutStats.totalRecords / targetWorkouts) * 100);
    scores.push(workoutScore);
  }

  if (scores.length === 0) {
    return "Start tracking your data to see insights!";
  }

  const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;

  if (avgScore >= 80) {
    return "Excellent progress! You're doing great.";
  } else if (avgScore >= 60) {
    return "Good progress, keep it up!";
  } else if (avgScore >= 40) {
    return "There's room for improvement.";
  }
  return "Focus on building healthy habits.";
}

// ==================== Weekly Breakdown ====================

function generateWeeklyBreakdown(
  sleepRecords: SleepRecord[],
  workoutRecords: WorkoutRecord[],
  _moodRecords?: MoodEnergyRecord[]
): WeeklyReport[] {
  const reports: WeeklyReport[] = [];

  for (let i = 0; i < 4; i++) {
    const now = new Date();
    const weekStart = startOfWeek(subWeeks(now, i + 1));
    const weekEnd = endOfWeek(subWeeks(now, i + 1));

    const weekSleepRecords = sleepRecords.filter((r) => {
      const recordDate = new Date(r.date);
      return recordDate >= weekStart && recordDate <= weekEnd;
    });

    const weekWorkoutRecords = workoutRecords.filter((r) => {
      const recordDate = new Date(r.date);
      return recordDate >= weekStart && recordDate <= weekEnd;
    });

    const sleepStats = calculateSleepStats(weekSleepRecords);
    const workoutStats = calculateWorkoutStats(weekWorkoutRecords);
    const moodStats = calculateMoodStats([]);

    const summary = generateWeeklySummary(sleepStats, workoutStats, moodStats);

    reports.push({
      type: "weekly",
      startDate: format(weekStart, "yyyy-MM-dd"),
      endDate: format(weekEnd, "yyyy-MM-dd"),
      sleepStats,
      workoutStats,
      moodStats,
      summary,
      generatedAt: new Date().toISOString(),
    });
  }

  return reports;
}
