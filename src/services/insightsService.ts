import type {
  SleepRecord,
  WorkoutRecord,
  MoodEnergyRecord,
  Insight,
  Recommendation,
  InsightCategory,
  InsightPriority,
  InsightType,
} from "../types";
import {
  analyzeTrend,
  getSleepDurationTrend,
  getSleepEfficiencyTrend,
  getBedtimeWakeTimePatterns,
  getSleepPhaseDistribution,
  getSleepWorkoutCorrelation,
  detectAnomalies,
} from "./analyticsService";

/**
 * Insights Service
 * Generates personalized insights based on user data patterns
 */

// ==================== Trend Insights ====================

export function generateTrendInsights(sleepRecords: SleepRecord[]): Insight[] {
  const insights: Insight[] = [];

  if (sleepRecords.length < 7) return insights;

  // 1. Duration Trend
  const durationTrend = getSleepDurationTrend(sleepRecords);

  if (durationTrend.direction === "decreasing" && durationTrend.significance > 0.6) {
    insights.push({
      id: generateId(),
      type: "trend",
      category: "duration",
      title: "Declining Sleep Duration",
      description: `Your sleep duration has been decreasing over the past ${durationTrend.period}. Average duration has dropped from ${formatDuration(durationTrend.startValue)} to ${formatDuration(durationTrend.endValue)}.`,
      priority: "high",
      data: durationTrend,
      isRead: false,
      isDismissed: false,
      createdAt: new Date().toISOString(),
    });
  } else if (durationTrend.direction === "increasing" && durationTrend.significance > 0.6) {
    insights.push({
      id: generateId(),
      type: "trend",
      category: "duration",
      title: "Improving Sleep Duration",
      description: `Great job! Your sleep duration has been increasing over the past ${durationTrend.period}. Keep up the good work!`,
      priority: "medium",
      data: durationTrend,
      isRead: false,
      isDismissed: false,
      createdAt: new Date().toISOString(),
    });
  }

  // 2. Quality Trend
  const sortedRecords = [...sleepRecords].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  const qualityTrend = analyzeTrend(
    sortedRecords.map((r) => r.qualityScore),
    sortedRecords.map((r) => r.date)
  );

  if (qualityTrend.direction === "increasing" && qualityTrend.significance > 0.5) {
    insights.push({
      id: generateId(),
      type: "trend",
      category: "efficiency",
      title: "Improving Sleep Quality",
      description: `Your sleep quality has been improving over the past ${qualityTrend.period}. Keep up the excellent work!`,
      priority: "medium",
      data: qualityTrend,
      isRead: false,
      isDismissed: false,
      createdAt: new Date().toISOString(),
    });
  } else if (qualityTrend.direction === "decreasing" && qualityTrend.significance > 0.6) {
    insights.push({
      id: generateId(),
      type: "trend",
      category: "efficiency",
      title: "Declining Sleep Quality",
      description: `Your sleep quality has been declining over the past ${qualityTrend.period}. Consider reviewing your sleep habits and environment.`,
      priority: "high",
      data: qualityTrend,
      isRead: false,
      isDismissed: false,
      createdAt: new Date().toISOString(),
    });
  }

  // 3. Efficiency Trend
  const efficiencyTrend = getSleepEfficiencyTrend(sleepRecords);

  if (efficiencyTrend.direction === "decreasing" && efficiencyTrend.significance > 0.6) {
    insights.push({
      id: generateId(),
      type: "trend",
      category: "efficiency",
      title: "Declining Sleep Efficiency",
      description: `Your sleep efficiency has been decreasing. You may be spending more time awake in bed. Try maintaining a consistent sleep schedule.`,
      priority: "medium",
      data: efficiencyTrend,
      isRead: false,
      isDismissed: false,
      createdAt: new Date().toISOString(),
    });
  }

  return insights;
}

// ==================== Anomaly Insights ====================

