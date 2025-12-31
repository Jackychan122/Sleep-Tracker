import type {
  Goal,
  GoalProgress,
  GoalStats,
  Streak,
  Milestone,
  Achievement,
  PersonalBest,
  GoalType,
  GoalCategory,
  GoalPeriod,
  GoalStatus,
} from "../types";
import type { SleepRecord, WorkoutRecord } from "../types";
import { format, differenceInDays, startOfDay, endOfDay, subDays } from "date-fns";

/**
 * Goals Service
 * Handles goal creation, progress tracking, streak calculation, and achievements
 */

// ==================== Goal Progress Calculation ====================

export function calculateGoalProgress(
  goal: Goal,
  sleepRecords: SleepRecord[],
  workoutRecords: WorkoutRecord[]
): GoalProgress {
  const now = new Date();
  const startDate = new Date(goal.startDate);
  const endDate = goal.endDate ? new Date(goal.endDate) : now;

  let currentValue = 0;
  const targetValue = goal.targetValue;

  // Calculate current value based on goal type
  switch (goal.type) {
    case "sleep-duration": {
      // Average sleep duration in minutes
      const relevantRecords = getRecordsInPeriod(sleepRecords, goal.period, startDate);
      if (relevantRecords.length > 0) {
        currentValue =
          relevantRecords.reduce((sum, r) => sum + r.duration, 0) / relevantRecords.length;
      }
      break;
    }

    case "sleep-quality": {
      // Average sleep quality score
      const relevantRecords = getRecordsInPeriod(sleepRecords, goal.period, startDate);
      if (relevantRecords.length > 0) {
        currentValue =
          relevantRecords.reduce((sum, r) => sum + r.qualityScore, 0) / relevantRecords.length;
      }
      break;
    }

    case "sleep-efficiency": {
      // Average sleep efficiency percentage
      const relevantRecords = getRecordsInPeriod(sleepRecords, goal.period, startDate);
      if (relevantRecords.length > 0) {
        currentValue =
          relevantRecords.reduce((sum, r) => sum + r.efficiency, 0) / relevantRecords.length;
      }
      break;
    }

    case "bedtime-consistency": {
      // Percentage of days with consistent bedtime (within 30 min variance)
      const relevantRecords = getRecordsInPeriod(sleepRecords, goal.period, startDate);
      if (relevantRecords.length > 0) {
        const bedtimes = relevantRecords.map((r) => {
          const date = new Date(r.bedtime);
          return date.getHours() * 60 + date.getMinutes();
        });
        const avgBedtime = bedtimes.reduce((sum, bt) => sum + bt, 0) / bedtimes.length;
        const consistentCount = bedtimes.filter((bt) => Math.abs(bt - avgBedtime) <= 30).length;
        currentValue = (consistentCount / bedtimes.length) * 100;
      }
      break;
    }

    case "workout-frequency": {
      // Number of workouts in period
      const relevantRecords = getRecordsInPeriod(workoutRecords, goal.period, startDate);
      currentValue = relevantRecords.length;
      break;
    }

    case "workout-duration": {
      // Total workout duration in minutes
      const relevantRecords = getRecordsInPeriod(workoutRecords, goal.period, startDate);
      currentValue = relevantRecords.reduce((sum, r) => sum + r.duration, 0);
      break;
    }

    case "streak-days": {
      // Current streak days
      const streak = calculateStreak(sleepRecords);
      currentValue = streak.current;
      break;
    }
  }

  const percentage = Math.min(100, (currentValue / targetValue) * 100);
  const isCompleted = percentage >= 100;

  // Calculate remaining days
  let remainingDays: number | undefined;
  if (goal.endDate) {
    remainingDays = Math.max(0, differenceInDays(endDate, now));
  }

  return {
    goalId: goal.id,
    currentValue,
    targetValue,
    percentage,
    isCompleted,
    remainingDays,
    status: goal.status,
  };
}

function getRecordsInPeriod<T extends { date: string }>(
  records: T[],
  period: GoalPeriod,
  startDate: Date
): T[] {
  const now = new Date();
  let cutoffDate = startOfDay(now);

  switch (period) {
    case "daily":
      cutoffDate = startOfDay(now);
      break;
    case "weekly":
      cutoffDate = subDays(now, 7);
      break;
    case "monthly":
      cutoffDate = subDays(now, 30);
      break;
  }

  return records.filter(
    (r) =>
      new Date(r.date) >= cutoffDate &&
      new Date(r.date) <= endOfDay(now) &&
      new Date(r.date) >= startDate
  );
}

// ==================== Streak Tracking ====================

