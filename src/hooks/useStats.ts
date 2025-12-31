// Custom hook for quick statistics calculations

import { useMemo } from "react";
import { useSleepStore, useWorkoutStore, useMoodEnergyStore } from "../stores";
import {
  calculateAverageDuration,
  calculateAverageEfficiency,
  calculateAverageQuality,
  calculateStreak,
  formatDuration,
} from "../utils/chart";
import type { SleepRecord } from "../types";

export interface QuickStats {
  // Sleep stats
  averageSleepDuration: number;
  averageSleepDurationFormatted: string;
  averageSleepEfficiency: number;
  averageSleepQuality: number;
  totalSleepRecords: number;

  // Streaks
  currentStreak: number;
  bestStreak: number;

  // Recent activity
  recentSleepRecords: SleepRecord[];
  recentWorkoutCount: number;
  recentMoodEnergyCount: number;
}

export function useStats(days: number = 7): QuickStats {
  const sleepRecords = useSleepStore((state) => state.records);
  const workoutRecords = useWorkoutStore((state) => state.records);
  const moodEnergyRecords = useMoodEnergyStore((state) => state.records);

  const stats = useMemo(() => {
    // Filter records for the specified number of days
    const now = new Date();
    const cutoffDate = new Date(now);
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const cutoffDateStr = cutoffDate.toISOString().split("T")[0];

    const recentSleepRecords = sleepRecords
      .filter((r) => r.date >= cutoffDateStr)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);

    const recentWorkoutRecords = workoutRecords.filter((r) => r.date >= cutoffDateStr);
    const recentMoodEnergyRecords = moodEnergyRecords.filter((r) => r.date >= cutoffDateStr);

    // Calculate averages from recent records
    const avgDuration = calculateAverageDuration(recentSleepRecords);
    const avgEfficiency = calculateAverageEfficiency(recentSleepRecords);
    const avgQuality = calculateAverageQuality(recentSleepRecords);

    // Calculate streaks from all records
    const { current: currentStreak, best: bestStreak } = calculateStreak(sleepRecords);

    return {
      averageSleepDuration: avgDuration,
      averageSleepDurationFormatted: formatDuration(avgDuration),
      averageSleepEfficiency: avgEfficiency,
      averageSleepQuality: avgQuality,
      totalSleepRecords: recentSleepRecords.length,
      currentStreak,
      bestStreak,
      recentSleepRecords,
      recentWorkoutCount: recentWorkoutRecords.length,
      recentMoodEnergyCount: recentMoodEnergyRecords.length,
    };
  }, [sleepRecords, workoutRecords, moodEnergyRecords, days]);

  return stats;
}