export function generateAnomalyInsights(sleepRecords: SleepRecord[]): Insight[] {
  const insights: Insight[] = [];

  if (sleepRecords.length < 7) return insights;

  const anomalies = detectAnomalies(sleepRecords);

  // Group anomalies by type
  const durationAnomalies = anomalies.filter((a) => a.type === "duration");
  const qualityAnomalies = anomalies.filter((a) => a.type === "quality");
  const efficiencyAnomalies = anomalies.filter((a) => a.type === "efficiency");

  if (durationAnomalies.length > 0) {
    const highSeverityCount = durationAnomalies.filter((a) => a.severity === "high").length;

    insights.push({
      id: generateId(),
      type: "anomaly",
      category: "duration",
      title: `Unusual Sleep Duration Detected`,
      description: `We detected ${durationAnomalies.length} day(s) with unusual sleep duration. ${highSeverityCount > 0 ? `${highSeverityCount} were significantly outside your normal pattern.` : ""}`,
      priority: highSeverityCount > 0 ? "high" : "medium",
      data: { anomalies: durationAnomalies },
      isRead: false,
      isDismissed: false,
      createdAt: new Date().toISOString(),
    });
  }

  if (qualityAnomalies.length > 0) {
    const poorQualityCount = qualityAnomalies.filter(
      (a) => a.severity === "high" && a.message.includes("Poor")
    ).length;

    insights.push({
      id: generateId(),
      type: "anomaly",
      category: "efficiency",
      title: `Sleep Quality Anomalies`,
      description: `We detected ${qualityAnomalies.length} day(s) with unusual sleep quality. ${poorQualityCount > 0 ? `${poorQualityCount} were particularly poor quality nights.` : ""}`,
      priority: poorQualityCount > 0 ? "high" : "low",
      data: { anomalies: qualityAnomalies },
      isRead: false,
      isDismissed: false,
      createdAt: new Date().toISOString(),
    });
  }

  if (efficiencyAnomalies.length > 0) {
    const lowEfficiencyCount = efficiencyAnomalies.filter(
      (a) => a.severity === "high" && a.message.includes("Low")
    ).length;

    insights.push({
      id: generateId(),
      type: "anomaly",
      category: "efficiency",
      title: `Sleep Efficiency Variations`,
      description: `We detected ${efficiencyAnomalies.length} day(s) with unusual sleep efficiency. ${lowEfficiencyCount > 0 ? `${lowEfficiencyCount} showed low efficiency patterns.` : ""}`,
      priority: "medium",
      data: { anomalies: efficiencyAnomalies },
      isRead: false,
      isDismissed: false,
      createdAt: new Date().toISOString(),
    });
  }

  return insights;
}

// ==================== Correlation Insights ====================

export function generateCorrelationInsights(
  sleepRecords: SleepRecord[],
  workoutRecords: WorkoutRecord[],
  _moodRecords?: MoodEnergyRecord[]
): Insight[] {
  const insights: Insight[] = [];

  if (sleepRecords.length < 7) return insights;

  // Sleep-Workout Correlation
  if (workoutRecords.length >= 5) {
    const correlationData = getSleepWorkoutCorrelation(sleepRecords, workoutRecords);

    if (correlationData.strength !== "none") {
      const positiveCorrelation = correlationData.correlation > 0;

      insights.push({
        id: generateId(),
        type: "correlation",
        category: "performance",
        title: `Sleep-Workout ${positiveCorrelation ? "Positive" : "Negative"} Correlation`,
        description: `We found a ${correlationData.strength} ${positiveCorrelation ? "positive" : "negative"} correlation (${correlationData.correlation.toFixed(2)}) between your sleep quality and workout intensity. ${correlationData.interpretation}`,
        priority: correlationData.strength === "strong" ? "high" : "medium",
        data: correlationData,
        isRead: false,
        isDismissed: false,
        createdAt: new Date().toISOString(),
      });
    }
  }

  return insights;
}

// ==================== Recommendations ====================

