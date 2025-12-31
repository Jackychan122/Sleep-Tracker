import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { WorkoutRecord, WorkoutRecordInput, WorkoutFilters } from "../types";

interface WorkoutStore {
  records: WorkoutRecord[];
  filteredRecords: WorkoutRecord[];
  filters: WorkoutFilters;
  addRecord: (record: WorkoutRecordInput) => void;
  updateRecord: (id: string, record: Partial<WorkoutRecordInput>) => void;
  deleteRecord: (id: string) => void;
  setFilters: (filters: WorkoutFilters) => void;
  clearFilters: () => void;
  getRecordById: (id: string) => WorkoutRecord | undefined;
  getRecordsByDateRange: (startDate: string, endDate: string) => WorkoutRecord[];
}

const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

const getCurrentTimestamp = (): string => {
  return new Date().toISOString();
};

export const useWorkoutStore = create<WorkoutStore>()(
  persist(
    (set, get) => ({
      records: [],
      filteredRecords: [],
      filters: {},

      addRecord: (record: WorkoutRecordInput) => {
        const newRecord: WorkoutRecord = {
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

      updateRecord: (id: string, record: Partial<WorkoutRecordInput>) => {
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

      setFilters: (filters: WorkoutFilters) => {
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
      name: "workout-storage",
      partialize: (state) => ({ records: state.records }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.filteredRecords = applyFilters(state.records, state.filters);
        }
      },
    }
  )
);

function applyFilters(records: WorkoutRecord[], filters: WorkoutFilters): WorkoutRecord[] {
  let filtered = [...records];

  if (filters.startDate) {
    filtered = filtered.filter((r) => r.date >= filters.startDate!);
  }

  if (filters.endDate) {
    filtered = filtered.filter((r) => r.date <= filters.endDate!);
  }

  if (filters.type) {
    filtered = filtered.filter((r) => r.type === filters.type);
  }

  if (filters.intensity) {
    filtered = filtered.filter((r) => r.intensity === filters.intensity);
  }

  if (filters.minDuration !== undefined) {
    filtered = filtered.filter((r) => r.duration >= filters.minDuration!);
  }

  if (filters.maxDuration !== undefined) {
    filtered = filtered.filter((r) => r.duration <= filters.maxDuration!);
  }

  return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
