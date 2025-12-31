import type { SleepRecord, WorkoutRecord } from "../types";
import type {
  TrendData,
  CorrelationData,
  PhaseDistribution,
  SchedulePattern,
  WeeklyComparison,
  DailyStats,
  SeasonalityData,
  CorrelationStrength,
  TrendDirection,
} from "../types";

/**
 * Analytics Service
 * Provides comprehensive analytics for sleep, workout, and mood data
 */

// ==================== Sleep Quality Scoring ====================

export function calculateSleepQualityScore(record: Partial<SleepRecord>): number {
  // 1. Duration Score (0-40 points)
  const optimalDuration = 8 * 60; // 8 hours in minutes
  const minDuration = 6 * 60; // 6 hours
  const maxDuration = 10 * 60; // 10 hours

  let durationScore = 0;
  const duration = record.duration || 0;

  if (duration >= minDuration && duration <= maxDuration) {
    // Linear interpolation from min to optimal
    if (duration <= optimalDuration) {
      durationScore = ((duration - minDuration) / (optimalDuration - minDuration)) * 40;
    } else {
      // Diminishing returns beyond optimal
      durationScore = 40 - ((duration - optimalDuration) / (maxDuration - optimalDuration)) * 10;
    }
  }

  // 2. Efficiency Score (0-30 points)
  const efficiency = record.efficiency || 85;
  const efficiencyScore = efficiency * 0.3;

  // 3. Sleep Phase Balance Score (0-20 points)
  const phaseScore = calculatePhaseScore(record);

  // 4. Consistency Score (0-10 points)
  // Baseline score for initial implementation
  const consistencyScore = 7;

  // Total Score
  const totalScore = Math.round(durationScore + efficiencyScore + phaseScore + consistencyScore);

  return Math.max(0, Math.min(100, totalScore));
}

function calculatePhaseScore(record: Partial<SleepRecord>): number {
  const total = record.duration || 0;
  if (!total || total === 0) return 0;

  const deepSleep = record.deepSleep || 0;
  const remSleep = record.remSleep || 0;

  // Optimal percentages
  const optimalDeepPercent = 0.2; // 20%
  const optimalRemPercent = 0.25; // 25%

  const actualDeepPercent = deepSleep / total;
  const actualRemPercent = remSleep / total;

  // Calculate deviation from optimal
  const deepDeviation = Math.abs(actualDeepPercent - optimalDeepPercent);
  const remDeviation = Math.abs(actualRemPercent - optimalRemPercent);

  // Score based on deviation (lower deviation = higher score)
  const deepScore = Math.max(0, 10 - deepDeviation * 50);
  const remScore = Math.max(0, 10 - remDeviation * 40);

  return deepScore + remScore;
}

// ==================== Trend Analysis ====================

export function analyzeTrend(values: number[], dates: string[]): TrendData {
  if (values.length < 2) {
    return {
      direction: "stable",
      significance: 0,
      period: "week",
      startValue: 0,
      endValue: 0,
    };
  }

  // Calculate linear regression
  const n = values.length;
  const sumX = values.reduce((sum, _, i) => sum + i, 0);
  const sumY = values.reduce((sum, val) => sum + val, 0);
  const sumXY = values.reduce((sum, val, i) => sum + i * val, 0);
  const sumX2 = values.reduce((sum, _, i) => sum + i * i, 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);

  // Calculate R-squared for significance
  const meanY = sumY / n;
  const ssTotal = values.reduce((sum, val) => sum + Math.pow(val - meanY, 2), 0);
  const ssResidual = values.reduce((sum, val, i) => {
    const predicted = slope * i + (sumY - slope * sumX) / n;
    return sum + Math.pow(val - predicted, 2);
  }, 0);
  const rSquared = ssTotal === 0 ? 0 : 1 - ssResidual / ssTotal;

  // Determine direction
  let direction: TrendDirection;
  if (Math.abs(slope) < 0.1) {
    direction = "stable";
  } else if (slope > 0) {
    direction = "increasing";
  } else {
    direction = "decreasing";
  }

  // Determine period
  const dateRange = Math.floor(
    (new Date(dates[dates.length - 1]).getTime() - new Date(dates[0]).getTime()) /
      (1000 * 60 * 60 * 24)
  );
  let period = "week";
  if (dateRange > 30) period = "monthly";
  else if (dateRange > 7) period = "weekly";

  return {
    direction,
    significance: rSquared,
    period,
    startValue: values[0],
    endValue: values[values.length - 1],
    slope,
  };
}

