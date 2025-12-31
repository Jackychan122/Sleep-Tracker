// Workout record type definitions

export type WorkoutType =
  | "cardio"
  | "strength"
  | "hiit"
  | "yoga"
  | "pilates"
  | "cycling"
  | "running"
  | "swimming"
  | "walking"
  | "other";

export type IntensityLevel = "low" | "moderate" | "high" | "very-high";

export interface PerformanceMetrics {
  caloriesBurned?: number;
  distance?: number; // in km or miles
  heartRateAvg?: number;
  heartRateMax?: number;
  reps?: number;
  sets?: number;
  weight?: number; // in kg or lbs
}

export interface WorkoutRecord {
  id: string;
  date: string;
  time: string;
  type: WorkoutType;
  duration: number; // in minutes
  intensity: IntensityLevel;
  performanceMetrics: PerformanceMetrics;
  perceivedExertion: number; // 1-10 scale (Borg scale)
  energyLevel: number; // 1-10 scale
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkoutRecordInput {
  date: string;
  time: string;
  type: WorkoutType;
  duration: number;
  intensity: IntensityLevel;
  performanceMetrics: PerformanceMetrics;
  perceivedExertion: number;
  energyLevel: number;
  notes?: string;
}

export interface WorkoutFilters {
  startDate?: string;
  endDate?: string;
  type?: WorkoutType;
  intensity?: IntensityLevel;
  minDuration?: number;
  maxDuration?: number;
}

export interface WorkoutStats {
  totalWorkouts: number;
  totalDuration: number;
  averageDuration: number;
  averagePerceivedExertion: number;
  totalCaloriesBurned: number;
  workoutsByType: Record<WorkoutType, number>;
}
