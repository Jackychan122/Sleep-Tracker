// Mood and Energy record type definitions

export type MoodRating = 1 | 2 | 3 | 4 | 5;

export interface MoodEnergyRecord {
  id: string;
  date: string;
  mood: MoodRating;
  morningEnergy: number; // 1-10 scale
  afternoonEnergy: number; // 1-10 scale
  eveningEnergy: number; // 1-10 scale
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MoodEnergyInput {
  date: string;
  mood: MoodRating;
  morningEnergy: number;
  afternoonEnergy: number;
  eveningEnergy: number;
  notes?: string;
}

export interface MoodEnergyFilters {
  startDate?: string;
  endDate?: string;
  minMood?: MoodRating;
  maxMood?: MoodRating;
}

export interface MoodEnergyStats {
  averageMood: number;
  averageMorningEnergy: number;
  averageAfternoonEnergy: number;
  averageEveningEnergy: number;
  totalRecords: number;
  moodDistribution: Record<MoodRating, number>;
}
