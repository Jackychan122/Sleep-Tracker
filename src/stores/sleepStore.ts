import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { SleepRecord, SleepRecordInput, SleepFilters } from "../types";

interface SleepStore {
  records: SleepRecord[];
  filteredRecords: SleepRecord[];
  filters: SleepFilters;
  addRecord: (record: SleepRecordInput) => void;
  updateRecord: (id: string, record: Partial<SleepRecordInput>) => void;
  deleteRecord: (id: string) => void;
  setFilters: (filters: SleepFilters) => void;
  clearFilters: () => void;
  getRecordById: (id: string) => SleepRecord | undefined;
  getRecordsByDateRange: (startDate: string, endDate: string) => SleepRecord[];
}

const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

const getCurrentTimestamp = (): string => {
  return new Date().toISOString();
};

export const useSleepStore = create<SleepStore>()(
  persist(
    (set, get) => ({
      records: [],
      filteredRecords: [],
      filters: {},

      addRecord: (record: SleepRecordInput) => {
        const newRecord: SleepRecord = {
          id: generateId(),
          ...record,
          createdAt: getCurrentTimestamp(),
          updatedAt: getCurrentTimestamp(),
        };
        set((state) => {
          const updatedRecords = [...state.records, newRecord];
          return {
            records: updatedRecords,
            filteredRecords: applyFilters(updatedRecords, state.filters),
          };
        });
      },

      updateRecord: (id: string, record: Partial<SleepRecordInput>) => {
        set((state) => {
          const updatedRecords = state.records.map((r) =>
            r.id === id ? { ...r, ...record, updatedAt: getCurrentTimestamp() } : r
          );
          return {
            records: updatedRecords,
            filteredRecords: applyFilters(updatedRecords, state.filters),
          };
        });
      },

      deleteRecord: (id: string) => {
        set((state) => {
          const updatedRecords = state.records.filter((r) => r.id !== id);
          return {
            records: updatedRecords,
            filteredRecords: applyFilters(updatedRecords, state.filters),
          };
        });
      },

      setFilters: (filters: SleepFilters) => {
        set((state) => ({
          filters,
          filteredRecords: applyFilters(state.records, filters),
        }));
      },

      clearFilters: () => {
        set((state) => ({
          filters: {},
          filteredRecords: state.records,
        }));
      },

      getRecordById: (id: string) => {
        return get().records.find((r) => r.id === id);
      },

      getRecordsByDateRange: (startDate: string, endDate: string) => {
        return get().records.filter((r) => r.date >= startDate && r.date <= endDate);
      },
    }),
    {
      name: "sleep-storage",
      partialize: (state) => ({ records: state.records }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.filteredRecords = applyFilters(state.records, state.filters);
        }
      },
    }
  )
);

function applyFilters(records: SleepRecord[], filters: SleepFilters): SleepRecord[] {
  let filtered = [...records];

  if (filters.startDate) {
    filtered = filtered.filter((r) => r.date >= filters.startDate!);
  }

  if (filters.endDate) {
    filtered = filtered.filter((r) => r.date <= filters.endDate!);
  }

  if (filters.minQualityScore !== undefined) {
    filtered = filtered.filter((r) => r.qualityScore >= filters.minQualityScore!);
  }

  if (filters.maxQualityScore !== undefined) {
    filtered = filtered.filter((r) => r.qualityScore <= filters.maxQualityScore!);
  }

  if (filters.minDuration !== undefined) {
    filtered = filtered.filter((r) => r.duration >= filters.minDuration!);
  }

  if (filters.maxDuration !== undefined) {
    filtered = filtered.filter((r) => r.duration <= filters.maxDuration!);
  }

  return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
