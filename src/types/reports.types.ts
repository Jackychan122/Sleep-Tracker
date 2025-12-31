// Reports and data management type definitions

import type { SleepRecord, WorkoutRecord, MoodEnergyRecord, Goal, Insight } from "./index";

export type ReportType = "weekly" | "monthly";

export type ReportTrend = "increasing" | "decreasing" | "stable";

export interface ReportStats {
  totalRecords: number;
  averageValue: number; // Average duration, mood score, etc.
  bestValue: number;
  worstValue: number;
  trend: ReportTrend;
}

export interface ReportSummary {
  highlights: string[];
  overall: string;
}

export interface BaseReport {
  type: ReportType;
  startDate: string;
  endDate: string;
  sleepStats: ReportStats;
  workoutStats: ReportStats;
  moodStats: ReportStats;
  summary: ReportSummary;
  generatedAt: string;
}

export interface WeeklyReport extends BaseReport {
  type: "weekly";
}

export interface MonthlyReport extends BaseReport {
  type: "monthly";
  weeklyBreakdown: WeeklyReport[];
}

export interface ExportData {
  version: string;
  exportDate: string;
  sleepRecords: SleepRecord[];
  workoutRecords: WorkoutRecord[];
  moodEnergyRecords: MoodEnergyRecord[];
  goals: Goal[];
  insights: Insight[];
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  dataCounts: {
    sleepRecords: number;
    workoutRecords: number;
    moodEnergyRecords: number;
    goals: number;
    insights: number;
  };
}
