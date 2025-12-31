import type { SleepRecord, WorkoutRecord, MoodEnergyRecord, Goal, Insight } from "../types";
import type { ExportData, ValidationResult } from "../types/reports.types";
import { format } from "date-fns";

const APP_VERSION = "1.0.0";
const EXPORT_FILE_PREFIX = "sleep-tracker-export";

/**
 * Data Management Service
 * Handles data export, import, backup, and restore functionality
 */

// ==================== Data Export ====================

export function exportToJSON(
  sleepRecords: SleepRecord[],
  workoutRecords: WorkoutRecord[],
  moodRecords: MoodEnergyRecord[],
  goals: Goal[],
  insights: Insight[]
): string {
  const exportData: ExportData = {
    version: APP_VERSION,
    exportDate: new Date().toISOString(),
    sleepRecords,
    workoutRecords,
    moodEnergyRecords: moodRecords,
    goals,
    insights,
  };

  return JSON.stringify(exportData, null, 2);
}

export function downloadJSONExport(data: string, filename?: string): void {
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download =
    filename || `${EXPORT_FILE_PREFIX}-${format(new Date(), "yyyy-MM-dd-HH-mm-ss")}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export async function exportAllData(
  sleepRecords: SleepRecord[],
  workoutRecords: WorkoutRecord[],
  moodRecords: MoodEnergyRecord[],
  goals: Goal[],
  insights: Insight[]
): Promise<void> {
  const jsonData = exportToJSON(sleepRecords, workoutRecords, moodRecords, goals, insights);
  downloadJSONExport(jsonData);
}

// ==================== Data Import ====================

export function importFromJSON(jsonString: string): ValidationResult {
  const result: ValidationResult = {
    isValid: true,
    errors: [],
    warnings: [],
    dataCounts: {
      sleepRecords: 0,
      workoutRecords: 0,
      moodEnergyRecords: 0,
      goals: 0,
      insights: 0,
    },
  };

  try {
    const data = JSON.parse(jsonString) as Partial<ExportData>;

    // Validate structure
    if (!data.version || typeof data.version !== "string") {
      result.errors.push("Invalid or missing version information");
      result.isValid = false;
    }

    if (!data.exportDate || typeof data.exportDate !== "string") {
      result.errors.push("Invalid or missing export date");
      result.isValid = false;
    }

    // Validate sleep records
    if (data.sleepRecords && Array.isArray(data.sleepRecords)) {
      result.dataCounts.sleepRecords = data.sleepRecords.length;

      // Validate each record structure
      data.sleepRecords.forEach((record, index) => {
        if (!validateSleepRecord(record)) {
          result.warnings.push(`Sleep record at index ${index} may be incomplete or invalid`);
        }
      });
    } else {
      result.warnings.push("No sleep records found in export");
    }

    // Validate workout records
    if (data.workoutRecords && Array.isArray(data.workoutRecords)) {
      result.dataCounts.workoutRecords = data.workoutRecords.length;

      data.workoutRecords.forEach((record, index) => {
        if (!validateWorkoutRecord(record)) {
          result.warnings.push(`Workout record at index ${index} may be incomplete or invalid`);
        }
      });
    } else {
      result.warnings.push("No workout records found in export");
    }

    // Validate mood records
    if (data.moodEnergyRecords && Array.isArray(data.moodEnergyRecords)) {
      result.dataCounts.moodEnergyRecords = data.moodEnergyRecords.length;
    } else {
      result.warnings.push("No mood/energy records found in export");
    }

    // Validate goals
    if (data.goals && Array.isArray(data.goals)) {
      result.dataCounts.goals = data.goals.length;
    } else {
      result.warnings.push("No goals found in export");
    }

    // Validate insights
    if (data.insights && Array.isArray(data.insights)) {
      result.dataCounts.insights = data.insights.length;
    } else {
      result.warnings.push("No insights found in export");
    }

    // Version compatibility check
    if (data.version !== APP_VERSION) {
      result.warnings.push(
        `Export version ${data.version} differs from current app version ${APP_VERSION}`
      );
    }
  } catch (error) {
    result.isValid = false;
    result.errors.push(
      `Failed to parse JSON: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }

  return result;
}

