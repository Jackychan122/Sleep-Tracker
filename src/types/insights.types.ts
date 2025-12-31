// Insights and analytics type definitions

export type InsightType = "trend" | "anomaly" | "correlation" | "recommendation" | "alert";

export type InsightCategory = "duration" | "efficiency" | "phases" | "consistency" | "performance";

export type InsightPriority = "high" | "medium" | "low";

export type TrendDirection = "increasing" | "decreasing" | "stable";

export type TimePeriod = "daily" | "weekly" | "monthly";

export type CorrelationStrength = "strong" | "moderate" | "weak" | "none";

export interface Insight {
  id: string;
  type: InsightType;
  category: InsightCategory;
  title: string;
  description: string;
  priority: InsightPriority;
  data?: any;
  isRead: boolean;
  isDismissed: boolean;
  createdAt: string;
}

export interface Recommendation extends Insight {
  type: "recommendation";
  implemented: boolean;
  impact?: number;
}

export interface TrendData {
  direction: TrendDirection;
  significance: number; // 0-1, indicates R-squared or confidence
  period: string;
  startValue: number;
  endValue: number;
  slope?: number;
}

export interface CorrelationData {
  correlation: number; // -1 to 1
  strength: CorrelationStrength;
  dataPoints: Array<{ x: number; y: number; date: string }>;
  interpretation: string;
}

export interface PhaseDistribution {
  deepSleep: number; // percentage
  remSleep: number; // percentage
  lightSleep: number; // percentage
}

export interface SchedulePattern {
  averageBedtime: string; // HH:MM format
  averageWakeTime: string; // HH:MM format
  bedtimeVariance: number; // standard deviation in minutes
  wakeTimeVariance: number; // standard deviation in minutes
  mostCommonBedtime: string;
  mostCommonWakeTime: string;
}

export interface DailyStats {
  averageDuration: number; // in minutes
  averageEfficiency: number; // percentage
  averageQuality: number; // 0-100 or 1-10
  recordCount: number;
}

export interface WeeklyComparison {
  monday: DailyStats;
  tuesday: DailyStats;
  wednesday: DailyStats;
  thursday: DailyStats;
  friday: DailyStats;
  saturday: DailyStats;
  sunday: DailyStats;
}

export interface PatternAnalysis {
  optimalBedtime: string;
  optimalWakeTime: string;
  optimalDuration: number; // in minutes
  confidence: number; // 0-1
}

export interface Anomaly {
  type: "duration" | "quality" | "efficiency";
  record: any;
  severity: "low" | "medium" | "high";
  message: string;
}

export interface SeasonalityData {
  weekdayAverage: number;
  weekendAverage: number;
  difference: number;
  significance: "significant" | "moderate" | "minimal";
}