export function getSleepDurationTrend(
  records: SleepRecord[],
  _period: "daily" | "weekly" | "monthly" = "daily"
): TrendData {
  if (records.length === 0) {
    return {
      direction: "stable",
      significance: 0,
      period: "daily",
      startValue: 0,
      endValue: 0,
    };
  }

  const sortedRecords = [...records].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const values = sortedRecords.map((r) => r.duration);
  const dates = sortedRecords.map((r) => r.date);

  return analyzeTrend(values, dates);
}

export function getSleepEfficiencyTrend(records: SleepRecord[]): TrendData {
  if (records.length === 0) {
    return {
      direction: "stable",
      significance: 0,
      period: "daily",
      startValue: 0,
      endValue: 0,
    };
  }

  const sortedRecords = [...records].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const values = sortedRecords.map((r) => r.efficiency);
  const dates = sortedRecords.map((r) => r.date);

  return analyzeTrend(values, dates);
}

// ==================== Phase Distribution ====================

export function getSleepPhaseDistribution(records: SleepRecord[]): PhaseDistribution {
  if (records.length === 0) {
    return {
      deepSleep: 0,
      remSleep: 0,
      lightSleep: 0,
    };
  }

  const totalDeepSleep = records.reduce((sum, r) => sum + (r.deepSleep || 0), 0);
  const totalRemSleep = records.reduce((sum, r) => sum + (r.remSleep || 0), 0);
  const totalLightSleep = records.reduce((sum, r) => sum + (r.lightSleep || 0), 0);
  const totalDuration = totalDeepSleep + totalRemSleep + totalLightSleep;

  if (totalDuration === 0) {
    return {
      deepSleep: 0,
      remSleep: 0,
      lightSleep: 0,
    };
  }

  return {
    deepSleep: (totalDeepSleep / totalDuration) * 100,
    remSleep: (totalRemSleep / totalDuration) * 100,
    lightSleep: (totalLightSleep / totalDuration) * 100,
  };
}

// ==================== Schedule Patterns ====================

