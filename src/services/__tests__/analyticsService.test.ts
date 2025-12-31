import { describe, it, expect } from "vitest";
import { calculateSleepQualityScore } from "../analyticsService";

describe("calculateSleepQualityScore", () => {
  it("should return a high score for optimal sleep", () => {
    const record = {
      date: "2025-01-01",
      bedtime: "2025-01-01T22:00:00",
      wakeTime: "2025-01-02T06:00:00",
      duration: 480, // 8 hours
      efficiency: 90,
      deepSleep: 96, // 20%
      remSleep: 120, // 25%
      lightSleep: 264, // 55%
    };

    const score = calculateSleepQualityScore(record);
    expect(score).toBeGreaterThanOrEqual(80);
    expect(score).toBeLessThanOrEqual(100);
  });

  it("should return a moderate score for average sleep", () => {
    const record = {
      date: "2025-01-01",
      bedtime: "2025-01-01T23:00:00",
      wakeTime: "2025-01-02T06:30:00",
      duration: 450, // 7.5 hours
      efficiency: 85,
      deepSleep: 90, // 20%
      remSleep: 100, // 22%
      lightSleep: 260, // 58%
    };

    const score = calculateSleepQualityScore(record);
    expect(score).toBeGreaterThanOrEqual(70);
    expect(score).toBeLessThan(90);
  });

  it("should return a low score for poor sleep", () => {
    const record = {
      date: "2025-01-01",
      bedtime: "2025-01-01T01:00:00",
      wakeTime: "2025-01-02T06:00:00",
      duration: 300, // 5 hours
      efficiency: 60,
      deepSleep: 30, // 10%
      remSleep: 45, // 15%
      lightSleep: 225, // 75%
    };

    const score = calculateSleepQualityScore(record);
    expect(score).toBeLessThan(60);
  });

  it("should handle missing phase data gracefully", () => {
    const record = {
      date: "2025-01-01",
      bedtime: "2025-01-01T22:00:00",
      wakeTime: "2025-01-02T06:00:00",
      duration: 480,
      efficiency: 85,
    };

    const score = calculateSleepQualityScore(record);
    expect(score).toBeGreaterThan(0);
    expect(score).toBeLessThanOrEqual(100);
  });

  it("should penalize very short sleep duration", () => {
    const record = {
      date: "2025-01-01",
      bedtime: "2025-01-01T02:00:00",
      wakeTime: "2025-01-02T06:00:00",
      duration: 240, // 4 hours
      efficiency: 90,
      deepSleep: 48,
      remSleep: 60,
      lightSleep: 132,
    };

    const score = calculateSleepQualityScore(record);
    expect(score).toBeLessThan(60);
  });

  it("should penalize very long sleep duration", () => {
    const record = {
      date: "2025-01-01",
      bedtime: "2025-01-01T20:00:00",
      wakeTime: "2025-01-02T10:00:00",
      duration: 840, // 14 hours
      efficiency: 90,
      deepSleep: 168,
      remSleep: 210,
      lightSleep: 462,
    };

    const score = calculateSleepQualityScore(record);
    expect(score).toBeLessThan(80);
  });
});