export function calculateStreak(
  sleepRecords: SleepRecord[],
  _workoutRecords?: WorkoutRecord[]
): Streak {
  if (sleepRecords.length === 0) {
    return {
      current: 0,
      best: 0,
      startDate: new Date().toISOString(),
      lastDate: new Date().toISOString(),
    };
  }

  // Sort records by date descending
  const sortedRecords = [...sleepRecords].sort(
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
      const prevDate = new Date(allDates[i - 1]);
      const currDate = new Date(allDates[i]);
      const diffDays = Math.floor(
        (currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (diffDays === 1) {
        tempStreak++;
      } else {
        bestStreak = Math.max(bestStreak, tempStreak);
        tempStreak = 1;
      }
    }
  }
  bestStreak = Math.max(bestStreak, tempStreak);

  // Find streak start date
  const streakStartDate = new Date();
  streakStartDate.setDate(streakStartDate.getDate() - (currentStreak - 1));

  return {
    current: currentStreak,
    best: bestStreak,
    startDate: streakStartDate.toISOString(),
    lastDate: sortedRecords[0].date,
  };
}

// ==================== Goal Stats ====================

export function calculateGoalStats(goals: Goal[]): GoalStats {
  const totalGoals = goals.length;
  const activeGoals = goals.filter((g) => g.status === "active").length;
  const completedGoals = goals.filter((g) => g.status === "completed").length;
  const failedGoals = goals.filter((g) => g.status === "failed").length;

  const overallCompletionRate = totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0;

  return {
    totalGoals,
    activeGoals,
    completedGoals,
    failedGoals,
    overallCompletionRate,
  };
}

// ==================== Milestones ====================

export function createMilestones(goalId: string): Milestone[] {
  return [
    {
      id: `milestone-${goalId}-25`,
      goalId,
      title: "Good Start!",
      threshold: 25,
      isAchieved: false,
    },
    {
      id: `milestone-${goalId}-50`,
      goalId,
      title: "Halfway There!",
      threshold: 50,
      isAchieved: false,
    },
    {
      id: `milestone-${goalId}-75`,
      goalId,
      title: "Almost There!",
      threshold: 75,
      isAchieved: false,
    },
    {
      id: `milestone-${goalId}-100`,
      goalId,
      title: "Goal Achieved!",
      threshold: 100,
      isAchieved: false,
    },
  ];
}

export function checkMilestones(milestones: Milestone[], progress: number): Milestone[] {
  return milestones.map((milestone) => {
    if (!milestone.isAchieved && progress >= milestone.threshold) {
      return {
        ...milestone,
        isAchieved: true,
        achievedAt: new Date().toISOString(),
      };
    }
    return milestone;
  });
}

// ==================== Achievements ====================

export function getAchievements(
  sleepRecords: SleepRecord[],
  workoutRecords: WorkoutRecord[],
  streak: Streak
): Achievement[] {
  const achievements: Achievement[] = [
    {
      id: "first-sleep",
      title: "First Sleep",
      description: "Log your first sleep record",
      category: "sleep",
      isUnlocked: sleepRecords.length > 0,
      unlockedAt: sleepRecords.length > 0 ? sleepRecords[0].createdAt : undefined,
    },
    {
      id: "sleep-week",
      title: "Week of Sleep",
      description: "Track sleep for 7 consecutive days",
      category: "streaks",
      isUnlocked: streak.best >= 7,
    },
    {
      id: "sleep-month",
      title: "Month of Sleep",
      description: "Track sleep for 30 consecutive days",
      category: "streaks",
      isUnlocked: streak.best >= 30,
    },
    {
      id: "first-workout",
      title: "First Workout",
      description: "Log your first workout",
      category: "workout",
      isUnlocked: workoutRecords.length > 0,
      unlockedAt: workoutRecords.length > 0 ? workoutRecords[0].createdAt : undefined,
    },
    {
      id: "workout-streak-7",
      title: "Week of Workouts",
      description: "Workout for 7 days in a week",
      category: "workout",
      isUnlocked:
        workoutRecords.filter((r) => new Date(r.date) >= subDays(new Date(), 7)).length >= 7,
    },
    {
      id: "perfect-sleep",
      title: "Perfect Sleep",
      description: "Achieve 100% sleep quality score",
      category: "sleep",
      isUnlocked: sleepRecords.some((r) => r.qualityScore >= 100),
    },
    {
      id: "early-bird",
      title: "Early Bird",
      description: "Maintain consistent bedtime for a week",
      category: "milestones",
      isUnlocked: checkBedtimeConsistency(sleepRecords, 7, 30),
    },
    {
      id: "consistency-champion",
      title: "Consistency Champion",
      description: "Maintain consistent bedtime for a month",
      category: "milestones",
      isUnlocked: checkBedtimeConsistency(sleepRecords, 30, 30),
    },
  ];

  return achievements;
}

function checkBedtimeConsistency(
  records: SleepRecord[],
  days: number,
  maxVarianceMinutes: number
): boolean {
  if (records.length < days) return false;

  const recentRecords = records
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, days);

  const bedtimes = recentRecords.map((r) => {
    const date = new Date(r.bedtime);
    return date.getHours() * 60 + date.getMinutes();
  });

  const avgBedtime = bedtimes.reduce((sum, bt) => sum + bt, 0) / bedtimes.length;
  const allConsistent = bedtimes.every((bt) => Math.abs(bt - avgBedtime) <= maxVarianceMinutes);

  return allConsistent;
}