export function getBedtimeWakeTimePatterns(records: SleepRecord[]): SchedulePattern {
  if (records.length === 0) {
    return {
      averageBedtime: "22:00",
      averageWakeTime: "06:00",
      bedtimeVariance: 0,
      wakeTimeVariance: 0,
      mostCommonBedtime: "22:00",
      mostCommonWakeTime: "06:00",
    };
  }

  // Convert bedtimes and wake times to minutes from midnight
  const bedtimes = records.map((r) => {
    const date = new Date(r.bedtime);
    return date.getHours() * 60 + date.getMinutes();
  });

  const wakeTimes = records.map((r) => {
    const date = new Date(r.wakeTime);
    return date.getHours() * 60 + date.getMinutes();
  });

  // Calculate averages
  const avgBedtimeMinutes = bedtimes.reduce((sum, bt) => sum + bt, 0) / bedtimes.length;
  const avgWakeTimeMinutes = wakeTimes.reduce((sum, wt) => sum + wt, 0) / wakeTimes.length;

  // Calculate variance (standard deviation)
  const bedtimeVariance =
    Math.sqrt(
      bedtimes.reduce((sum, bt) => sum + Math.pow(bt - avgBedtimeMinutes, 2), 0) / bedtimes.length
    ) / 60; // Convert to hours

  const wakeTimeVariance =
    Math.sqrt(
      wakeTimes.reduce((sum, wt) => sum + Math.pow(wt - avgWakeTimeMinutes, 2), 0) /
        wakeTimes.length
    ) / 60; // Convert to hours

  // Find most common bedtime and wake time (mode)
  const bedtimeMinutesMap = new Map<number, number>();
  bedtimes.forEach((bt) => {
    bedtimeMinutesMap.set(bt, (bedtimeMinutesMap.get(bt) || 0) + 1);
  });
  const mostCommonBedtimeMinutes = [...bedtimeMinutesMap.entries()].reduce((a, b) =>
    a[1] > b[1] ? a : b
  )[0];

  const wakeTimeMinutesMap = new Map<number, number>();
  wakeTimes.forEach((wt) => {
    wakeTimeMinutesMap.set(wt, (wakeTimeMinutesMap.get(wt) || 0) + 1);
  });
  const mostCommonWakeTimeMinutes = [...wakeTimeMinutesMap.entries()].reduce((a, b) =>
    a[1] > b[1] ? a : b
  )[0];

  // Convert back to HH:MM format
  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60) % 24;
    const mins = Math.floor(minutes % 60);
    return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`;
  };

  return {
    averageBedtime: formatTime(avgBedtimeMinutes),
    averageWakeTime: formatTime(avgWakeTimeMinutes),
    bedtimeVariance: Math.round(bedtimeVariance * 60), // Convert back to minutes
    wakeTimeVariance: Math.round(wakeTimeVariance * 60),
    mostCommonBedtime: formatTime(mostCommonBedtimeMinutes),
    mostCommonWakeTime: formatTime(mostCommonWakeTimeMinutes),
  };
}

// ==================== Weekly Comparison ====================

export function getWeeklySleepComparison(records: SleepRecord[]): WeeklyComparison {
  const result: WeeklyComparison = {
    monday: createEmptyDailyStats(),
    tuesday: createEmptyDailyStats(),
    wednesday: createEmptyDailyStats(),
    thursday: createEmptyDailyStats(),
    friday: createEmptyDailyStats(),
    saturday: createEmptyDailyStats(),
    sunday: createEmptyDailyStats(),
  };

  // Group records by day of week
  const recordsByDay: Record<number, SleepRecord[]> = {
    0: [], // Sunday
    1: [], // Monday
    2: [], // Tuesday
    3: [], // Wednesday
    4: [], // Thursday
    5: [], // Friday
    6: [], // Saturday
  };

  records.forEach((record) => {
    const dayOfWeek = new Date(record.date).getDay();
    recordsByDay[dayOfWeek].push(record);
  });

  // Calculate stats for each day
  result.monday = calculateDailyStats(recordsByDay[1]);
  result.tuesday = calculateDailyStats(recordsByDay[2]);
  result.wednesday = calculateDailyStats(recordsByDay[3]);
  result.thursday = calculateDailyStats(recordsByDay[4]);
  result.friday = calculateDailyStats(recordsByDay[5]);
  result.saturday = calculateDailyStats(recordsByDay[6]);
  result.sunday = calculateDailyStats(recordsByDay[0]);

  return result;
}

function createEmptyDailyStats(): DailyStats {
  return {
    averageDuration: 0,
    averageEfficiency: 0,
    averageQuality: 0,
    recordCount: 0,
  };
}

function calculateDailyStats(records: SleepRecord[]): DailyStats {
  if (records.length === 0) {
    return createEmptyDailyStats();
  }

  const totalDuration = records.reduce((sum, r) => sum + r.duration, 0);
  const totalEfficiency = records.reduce((sum, r) => sum + r.efficiency, 0);
  const totalQuality = records.reduce((sum, r) => sum + r.qualityScore, 0);

  return {
    averageDuration: totalDuration / records.length,
    averageEfficiency: totalEfficiency / records.length,
    averageQuality: totalQuality / records.length,
    recordCount: records.length,
  };
}

// ==================== Correlation Analysis ====================

export function calculateCorrelation(x: number[], y: number[]): CorrelationData {
  if (x.length !== y.length || x.length < 2) {
    return {
      correlation: 0,
      strength: "none",
      dataPoints: [],
      interpretation: "Insufficient data",
    };
  }

  const n = x.length;

  // Calculate means
  const meanX = x.reduce((sum, val) => sum + val, 0) / n;
  const meanY = y.reduce((sum, val) => sum + val, 0) / n;

  // Calculate covariance and standard deviations
  let covariance = 0;
  let stdX = 0;
  let stdY = 0;

  for (let i = 0; i < n; i++) {
    const diffX = x[i] - meanX;
    const diffY = y[i] - meanY;
    covariance += diffX * diffY;
    stdX += diffX * diffX;
    stdY += diffY * diffY;
  }

  covariance /= n;
  stdX = Math.sqrt(stdX / n);
  stdY = Math.sqrt(stdY / n);

  // Pearson correlation coefficient
  const correlation = stdX === 0 || stdY === 0 ? 0 : covariance / (stdX * stdY);

  // Determine strength
  let strength: CorrelationStrength;
  const absCorrelation = Math.abs(correlation);

  if (absCorrelation >= 0.7) {
    strength = "strong";
  } else if (absCorrelation >= 0.4) {
    strength = "moderate";
  } else if (absCorrelation >= 0.2) {
    strength = "weak";
  } else {
    strength = "none";
  }

  // Generate interpretation
  let interpretation = "";
  if (correlation > 0.3) {
    interpretation = "Higher values tend to occur together (positive correlation).";
  } else if (correlation < -0.3) {
    interpretation =
      "Higher values tend to occur with lower values of the other metric (negative correlation).";
  } else {
    interpretation = "No clear relationship detected.";
  }

  return {
    correlation,
    strength,
    dataPoints: [], // To be populated by calling function with dates
    interpretation,
  };
}

export function getSleepWorkoutCorrelation(
  sleepRecords: SleepRecord[],
  workoutRecords: WorkoutRecord[]
): CorrelationData {
  // Align data by date
  const alignedData: Array<{
    sleepQuality: number;
    workoutIntensity: number;
    date: string;
  }> = [];

  for (const sleep of sleepRecords) {
    const workouts = workoutRecords.filter((w) => w.date === sleep.date);
    if (workouts.length > 0) {
      // Use average intensity for multiple workouts on same day
      const avgIntensity =
        workouts.reduce((sum, w) => {
          const intensityValue =
            w.intensity === "very-high"
              ? 4
              : w.intensity === "high"
                ? 3
                : w.intensity === "moderate"
                  ? 2
                  : 1;
          return sum + intensityValue;
        }, 0) / workouts.length;

      alignedData.push({
        sleepQuality: sleep.qualityScore,
        workoutIntensity: avgIntensity,
        date: sleep.date,
      });
    }
  }

  if (alignedData.length < 5) {
    return {
      correlation: 0,
      strength: "none",
      dataPoints: [],
      interpretation: "Need more data to analyze correlation.",
    };
  }

  const result = calculateCorrelation(
    alignedData.map((d) => d.sleepQuality),
    alignedData.map((d) => d.workoutIntensity)
  );

  return {
    ...result,
    dataPoints: alignedData.map((d) => ({
      x: d.workoutIntensity,
      y: d.sleepQuality,
      date: d.date,
    })),
  };
}

// ==================== Anomaly Detection ====================

export function detectAnomalies(sleepRecords: SleepRecord[]): Array<{
  type: "duration" | "quality" | "efficiency";
  record: SleepRecord;
  severity: "low" | "medium" | "high";
  message: string;
}> {
  const anomalies: Array<{
    type: "duration" | "quality" | "efficiency";
    record: SleepRecord;
    severity: "low" | "medium" | "high";
    message: string;
  }> = [];

  if (sleepRecords.length < 7) return anomalies;

  // Calculate statistics
  const durations = sleepRecords.map((r) => r.duration);
  const qualities = sleepRecords.map((r) => r.qualityScore);
  const efficiencies = sleepRecords.map((r) => r.efficiency);

  const meanDuration = durations.reduce((a, b) => a + b, 0) / durations.length;
  const stdDuration = Math.sqrt(
    durations.reduce((sum, d) => sum + Math.pow(d - meanDuration, 2), 0) / durations.length
  );

  const meanQuality = qualities.reduce((a, b) => a + b, 0) / qualities.length;
  const stdQuality = Math.sqrt(
    qualities.reduce((sum, q) => sum + Math.pow(q - meanQuality, 2), 0) / qualities.length
  );

  const meanEfficiency = efficiencies.reduce((a, b) => a + b, 0) / efficiencies.length;
  const stdEfficiency = Math.sqrt(
    efficiencies.reduce((sum, e) => sum + Math.pow(e - meanEfficiency, 2), 0) / efficiencies.length
  );

  // Detect anomalies (values beyond 2 standard deviations)
  for (const record of sleepRecords) {
    const durationZ = stdDuration === 0 ? 0 : (record.duration - meanDuration) / stdDuration;
    const qualityZ = stdQuality === 0 ? 0 : (record.qualityScore - meanQuality) / stdQuality;
    const efficiencyZ =
      stdEfficiency === 0 ? 0 : (record.efficiency - meanEfficiency) / stdEfficiency;

    if (Math.abs(durationZ) > 2) {
      anomalies.push({
        type: "duration",
        record,
        severity: Math.abs(durationZ) > 3 ? "high" : "medium",
        message:
          durationZ > 0
            ? `Unusually long sleep (${formatDuration(record.duration)})`
            : `Unusually short sleep (${formatDuration(record.duration)})`,
      });
    }

    if (Math.abs(qualityZ) > 2) {
      anomalies.push({
        type: "quality",
        record,
        severity: Math.abs(qualityZ) > 3 ? "high" : "medium",
        message:
          qualityZ > 0
            ? `Exceptionally good sleep quality (${record.qualityScore})`
            : `Poor sleep quality detected (${record.qualityScore})`,
      });
    }

    if (Math.abs(efficiencyZ) > 2) {
      anomalies.push({
        type: "efficiency",
        record,
        severity: Math.abs(efficiencyZ) > 3 ? "high" : "medium",
        message:
          efficiencyZ > 0
            ? `Exceptionally high sleep efficiency (${record.efficiency}%)`
            : `Low sleep efficiency detected (${record.efficiency}%)`,
      });
    }
  }

  return anomalies;
}

function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = Math.floor(minutes % 60);
  return `${hours}h ${mins}m`;
}

// ==================== Seasonality Detection ====================

export function detectSeasonality(records: SleepRecord[]): SeasonalityData {
  if (records.length === 0) {
    return {
      weekdayAverage: 0,
      weekendAverage: 0,
      difference: 0,
      significance: "minimal",
    };
  }

  const weekdayRecords: SleepRecord[] = [];
  const weekendRecords: SleepRecord[] = [];

  records.forEach((record) => {
    const dayOfWeek = new Date(record.date).getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      // Sunday or Saturday
      weekendRecords.push(record);
    } else {
      weekdayRecords.push(record);
    }
  });

  const weekdayAverage =
    weekdayRecords.length > 0
      ? weekdayRecords.reduce((sum, r) => sum + r.duration, 0) / weekdayRecords.length
      : 0;

  const weekendAverage =
    weekendRecords.length > 0
      ? weekendRecords.reduce((sum, r) => sum + r.duration, 0) / weekendRecords.length
      : 0;

  const difference = Math.abs(weekdayAverage - weekendAverage);

  let significance: "significant" | "moderate" | "minimal";
  if (difference > 60) {
    // More than 1 hour difference
    significance = "significant";
  } else if (difference > 30) {
    // More than 30 minutes difference
    significance = "moderate";
  } else {
    significance = "minimal";
  }

  return {
    weekdayAverage,
    weekendAverage,
    difference,
    significance,
  };
}