function validateSleepRecord(record: any): boolean {
  return (
    record &&
    typeof record === "object" &&
    typeof record.date === "string" &&
    typeof record.bedtime === "string" &&
    typeof record.wakeTime === "string" &&
    typeof record.duration === "number" &&
    typeof record.efficiency === "number" &&
    typeof record.qualityScore === "number"
  );
}

function validateWorkoutRecord(record: any): boolean {
  return (
    record &&
    typeof record === "object" &&
    typeof record.date === "string" &&
    typeof record.type === "string" &&
    typeof record.duration === "number" &&
    typeof record.intensity === "string"
  );
}

export function parseImportData(jsonString: string): {
  sleepRecords: SleepRecord[];
  workoutRecords: WorkoutRecord[];
  moodRecords: MoodEnergyRecord[];
  goals: Goal[];
  insights: Insight[];
} {
  const data = JSON.parse(jsonString) as ExportData;

  return {
    sleepRecords: data.sleepRecords || [],
    workoutRecords: data.workoutRecords || [],
    moodRecords: data.moodEnergyRecords || [],
    goals: data.goals || [],
    insights: data.insights || [],
  };
}

// ==================== Data Backup ====================

export function createBackup(): string {
  // Get all data from localStorage
  const backup: Record<string, any> = {};

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key) {
      const value = localStorage.getItem(key);
      if (value) {
        try {
          backup[key] = JSON.parse(value);
        } catch {
          backup[key] = value;
        }
      }
    }
  }

  return JSON.stringify(backup, null, 2);
}

export function downloadBackup(): void {
  const backupData = createBackup();
  const filename = `sleep-tracker-backup-${format(new Date(), "yyyy-MM-dd-HH-mm-ss")}.json`;

  downloadJSONExport(backupData, filename);
}

// ==================== Data Restore ====================

export function restoreFromBackup(
  backupData: string,
  merge: boolean = false
): { success: boolean; message: string; imported: number } {
  try {
    const data = JSON.parse(backupData);
    let imported = 0;

    if (!merge) {
      // Clear all app data first
      localStorage.clear();
    }

    // Restore each key
    Object.keys(data).forEach((key) => {
      try {
        localStorage.setItem(key, JSON.stringify(data[key]));
        imported++;
      } catch (error) {
        console.error(`Failed to restore key ${key}:`, error);
      }
    });

    return {
      success: true,
      message: `Successfully restored ${imported} items`,
      imported,
    };
  } catch (error) {
    return {
      success: false,
      message: `Failed to restore backup: ${error instanceof Error ? error.message : "Unknown error"}`,
      imported: 0,
    };
  }
}

// ==================== Clear Data ====================

export function clearAllData(): { success: boolean; message: string } {
  try {
    localStorage.clear();
    return {
      success: true,
      message: "All data has been cleared successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: `Failed to clear data: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }
}

export function clearStoreData(storeName: string): { success: boolean; message: string } {
  try {
    localStorage.removeItem(storeName);
    return {
      success: true,
      message: `Data for ${storeName} has been cleared`,
    };
  } catch (error) {
    return {
      success: false,
      message: `Failed to clear ${storeName}: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }
}

// ==================== Data Statistics ====================

export function getDataStats(): {
  totalKeys: number;
  totalSize: number;
  stores: Record<string, { itemCount: number; size: number }>;
} {
  const stats = {
    totalKeys: 0,
    totalSize: 0,
    stores: {} as Record<string, { itemCount: number; size: number }>,
  };

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key) {
      const value = localStorage.getItem(key);
      if (value) {
        const size = new Blob([value]).size;
        stats.totalKeys++;
        stats.totalSize += size;

        // Try to parse and count items if it's a store
        try {
          const parsed = JSON.parse(value);
          if (parsed.records && Array.isArray(parsed.records)) {
            stats.stores[key] = {
              itemCount: parsed.records.length,
              size,
            };
          } else if (parsed.goals && Array.isArray(parsed.goals)) {
            stats.stores[key] = {
              itemCount: parsed.goals.length,
              size,
            };
          } else {
            stats.stores[key] = {
              itemCount: 1,
              size,
            };
          }
        } catch {
          stats.stores[key] = {
            itemCount: 1,
            size,
          };
        }
      }
    }
  }

  return stats;
}