// ==================== Personal Bests ====================

export function getPersonalBests(
  sleepRecords: SleepRecord[],
  workoutRecords: WorkoutRecord[],
  streak: Streak
): PersonalBest[] {
  const personalBests: PersonalBest[] = [];

  // Longest streak
  personalBests.push({
    category: "longest-streak",
    value: streak.best,
    date: streak.startDate,
    description: `${streak.best} days of consistent tracking`,
  });

  // Best sleep quality
  if (sleepRecords.length > 0) {
    const bestQuality = sleepRecords.reduce((best, r) =>
      r.qualityScore > best.qualityScore ? r : best
    );
    personalBests.push({
      category: "best-sleep-quality",
      value: bestQuality.qualityScore,
      date: bestQuality.date,
      description: `Quality score of ${bestQuality.qualityScore}`,
    });
  }

  // Most workouts in a week
  if (workoutRecords.length > 0) {
    const weekAgo = subDays(new Date(), 7);
    const workoutsInWeek = workoutRecords.filter((r) => new Date(r.date) >= weekAgo);
    const maxWorkouts = Math.max(
      workoutRecords.filter((r) => new Date(r.date) >= weekAgo).length,
      workoutsInWeek.length
    );
    personalBests.push({
      category: "most-workouts",
      value: maxWorkouts,
      date: new Date().toISOString(),
      description: `${maxWorkouts} workouts in a week`,
    });
  }

  return personalBests;
}

// ==================== Goal Suggestions ====================

export function getSuggestedGoals(
  sleepRecords: SleepRecord[],
  workoutRecords: WorkoutRecord[]
): Array<{
  type: GoalType;
  category: GoalCategory;
  title: string;
  description: string;
  targetValue: number;
  period: GoalPeriod;
}> {
  const suggestions: Array<{
    type: GoalType;
    category: GoalCategory;
    title: string;
    description: string;
    targetValue: number;
    period: GoalPeriod;
  }> = [];

  // Analyze current data to suggest appropriate goals
  if (sleepRecords.length > 0) {
    const avgDuration = sleepRecords.reduce((sum, r) => sum + r.duration, 0) / sleepRecords.length;

    if (avgDuration < 7 * 60) {
      suggestions.push({
        type: "sleep-duration",
        category: "sleep",
        title: "Improve Sleep Duration",
        description: "Aim for at least 7 hours of sleep per night",
        targetValue: 7 * 60, // 7 hours in minutes
        period: "daily",
      });
    }

    const avgQuality =
      sleepRecords.reduce((sum, r) => sum + r.qualityScore, 0) / sleepRecords.length;

    if (avgQuality < 70) {
      suggestions.push({
        type: "sleep-quality",
        category: "sleep",
        title: "Boost Sleep Quality",
        description: "Work towards improving your sleep quality score",
        targetValue: 75,
        period: "weekly",
      });
    }
  }

  if (workoutRecords.length > 0) {
    const weeklyWorkouts = workoutRecords.filter(
      (r) => new Date(r.date) >= subDays(new Date(), 7)
    ).length;

    if (weeklyWorkouts < 3) {
      suggestions.push({
        type: "workout-frequency",
        category: "workout",
        title: "Exercise More",
        description: "Aim for at least 3 workouts per week",
        targetValue: 3,
        period: "weekly",
      });
    }
  }

  return suggestions;
}

// ==================== Goal Status Update ====================

export function updateGoalStatus(goal: Goal, progress: GoalProgress): GoalStatus {
  if (progress.isCompleted) {
    return "completed";
  }

  if (goal.endDate) {
    const now = new Date();
    const endDate = new Date(goal.endDate);
    if (now > endDate && !progress.isCompleted) {
      return "failed";
    }
  }

  return goal.status;
}
