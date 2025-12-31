import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { MoodEnergyRecord, MoodEnergyInput, MoodEnergyFilters } from "../types";

interface MoodEnergyStore {
  records: MoodEnergyRecord[];
  filteredRecords: MoodEnergyRecord[];
  filters: MoodEnergyFilters;
  addRecord: (record: MoodEnergyInput) => void;
  updateRecord: (id: string, record: Partial<MoodEnergyInput>) => void;
  deleteRecord: (id: string) => void;
  setFilters: (filters: MoodEnergyFilters) => void;
  clearFilters: () => void;
  getRecordById: (id: string) => MoodEnergyRecord | undefined;
  getRecordsByDateRange: (startDate: string, endDate: string) => MoodEnergyRecord[];
  getRecordByDate: (date: string) => MoodEnergyRecord | undefined;
}

const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

const getCurrentTimestamp = (): string => {
  return new Date().toISOString();
};

export const useMoodEnergyStore = create<MoodEnergyStore>()(
  persist(
    (set, get) => ({
      records: [],
      filteredRecords: [],
      filters: {},

      addRecord: (record: MoodEnergyInput) => {
        const newRecord: MoodEnergyRecord = {
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

      updateRecord: (id: string, record: Partial<MoodEnergyInput>) => {
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

      setFilters: (filters: MoodEnergyFilters) => {
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

      getRecordByDate: (date: string) => {
        return get().records.find((r) => r.date === date);
      },
    }),
    {
      name: "mood-energy-storage",
      partialize: (state) => ({ records: state.records }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.filteredRecords = applyFilters(state.records, state.filters);
        }
      },
    }
  )
);

function applyFilters(records: MoodEnergyRecord[], filters: MoodEnergyFilters): MoodEnergyRecord[] {
  let filtered = [...records];

  if (filters.startDate) {
    filtered = filtered.filter((r) => r.date >= filters.startDate!);
  }

  if (filters.endDate) {
    filtered = filtered.filter((r) => r.date <= filters.endDate!);
  }

  if (filters.minMood !== undefined) {
    filtered = filtered.filter((r) => r.mood >= filters.minMood!);
  }

  if (filters.maxMood !== undefined) {
    filtered = filtered.filter((r) => r.mood <= filters.maxMood!);
  }

  return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
