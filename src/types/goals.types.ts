// Goals and gamification type definitions

export type GoalType =
  | "sleep-duration"
  | "sleep-quality"
  | "sleep-efficiency"
  | "bedtime-consistency"
  | "workout-frequency"
  | "workout-duration"
  | "streak-days";

export type GoalPeriod = "daily" | "weekly" | "monthly";

export type GoalStatus = "active" | "completed" | "paused" | "failed";

export type GoalCategory = "sleep" | "workout" | "consistency" | "custom";

export interface Goal {
  id: string;
  title: string;
  description: string;
  type: GoalType;
  category: GoalCategory;
  targetValue: number; // Target value based on goal type
  currentValue: number; // Current progress value
  period: GoalPeriod;
  status: GoalStatus;
  startDate: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GoalInput {
  title: string;
  description: string;
  type: GoalType;
  category: GoalCategory;
  targetValue: number;
  period: GoalPeriod;
  endDate?: string;
}

export interface GoalProgress {
  goalId: string;
  currentValue: number;
  targetValue: number;
  percentage: number;
  isCompleted: boolean;
  remainingDays?: number;
  status: GoalStatus;
}

export interface Streak {
  current: number; // Current consecutive days
  best: number; // Best streak ever
  startDate: string; // Start date of current streak
  lastDate: string; // Last date tracked
}

export interface Milestone {
  id: string;
  goalId: string;
  title: string;
  threshold: number; // Percentage threshold (e.g., 25, 50, 75, 100)
  achievedAt?: string;
  isAchieved: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon?: string;
  unlockedAt?: string;
  isUnlocked: boolean;
  category: "sleep" | "workout" | "streaks" | "milestones";
}

export interface PersonalBest {
  category: "longest-streak" | "best-sleep-quality" | "most-workouts" | "highest-consistency";
  value: number;
  date: string;
  description: string;
}

export interface GoalStats {
  totalGoals: number;
  activeGoals: number;
  completedGoals: number;
  failedGoals: number;
  overallCompletionRate: number;
}
