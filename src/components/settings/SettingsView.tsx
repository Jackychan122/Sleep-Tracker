import { useState, useRef } from "react";
import { Download, Upload, Trash2, AlertTriangle, FileJson, HardDrive } from "lucide-react";
import {
  useSleepStore,
  useWorkoutStore,
  useMoodEnergyStore,
  useGoalsStore,
  useToastStore,
} from "../../stores";
import {
  exportAllData,
  importFromJSON,
  parseImportData,
  downloadBackup,
  restoreFromBackup,
  clearAllData,
  clearStoreData,
  getDataStats,
} from "../../services";
import type { ValidationResult } from "../../types";
import { format } from "date-fns";

export function SettingsView() {
  const sleepRecords = useSleepStore((state) => state.records);
  const workoutRecords = useWorkoutStore((state) => state.records);
  const moodRecords = useMoodEnergyStore((state) => state.records);
  const goals = useGoalsStore((state) => state.goals);
  const { addToast } = useToastStore();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importResult, setImportResult] = useState<ValidationResult | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Calculate current data stats
  const dataStats = {
    sleepRecords: sleepRecords.length,
    workoutRecords: workoutRecords.length,
    moodRecords: moodRecords.length,
    goals: goals.length,
    totalRecords: sleepRecords.length + workoutRecords.length + moodRecords.length,
  };

  const handleExport = () => {
    try {
      const insights: any[] = []; // Would come from insights store
      exportAllData(sleepRecords, workoutRecords, moodRecords, goals, insights);
      addToast({
        type: "success",
        title: "Export successful",
        message: "Your data has been exported as JSON.",
      });
    } catch (error) {
      addToast({
        type: "error",
        title: "Export failed",
        message: error instanceof Error ? error.message : "An unknown error occurred",
      });
    }
  };

  const handleBackup = () => {
    try {
      downloadBackup();
      addToast({
        type: "success",
        title: "Backup downloaded",
        message: "Your backup file has been downloaded.",
      });
    } catch (error) {
      addToast({
        type: "error",
        title: "Backup failed",
        message: error instanceof Error ? error.message : "An unknown error occurred",
      });
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const result = importFromJSON(text);
      setImportResult(result);

      if (result.isValid) {
        addToast({
          type: "success",
          title: "Import validation successful",
          message: `Found ${result.dataCounts.sleepRecords} sleep records, ${result.dataCounts.workoutRecords} workout records, ${result.dataCounts.goals} goals.`,
        });
        if (
          confirm(
            `Import ${result.dataCounts.sleepRecords} sleep records, ${result.dataCounts.workoutRecords} workout records, ${result.dataCounts.goals} goals?`
          )
        ) {
          const data = parseImportData(text);

          // This would require updating stores to accept bulk imports
          // For now, just show the validation result
          alert("Import functionality would update stores here");
        }
      } else {
        addToast({
          type: "error",
          title: "Import validation failed",
          message: result.errors[0] || "Please check your file and try again.",
        });
      }
    } catch (error) {
      setImportResult({
        isValid: false,
        errors: [
          `Failed to read file: ${error instanceof Error ? error.message : "Unknown error"}`,
        ],
        warnings: [],
        dataCounts: {
          sleepRecords: 0,
          workoutRecords: 0,
          moodEnergyRecords: 0,
          goals: 0,
          insights: 0,
        },
      });
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRestoreBackup = () => {
    fileInputRef.current?.click();
  };

  const handleClearAllData = () => {
    if (confirm("Are you sure you want to delete ALL data? This cannot be undone.")) {
      const result = clearAllData();
      if (result.success) {
        addToast({
          type: "success",
          title: "Data cleared",
          message: result.message,
        });
        setTimeout(() => {
          window.location.reload(); // Reload to clear state
        }, 1000);
      } else {
        addToast({
          type: "error",
          title: "Failed to clear data",
          message: result.message,
        });
      }
    }
    setShowClearConfirm(false);
  };

  const localStorageStats = getDataStats();
  const sizeInMB = (localStorageStats.totalSize / (1024 * 1024)).toFixed(2);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Settings</h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Manage your data and application settings
        </p>
      </div>

      {/* Data Overview */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="mb-4 flex items-center space-x-3">
          <HardDrive className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Data Overview</h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {dataStats.sleepRecords}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Sleep Records</p>
          </div>

          <div className="rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {dataStats.workoutRecords}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Workouts</p>
          </div>

          <div className="rounded-lg bg-purple-50 p-4 dark:bg-purple-900/20">
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {dataStats.moodRecords}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Mood Entries</p>
          </div>

          <div className="rounded-lg bg-orange-50 p-4 dark:bg-orange-900/20">
            <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {dataStats.goals}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Goals</p>
          </div>
        </div>

        <div className="mt-4 border-t border-gray-200 pt-4 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Total storage used: <span className="font-medium">{sizeInMB} MB</span>
          </p>
        </div>
      </div>

      {/* Export Data */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="mb-4 flex items-center space-x-3">
          <Download className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Export Data</h2>
        </div>

        <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
          Export your data as JSON for backup or migration purposes.
        </p>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleExport}
            className="flex items-center space-x-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
          >
            <FileJson className="h-4 w-4" />
            <span>Export as JSON</span>
          </button>

          <button
            onClick={handleBackup}
            className="flex items-center space-x-2 rounded-lg bg-gray-600 px-4 py-2 text-white transition-colors hover:bg-gray-700"
          >
            <HardDrive className="h-4 w-4" />
            <span>Download Backup</span>
          </button>
        </div>
      </div>

      {/* Import Data */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="mb-4 flex items-center space-x-3">
          <Upload className="h-5 w-5 text-green-600 dark:text-green-400" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Import Data</h2>
        </div>

        <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
          Import your data from a previously exported JSON file or backup.
        </p>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleImportClick}
            className="flex items-center space-x-2 rounded-lg bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-700"
          >
            <FileJson className="h-4 w-4" />
            <span>Import JSON Export</span>
          </button>

          <button
            onClick={handleRestoreBackup}
            className="flex items-center space-x-2 rounded-lg bg-gray-600 px-4 py-2 text-white transition-colors hover:bg-gray-700"
          >
            <HardDrive className="h-4 w-4" />
            <span>Restore from Backup</span>
          </button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Import Result */}
        {importResult && (
          <div
            className={`mt-4 rounded-lg border p-4 ${
              importResult.isValid
                ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20"
                : "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20"
            }`}
          >
            <div className="flex items-start space-x-2">
              <AlertTriangle
                className={`mt-0.5 h-5 w-5 flex-shrink-0 ${
                  importResult.isValid ? "text-green-600" : "text-red-600"
                }`}
              />
              <div className="flex-1">
                <p
                  className={`font-medium ${
                    importResult.isValid ? "text-green-900" : "text-red-900"
                  }`}
                >
                  {importResult.isValid
                    ? "Import Validation Successful"
                    : "Import Validation Failed"}
                </p>

                {importResult.dataCounts && (
                  <div className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                    <p>Data found in file:</p>
                    <ul className="ml-4 list-inside list-disc">
                      <li>{importResult.dataCounts.sleepRecords} sleep records</li>
                      <li>{importResult.dataCounts.workoutRecords} workout records</li>
                      <li>{importResult.dataCounts.moodEnergyRecords} mood entries</li>
                      <li>{importResult.dataCounts.goals} goals</li>
                    </ul>
                  </div>
                )}

                {importResult.errors.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm font-medium text-red-700">Errors:</p>
                    <ul className="ml-4 list-inside list-disc text-sm text-red-600">
                      {importResult.errors.map((error, i) => (
                        <li key={i}>{error}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {importResult.warnings.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm font-medium text-yellow-700">Warnings:</p>
                    <ul className="ml-4 list-inside list-disc text-sm text-yellow-600">
                      {importResult.warnings.map((warning, i) => (
                        <li key={i}>{warning}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Danger Zone */}
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-800 dark:bg-red-900/20">
        <div className="mb-4 flex items-center space-x-3">
          <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
          <h2 className="text-lg font-semibold text-red-900 dark:text-red-100">Danger Zone</h2>
        </div>

        <p className="mb-4 text-sm text-red-700 dark:text-red-300">
          These actions are irreversible. Please be careful.
        </p>

        {showClearConfirm ? (
          <div className="space-y-3">
            <p className="text-sm font-medium text-red-900 dark:text-red-100">
              Are you absolutely sure you want to delete ALL data? This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleClearAllData}
                className="rounded-lg bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700"
              >
                Yes, Delete Everything
              </button>
              <button
                onClick={() => setShowClearConfirm(false)}
                className="rounded-lg bg-gray-200 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowClearConfirm(true)}
            className="flex items-center space-x-2 rounded-lg bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700"
          >
            <Trash2 className="h-4 w-4" />
            <span>Clear All Data</span>
          </button>
        )}
      </div>

      {/* App Info */}
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-800">
        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">About</h2>
        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <p>
            <span className="font-medium">Version:</span> 1.0.0
          </p>
          <p>
            <span className="font-medium">Data Storage:</span> LocalStorage (browser-based)
          </p>
          <p className="mt-3 text-xs">
            Your data is stored locally in your browser. Clearing browser data may remove your
            tracking data. We recommend regularly exporting backups.
          </p>
        </div>
      </div>
    </div>
  );
}