export function generateRecommendations(sleepRecords: SleepRecord[]): Recommendation[] {
  const recommendations: Recommendation[] = [];

  if (sleepRecords.length < 7) return recommendations;

  // Analyze patterns
  const avgDuration = sleepRecords.reduce((sum, r) => sum + r.duration, 0) / sleepRecords.length;
  const avgQuality = sleepRecords.reduce((sum, r) => sum + r.qualityScore, 0) / sleepRecords.length;

  const schedulePatterns = getBedtimeWakeTimePatterns(sleepRecords);
  const phaseDistribution = getSleepPhaseDistribution(sleepRecords);

  // Duration Recommendations
  if (avgDuration < 7 * 60) {
    // Less than 7 hours
    recommendations.push({
      id: generateId(),
      type: "recommendation",
      category: "duration",
      title: "Increase Sleep Duration",
      description: `Your average sleep duration is ${formatDuration(avgDuration)}. Aim for 7-9 hours per night for optimal recovery and performance.`,
      priority: "high",
      implemented: false,
      isRead: false,
      isDismissed: false,
      createdAt: new Date().toISOString(),
    });
  } else if (avgDuration > 10 * 60) {
    // More than 10 hours
    recommendations.push({
      id: generateId(),
      type: "recommendation",
      category: "duration",
      title: "Monitor Sleep Duration",
      description: `Your average sleep duration is ${formatDuration(avgDuration)}. While individual needs vary, consistently sleeping more than 10 hours may indicate underlying issues.`,
      priority: "low",
      implemented: false,
      isRead: false,
      isDismissed: false,
      createdAt: new Date().toISOString(),
    });
  }

  // Bedtime Consistency Recommendations
  if (schedulePatterns.bedtimeVariance > 60) {
    // More than 1 hour variance
    recommendations.push({
      id: generateId(),
      type: "recommendation",
      category: "consistency",
      title: "Improve Bedtime Consistency",
      description: `Your bedtime varies by ${formatDuration(schedulePatterns.bedtimeVariance)} on average. Try to maintain a consistent bedtime to improve sleep quality.`,
      priority: "medium",
      implemented: false,
      isRead: false,
      isDismissed: false,
      createdAt: new Date().toISOString(),
    });
  }

  // Sleep Phase Recommendations
  if (phaseDistribution.deepSleep < 15) {
    recommendations.push({
      id: generateId(),
      type: "recommendation",
      category: "phases",
      title: "Increase Deep Sleep",
      description: `Your deep sleep percentage (${phaseDistribution.deepSleep.toFixed(1)}%) is below optimal. Try avoiding caffeine after 2 PM, maintaining a cool bedroom temperature, and exercising regularly.`,
      priority: "medium",
      implemented: false,
      isRead: false,
      isDismissed: false,
      createdAt: new Date().toISOString(),
    });
  }

  if (phaseDistribution.remSleep < 20) {
    recommendations.push({
      id: generateId(),
      type: "recommendation",
      category: "phases",
      title: "Optimize REM Sleep",
      description: `Your REM sleep percentage (${phaseDistribution.remSleep.toFixed(1)}%) is below optimal. Consider reducing alcohol before bed and managing stress levels.`,
      priority: "medium",
      implemented: false,
      isRead: false,
      isDismissed: false,
      createdAt: new Date().toISOString(),
    });
  }

  // Quality Recommendations
  if (avgQuality < 60) {
    recommendations.push({
      id: generateId(),
      type: "recommendation",
      category: "efficiency",
      title: "Improve Sleep Quality",
      description: `Your average sleep quality score is ${avgQuality.toFixed(1)}. Consider establishing a bedtime routine, reducing screen time before bed, and ensuring your bedroom is dark and quiet.`,
      priority: "high",
      implemented: false,
      isRead: false,
      isDismissed: false,
      createdAt: new Date().toISOString(),
    });
  }

  // Wake Time Consistency
  if (schedulePatterns.wakeTimeVariance > 60) {
    recommendations.push({
      id: generateId(),
      type: "recommendation",
      category: "consistency",
      title: "Stabilize Wake Time",
      description: `Your wake time varies by ${formatDuration(schedulePatterns.wakeTimeVariance)} on average. A consistent wake time helps regulate your circadian rhythm.`,
      priority: "medium",
      implemented: false,
      isRead: false,
      isDismissed: false,
      createdAt: new Date().toISOString(),
    });
  }

  return recommendations;
}

