import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Insight, Recommendation, InsightCategory } from "../types";
import {
  generateAllInsights,
  markAsRead,
  markAsDismissed,
  markAsImplemented,
  filterByCategory,
  filterByType,
  getUnreadInsights,
  getActiveInsights,
} from "../services/insightsService";
import { useSleepStore } from "./sleepStore";
import { useWorkoutStore } from "./workoutStore";
import { useMoodEnergyStore } from "./moodEnergyStore";

interface InsightsStore {
  insights: Insight[];
  selectedCategory: InsightCategory | "all";
  selectedType: string | "all";
  showUnreadOnly: boolean;
  showActiveOnly: boolean;
  generateInsights: () => void;
  setSelectedCategory: (category: InsightCategory | "all") => void;
  setSelectedType: (type: string | "all") => void;
  setShowUnreadOnly: (show: boolean) => void;
  setShowActiveOnly: (show: boolean) => void;
  markAsRead: (id: string) => void;
  markAsDismissed: (id: string) => void;
  markAsImplemented: (id: string) => void;
  markAllAsRead: () => void;
  clearDismissed: () => void;
  getFilteredInsights: () => Insight[];
  getUnreadCount: () => number;
}

export const useInsightsStore = create<InsightsStore>()(
  persist(
    (set, get) => ({
      insights: [],
      selectedCategory: "all",
      selectedType: "all",
      showUnreadOnly: false,
      showActiveOnly: false,

      generateInsights: () => {
        const sleepRecords = useSleepStore.getState().records;
        const workoutRecords = useWorkoutStore.getState().records;
        const moodRecords = useMoodEnergyStore.getState().records;

        const newInsights = generateAllInsights(sleepRecords, workoutRecords, moodRecords);

        set({ insights: newInsights });
      },

      setSelectedCategory: (category) => {
        set({ selectedCategory: category });
      },

      setSelectedType: (type) => {
        set({ selectedType: type });
      },

      setShowUnreadOnly: (show) => {
        set({ showUnreadOnly: show });
      },

      setShowActiveOnly: (show) => {
        set({ showActiveOnly: show });
      },

      markAsRead: (id) => {
        set((state) => ({
          insights: markAsRead(state.insights, id),
        }));
      },

      markAsDismissed: (id) => {
        set((state) => ({
          insights: markAsDismissed(state.insights, id),
        }));
      },

      markAsImplemented: (id) => {
        set((state) => ({
          insights: markAsImplemented(state.insights as Recommendation[], id) as Insight[],
        }));
      },

      markAllAsRead: () => {
        set((state) => ({
          insights: state.insights.map((insight) => ({
            ...insight,
            isRead: true,
          })),
        }));
      },

      clearDismissed: () => {
        set((state) => ({
          insights: state.insights.filter((insight) => !insight.isDismissed),
        }));
      },

      getFilteredInsights: () => {
        const state = get();
        let filtered = state.insights;

        // Filter by category
        if (state.selectedCategory !== "all") {
          filtered = filterByCategory(filtered, state.selectedCategory);
        }

        // Filter by type
        if (state.selectedType !== "all") {
          filtered = filterByType(filtered, state.selectedType as any);
        }

        // Filter by read status
        if (state.showUnreadOnly) {
          filtered = getUnreadInsights(filtered);
        }

        // Filter by active status
        if (state.showActiveOnly) {
          filtered = getActiveInsights(filtered);
        }

        return filtered;
      },

      getUnreadCount: () => {
        return get().insights.filter((insight) => !insight.isRead).length;
      },
    }),
    {
      name: "insights-storage",
      partialize: (state) => ({
        insights: state.insights,
        selectedCategory: state.selectedCategory,
        selectedType: state.selectedType,
        showUnreadOnly: state.showUnreadOnly,
        showActiveOnly: state.showActiveOnly,
      }),
    }
  )
);
