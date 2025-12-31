// Custom hook for analytics data calculations

import { useMemo } from "react";
import { useSleepStore } from "../stores";
import {
  sleepRecordsToDurationData,
  sleepRecordsToEfficiencyData,
  calculatePhaseDistribution,
  calculateAverageDuration,
  calculateAverageEfficiency,
  calculateAverageQuality,
} from "../utils/chart";
import type { ChartDataPoint, PhaseDistribution } from "../utils/chart";

export interface AnalyticsData {
  durationData: ChartDataPoint[];
  efficiencyData: ChartDataPoint[];
  phaseDistribution: PhaseDistribution[];
  averageDuration: number;
  averageEfficiency: number;
  averageQuality: number;
  totalRecords: number;
}

export function useAnalytics(startDate?: string, endDate?: string): AnalyticsData {
  const records = useSleepStore((state) => state.records);

  const filteredRecords = useMemo(() => {
    if (!startDate && !endDate) return records;

    return records.filter((record) => {
      if (startDate && record.date < startDate) return false;
      if (endDate && record.date > endDate) return false;
      return true;
    });
  }, [records, startDate, endDate]);

  const analyticsData = useMemo(() => {
    return {
      durationData: sleepRecordsToDurationData(filteredRecords),
      efficiencyData: sleepRecordsToEfficiencyData(filteredRecords),
      phaseDistribution: calculatePhaseDistribution(filteredRecords),
      averageDuration: calculateAverageDuration(filteredRecords),
      averageEfficiency: calculateAverageEfficiency(filteredRecords),
      averageQuality: calculateAverageQuality(filteredRecords),
      totalRecords: filteredRecords.length,
    };
  }, [filteredRecords]);

  return analyticsData;
}