// ==================== Alerts ====================

export function generateAlerts(sleepRecords: SleepRecord[]): Insight[] {
  const insights: Insight[] = [];

  if (sleepRecords.length < 7) return insights;

  const recentRecords = sleepRecords.slice(-7); // Last 7 records
  const avgRecentDuration =
    recentRecords.reduce((sum, r) => sum + r.duration, 0) / recentRecords.length;
  const avgRecentQuality =
    recentRecords.reduce((sum, r) => sum + r.qualityScore, 0) / recentRecords.length;

  // Chronic sleep deprivation alert
  if (avgRecentDuration < 6 * 60) {
    insights.push({
      id: generateId(),
      type: "alert",
      category: "duration",
      title: "Chronic Sleep Deprivation Warning",
      description: `Your average sleep duration over the past week has been less than 6 hours. This can significantly impact your health, mood, and performance.`,
      priority: "high",
      data: { avgDuration: avgRecentDuration },
      isRead: false,
      isDismissed: false,
      createdAt: new Date().toISOString(),
    });
  }

  // Poor sleep quality alert
  if (avgRecentQuality < 40) {
    insights.push({
      id: generateId(),
      type: "alert",
      category: "efficiency",
      title: "Poor Sleep Quality Alert",
      description: `Your sleep quality has been consistently poor over the past week. Consider reviewing your sleep environment and habits.`,
      priority: "high",
      data: { avgQuality: avgRecentQuality },
      isRead: false,
      isDismissed: false,
      createdAt: new Date().toISOString(),
    });
  }

  return insights;
}

// ==================== Generate All Insights ====================

export function generateAllInsights(
  sleepRecords: SleepRecord[],
  workoutRecords?: WorkoutRecord[],
  moodRecords?: MoodEnergyRecord[]
): Insight[] {
  const allInsights: Insight[] = [];

  // Generate different types of insights
  allInsights.push(...generateTrendInsights(sleepRecords));
  allInsights.push(...generateAnomalyInsights(sleepRecords));
  allInsights.push(...generateCorrelationInsights(sleepRecords, workoutRecords || [], moodRecords));
  allInsights.push(...generateRecommendations(sleepRecords));
  allInsights.push(...generateAlerts(sleepRecords));

  // Sort by priority and date
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  allInsights.sort((a, b) => {
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return allInsights;
}

// ==================== Insight Management ====================

export function markAsRead(insights: Insight[], id: string): Insight[] {
  return insights.map((insight) => (insight.id === id ? { ...insight, isRead: true } : insight));
}

export function markAsDismissed(insights: Insight[], id: string): Insight[] {
  return insights.map((insight) =>
    insight.id === id ? { ...insight, isDismissed: true } : insight
  );
}

export function markAsImplemented(recommendations: Recommendation[], id: string): Recommendation[] {
  return recommendations.map((rec) => (rec.id === id ? { ...rec, implemented: true } : rec));
}

// ==================== Filtering ====================

export function filterByCategory(insights: Insight[], category: InsightCategory): Insight[] {
  return insights.filter((insight) => insight.category === category);
}

export function filterByPriority(insights: Insight[], priority: InsightPriority): Insight[] {
  return insights.filter((insight) => insight.priority === priority);
}

export function filterByType(insights: Insight[], type: InsightType): Insight[] {
  return insights.filter((insight) => insight.type === type);
}

export function getUnreadInsights(insights: Insight[]): Insight[] {
  return insights.filter((insight) => !insight.isRead);
}

export function getActiveInsights(insights: Insight[]): Insight[] {
  return insights.filter((insight) => !insight.isDismissed);
}

// ==================== Utilities ====================

function generateId(): string {
  return `insight-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = Math.floor(minutes % 60);
  return `${hours}h ${mins}m`;
}
