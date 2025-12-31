// Sleep record type definitions

export interface SleepRecord {
  id: string;
  date: string;
  bedtime: string;
  wakeTime: string;
  duration: number; // in minutes
  deepSleep: number; // in minutes
  remSleep: number; // in minutes
  lightSleep: number; // in minutes
  efficiency: number; // percentage (0-100)
  qualityScore: number; // 1-10 scale
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SleepRecordInput {
  date: string;
  bedtime: string;
  wakeTime: string;
  duration: number;
  deepSleep: number;
  remSleep: number;
  lightSleep: number;
  efficiency: number;
  qualityScore: number;
  notes?: string;
}

export interface SleepFilters {
  startDate?: string;
  endDate?: string;
  minQualityScore?: number;
  maxQualityScore?: number;
  minDuration?: number;
  maxDuration?: number;
}

export interface SleepStats {
  averageDuration: number;
  averageQualityScore: number;
  averageEfficiency: number;
  totalRecords: number;
  bestSleepRecord: SleepRecord | null;
  worstSleepRecord: SleepRecord | null;
}
