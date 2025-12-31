import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  Goal,
  GoalInput,
  GoalProgress,
  GoalStats,
  Streak,
  Achievement,
  Milestone,
} from "../types";
import {
  calculateGoalProgress,
  calculateGoalStats,
  calculateStreak,
  getAchievements,
  createMilestones,
  checkMilestones,
  updateGoalStatus,
} from "../services";

interface GoalsStore {
  goals: Goal[];
  milestones: Milestone[];
  achievements: Achievement[];
  currentStreak: Streak;
  addGoal: (goal: GoalInput) => void;
  updateGoal: (id: string, updates: Partial<GoalInput>) => void;
  deleteGoal: (id: string) => void;
  updateGoalProgress: (sleepRecords: any[], workoutRecords: any[]) => void;
  getGoalProgress: (
    goalId: string,
    sleepRecords: any[],
    workoutRecords: any[]
  ) => GoalProgress | undefined;
  getGoalStats: () => GoalStats;
  getActiveGoals: () => Goal[];
  getCompletedGoals: () => Goal[];
  refreshStreak: (sleepRecords: any[], workoutRecords?: any[]) => void;
  refreshAchievements: (sleepRecords: any[], workoutRecords: any[]) => void;
}

const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const useGoalsStore = create<GoalsStore>()(
  persist(
    (set, get) => ({
      goals: [],
      milestones: [],
      achievements: [],
      currentStreak: {
        current: 0,
        best: 0,
        startDate: new Date().toISOString(),
        lastDate: new Date().toISOString(),
      },

      addGoal: (goalInput: GoalInput) => {
        const newGoal: Goal = {
          id: generateId(),
          ...goalInput,
          currentValue: 0,
          status: "active",
          startDate: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        set((state) => ({
          goals: [...state.goals, newGoal],
          milestones: [...state.milestones, ...createMilestones(newGoal.id)],
        }));
      },

      updateGoal: (id: string, updates: Partial<GoalInput>) => {
        set((state) => ({
          goals: state.goals.map((goal) =>
            goal.id === id ? { ...goal, ...updates, updatedAt: new Date().toISOString() } : goal
          ),
        }));
      },

      deleteGoal: (id: string) => {
        set((state) => ({
          goals: state.goals.filter((goal) => goal.id !== id),
          milestones: state.milestones.filter((milestone) => milestone.goalId !== id),
        }));
      },

      updateGoalProgress: (sleepRecords: any[], workoutRecords: any[]) => {
        const { goals } = get();

        const updatedGoals = goals.map((goal) => {
          const progress = calculateGoalProgress(goal, sleepRecords, workoutRecords);
          return {
            ...goal,
            currentValue: progress.currentValue,
            status: updateGoalStatus(goal, progress),
            updatedAt: new Date().toISOString(),
          };
        });

        // Check and update milestones
        let updatedMilestones = get().milestones;
        updatedGoals.forEach((goal) => {
          const progress = calculateGoalProgress(goal, sleepRecords, workoutRecords);
          updatedMilestones = checkMilestones(updatedMilestones, progress.percentage);
        });

        set({
          goals: updatedGoals,
          milestones: updatedMilestones,
        });
      },

      getGoalProgress: (goalId: string, sleepRecords: any[], workoutRecords: any[]) => {
        const { goals } = get();
        const goal = goals.find((g) => g.id === goalId);

        if (!goal) return undefined;

        return calculateGoalProgress(goal, sleepRecords, workoutRecords);
      },

      getGoalStats: () => {
        const { goals } = get();
        return calculateGoalStats(goals);
      },

      getActiveGoals: () => {
        return get().goals.filter((goal) => goal.status === "active");
      },

      getCompletedGoals: () => {
        return get().goals.filter((goal) => goal.status === "completed");
      },

      refreshStreak: (sleepRecords: any[], workoutRecords?: any[]) => {
        const streak = calculateStreak(sleepRecords, workoutRecords);

        set({ currentStreak: streak });
      },

      refreshAchievements: (sleepRecords: any[], workoutRecords: any[]) => {
        const { currentStreak } = get();

        const achievements = getAchievements(sleepRecords, workoutRecords, currentStreak);

        set({ achievements });
      },
    }),
    {
      name: "goals-storage",
      partialize: (state) => ({
        goals: state.goals,
        milestones: state.milestones,
        achievements: state.achievements,
      }),
    }
  )
);
