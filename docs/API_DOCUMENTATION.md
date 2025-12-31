# API / Service Layer Documentation

This document describes the service layer functions and APIs available in the Sleep Tracker application.

## Table of Contents

- [Analytics Service](#analytics-service)
- [Insights Service](#insights-service)
- [Goals Service](#goals-service)
- [Reports Service](#reports-service)
- [Data Management Service](#data-management-service)

---

## Analytics Service

**Location**: `src/services/analyticsService.ts`

### Functions

#### `calculateSleepQualityScore(record)`

Calculates a daily sleep quality score (0-100) based on multiple factors.

**Parameters:**
- `record`: `Partial<SleepRecord>` - Sleep record with duration, efficiency, and phases

**Returns**: `number` - Quality score from 0-100

**Scoring Breakdown:**
- Duration: 40% (optimal: 7-9 hours)
- Efficiency: 30% (time asleep vs time in bed)
- Sleep Phases: 20% (deep sleep ~20%, REM ~25%)
- Consistency: 10% (regular schedule)

**Example:**
```typescript
const score = calculateSleepQualityScore({
  duration: 480, // 8 hours
  efficiency: 90,
  deepSleep: 96, // 20%
  remSleep: 120, // 25%
  lightSleep: 264 // 55%
});
// Returns: ~85
```

---

#### `getSleepDurationTrend(records, period)`

Analyzes sleep duration trends over time.

**Parameters:**
- `records`: `SleepRecord[]` - Array of sleep records
- `period`: `'daily' | 'weekly' | 'monthly'` - Time period for analysis

**Returns**: `TrendData` - Trend direction and statistics

---

#### `getSleepPhaseDistribution(records)`

Calculates the distribution of sleep phases.

**Parameters:**
- `records`: `SleepRecord[]` - Array of sleep records

**Returns**: `PhaseDistribution` - Average percentage of each sleep phase

---

#### `getWeeklySleepComparison(records)`

Compares sleep metrics by day of week.

**Parameters:**
- `records`: `SleepRecord[]` - Array of sleep records

**Returns**: `WeeklyComparison` - Statistics for each day

---

#### `getSleepWorkoutCorrelation(sleepRecords, workoutRecords)`

Calculates correlation between sleep and workout metrics.

**Parameters:**
- `sleepRecords`: `SleepRecord[]` - Sleep records
- `workoutRecords`: `WorkoutRecord[]` - Workout records

**Returns**: `CorrelationData` - Correlation coefficient and interpretation

---

#### `detectAnomalies(records)`

Detects unusual sleep patterns.

**Parameters:**
- `records`: `SleepRecord[]` - Sleep records

**Returns**: `Anomaly[]` - Array of detected anomalies

---

## Insights Service

**Location**: `src/services/insightsService.ts`

### Functions

#### `generateAllInsights(sleepRecords, workoutRecords, moodRecords)`

Generates all types of insights based on user data.

**Parameters:**
- `sleepRecords`: `SleepRecord[]` - Sleep records
- `workoutRecords`: `WorkoutRecord[]` (optional) - Workout records
- `moodRecords`: `MoodEnergyRecord[]` (optional) - Mood records

**Returns**: `Insight[]` - Array of generated insights

---

#### `generateTrendInsights(sleepRecords)`

Generates insights about sleep trends.

**Parameters:**
- `sleepRecords`: `SleepRecord[]` - Sleep records

**Returns**: `Insight[]` - Trend insights

---

#### `generateAnomalyInsights(sleepRecords)`

Detects and reports unusual patterns.

**Parameters:**
- `sleepRecords`: `SleepRecord[]` - Sleep records

**Returns**: `Insight[]` - Anomaly insights

---

#### `generateCorrelationInsights(sleepRecords, workoutRecords, moodRecords)`

Finds correlations between different metrics.

**Parameters:**
- `sleepRecords`: `SleepRecord[]` - Sleep records
- `workoutRecords`: `WorkoutRecord[]` - Workout records
- `moodRecords`: `MoodEnergyRecord[]` - Mood records

**Returns**: `Insight[]` - Correlation insights

---

#### `generateRecommendations(sleepRecords)`

Creates actionable recommendations.

**Parameters:**
- `sleepRecords`: `SleepRecord[]` - Sleep records

**Returns**: `Insight[]` - Recommendation insights

---

## Goals Service

**Location**: `src/services/goalsService.ts`

### Functions

#### `calculateStreak(records, dateField, checkFunction)`

Calculates consecutive days meeting criteria.

**Parameters:**
- `records`: `any[]` - Array of records
- `dateField`: `string` - Field name containing date
- `checkFunction`: `(record: any) => boolean` - Function to check if record counts

**Returns**: `number` - Current streak count

**Example:**
```typescript
const streak = calculateStreak(
  sleepRecords,
  'date',
  (record) => record.duration >= 420 // 7+ hours
);
```

---

#### `calculateGoalProgress(goal, sleepRecords, workoutRecords)`

Calculates current progress toward a goal.

**Parameters:**
- `goal`: `Goal` - Goal to calculate progress for
- `sleepRecords`: `SleepRecord[]` - Sleep records
- `workoutRecords`: `WorkoutRecord[]` (optional) - Workout records

**Returns**: `GoalProgress` - Progress data

---

#### `checkGoalAchievement(goal, sleepRecords, workoutRecords)`

Checks if a goal has been achieved.

**Parameters:**
- `goal`: `Goal` - Goal to check
- `sleepRecords`: `SleepRecord[]` - Sleep records
- `workoutRecords`: `WorkoutRecord[]` (optional) - Workout records

**Returns**: `boolean` - Whether goal is achieved

---

#### `getPersonalBests(sleepRecords, workoutRecords)`

Gets personal best records.

**Parameters:**
- `sleepRecords`: `SleepRecord[]` - Sleep records
- `workoutRecords`: `WorkoutRecord[]` (optional) - Workout records

**Returns**: `PersonalBests` - Personal best achievements

---

## Reports Service

**Location**: `src/services/reportsService.ts`

### Functions

#### `generateWeeklyReport(sleepRecords, workoutRecords, moodRecords)`

Generates a weekly summary report.

**Parameters:**
- `sleepRecords`: `SleepRecord[]` - Sleep records
- `workoutRecords`: `WorkoutRecord[]` (optional) - Workout records
- `moodRecords`: `MoodEnergyRecord[]` (optional) - Mood records

**Returns**: `WeeklyReport` - Complete weekly report with statistics

**Report Includes:**
- Sleep statistics (duration, efficiency, quality)
- Workout statistics (frequency, duration, intensity)
- Mood statistics (average mood, energy levels)
- Weekly breakdown by day
- Summary with highlights

---

#### `generateMonthlyReport(sleepRecords, workoutRecords, moodRecords)`

Generates a monthly summary report.

**Parameters:**
- `sleepRecords`: `SleepRecord[]` - Sleep records
- `workoutRecords`: `WorkoutRecord[]` (optional) - Workout records
- `moodRecords`: `MoodEnergyRecord[]` (optional) - Mood records

**Returns**: `MonthlyReport` - Complete monthly report with statistics

---

#### `calculateSleepStats(records)`

Calculates comprehensive sleep statistics.

**Parameters:**
- `records`: `SleepRecord[]` - Sleep records

**Returns**: `SleepStats` - Sleep statistics object

---

#### `calculateWorkoutStats(records)`

Calculates comprehensive workout statistics.

**Parameters:**
- `records`: `WorkoutRecord[]` - Workout records

**Returns**: `WorkoutStats` - Workout statistics object

---

#### `calculateMoodStats(records)`

Calculates comprehensive mood statistics.

**Parameters:**
- `records`: `MoodEnergyRecord[]` - Mood records

**Returns**: `MoodStats` - Mood statistics object

---

## Data Management Service

**Location**: `src/services/dataManagementService.ts`

### Functions

#### `exportAllData(sleepRecords, workoutRecords, moodRecords, goals, insights)`

Exports all application data as JSON.

**Parameters:**
- `sleepRecords`: `SleepRecord[]` - Sleep records
- `workoutRecords`: `WorkoutRecord[]` - Workout records
- `moodRecords`: `MoodEnergyRecord[]` - Mood records
- `goals`: `Goal[]` - Goals
- `insights`: `Insight[]` - Insights

**Returns**: `void` - Triggers file download

**File Format:**
```json
{
  "version": "1.0.0",
  "exportDate": "2025-01-01T00:00:00.000Z",
  "sleepRecords": [...],
  "workoutRecords": [...],
  "moodEnergyRecords": [...],
  "goals": [...],
  "insights": [...]
}
```

---

#### `importFromJSON(jsonString)`

Validates and prepares data for import.

**Parameters:**
- `jsonString`: `string` - JSON string to validate

**Returns**: `ValidationResult` - Validation result with errors/warnings

**ValidationResult:**
```typescript
{
  isValid: boolean,
  errors: string[],
  warnings: string[],
  dataCounts: {
    sleepRecords: number,
    workoutRecords: number,
    moodRecords: number,
    goals: number
  }
}
```

---

#### `parseImportData(jsonString)`

Parses imported JSON into application data.

**Parameters:**
- `jsonString`: `string` - JSON string to parse

**Returns**: `ExportData` - Parsed data object

---

#### `createBackup()`

Creates a timestamped backup of all data.

**Returns**: `void` - Triggers file download

---

#### `clearAllData()`

Clears all data from localStorage.

**Returns**: `OperationResult` - Success status and message

---

## Type Definitions

### SleepRecord

```typescript
interface SleepRecord {
  id: string;
  date: string;
  bedtime: string;
  wakeTime: string;
  duration: number;
  deepSleep?: number;
  remSleep?: number;
  lightSleep?: number;
  efficiency?: number;
  qualityScore?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
```

### WorkoutRecord

```typescript
interface WorkoutRecord {
  id: string;
  date: string;
  time: string;
  type: WorkoutType;
  duration: number;
  intensity: IntensityLevel;
  performanceMetrics?: PerformanceMetrics;
  perceivedExertion: number;
  energyLevel: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
```

### Goal

```typescript
interface Goal {
  id: string;
  title: string;
  description: string;
  type: GoalType;
  category: GoalCategory;
  targetValue: number;
  currentValue: number;
  period: GoalPeriod;
  status: GoalStatus;
  startDate: string;
  endDate?: string;
}
```

### Insight

```typescript
interface Insight {
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
```

---

## Error Handling

All service functions follow these error handling principles:

1. **Validation**: Input parameters are validated before processing
2. **Graceful Degradation**: Functions return sensible defaults for missing data
3. **Error Messages**: Clear, actionable error messages
4. **Type Safety**: Full TypeScript type checking

---

## Performance Considerations

- **Data Size**: Services are optimized for typical personal use (up to 1000 records)
- **Caching**: Some calculations are cached where appropriate
- **Batching**: Consider batching for large data exports
- **Memory**: Services process data in-memory; consider pagination for very large datasets

---

## Testing

All services have comprehensive unit tests. Run tests with:

```bash
npm test
```

For coverage report:

```bash
npm run test:coverage
```
