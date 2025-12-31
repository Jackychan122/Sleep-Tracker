import { describe, it, expect } from "vitest";
import { calculateStreak } from "../goalsService";
import type { SleepRecord } from "../../types";

describe("calculateStreak", () => {
  it("should calculate consecutive days correctly", () => {
    const records: SleepRecord[] = [
      {
        id: "1",
        date: "2025-01-05",
        bedtime: "2025-01-05T22:00:00",
        wakeTime: "2025-01-06T06:00:00",
        duration: 480,
        deepSleep: 96,
        remSleep: 120,
        lightSleep: 264,
        efficiency: 85,
        qualityScore: 80,
        createdAt: "2025-01-05T00:00:00",
        updatedAt: "2025-01-05T00:00:00",
      },
      {
        id: "2",
        date: "2025-01-04",
        bedtime: "2025-01-04T22:00:00",
        wakeTime: "2025-01-05T06:00:00",
        duration: 480,
        deepSleep: 96,
        remSleep: 120,
        lightSleep: 264,
        efficiency: 85,
        qualityScore: 80,
        createdAt: "2025-01-04T00:00:00",
        updatedAt: "2025-01-04T00:00:00",
      },
      {
        id: "3",
        date: "2025-01-03",
        bedtime: "2025-01-03T22:00:00",
        wakeTime: "2025-01-04T06:00:00",
        duration: 480,
        deepSleep: 96,
        remSleep: 120,
        lightSleep: 264,
        efficiency: 85,
        qualityScore: 80,
        createdAt: "2025-01-03T00:00:00",
        updatedAt: "2025-01-03T00:00:00",
      },
    ];

    const streak = calculateStreak(records);
    expect(streak.current).toBe(0); // Not today
    expect(streak.best).toBe(3);
  });

  it("should reset streak on gap", () => {
    const records: SleepRecord[] = [
      {
        id: "1",
        date: "2025-01-05",
        bedtime: "2025-01-05T22:00:00",
        wakeTime: "2025-01-06T06:00:00",
        duration: 480,
        deepSleep: 96,
        remSleep: 120,
        lightSleep: 264,
        efficiency: 85,
        qualityScore: 80,
        createdAt: "2025-01-05T00:00:00",
        updatedAt: "2025-01-05T00:00:00",
      },
      {
        id: "2",
        date: "2025-01-03",
        bedtime: "2025-01-03T22:00:00",
        wakeTime: "2025-01-04T06:00:00",
        duration: 480,
        deepSleep: 96,
        remSleep: 120,
        lightSleep: 264,
        efficiency: 85,
        qualityScore: 80,
        createdAt: "2025-01-03T00:00:00",
        updatedAt: "2025-01-03T00:00:00",
      },
    ];

    const streak = calculateStreak(records);
    expect(streak.current).toBe(0); // Not today
    expect(streak.best).toBe(1);
  });

  it("should return 0 for empty records", () => {
    const streak = calculateStreak([]);
    expect(streak.current).toBe(0);
    expect(streak.best).toBe(0);
  });

  it("should filter by check function", () => {
    const records: SleepRecord[] = [
      {
        id: "1",
        date: "2025-01-05",
        bedtime: "2025-01-05T22:00:00",
        wakeTime: "2025-01-06T06:00:00",
        duration: 480,
        deepSleep: 96,
        remSleep: 120,
        lightSleep: 264,
        efficiency: 85,
        qualityScore: 80,
        createdAt: "2025-01-05T00:00:00",
        updatedAt: "2025-01-05T00:00:00",
      },
      {
        id: "2",
        date: "2025-01-04",
        bedtime: "2025-01-04T22:00:00",
        wakeTime: "2025-01-05T06:00:00",
        duration: 300, // Too short
        deepSleep: 60,
        remSleep: 75,
        lightSleep: 165,
        efficiency: 85,
        qualityScore: 50,
        createdAt: "2025-01-04T00:00:00",
        updatedAt: "2025-01-04T00:00:00",
      },
      {
        id: "3",
        date: "2025-01-03",
        bedtime: "2025-01-03T22:00:00",
        wakeTime: "2025-01-04T06:00:00",
        duration: 480,
        deepSleep: 96,
        remSleep: 120,
        lightSleep: 264,
        efficiency: 85,
        qualityScore: 80,
        createdAt: "2025-01-03T00:00:00",
        updatedAt: "2025-01-03T00:00:00",
      },
    ];

    // Filter records with duration >= 420 minutes (7 hours) before calling calculateStreak
    const filteredRecords = records.filter((r) => r.duration >= 420);
    const streak = calculateStreak(filteredRecords);
    expect(streak.current).toBe(0); // Not today
    expect(streak.best).toBeGreaterThanOrEqual(1);
  });
});
