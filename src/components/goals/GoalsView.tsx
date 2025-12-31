import { useEffect, useState } from "react";
import { Plus, Target, Trophy } from "lucide-react";
import { useGoalsStore, useSleepStore, useWorkoutStore, useToastStore } from "../../stores";
import { GoalCard } from "./GoalCard";
import { GoalForm } from "./GoalForm";
import { StreakDisplay } from "./StreakDisplay";
import type { Goal, GoalInput } from "../../types";
import { Modal, EmptyState } from "../common";

export function GoalsView() {
  const sleepRecords = useSleepStore((state) => state.records);
  const workoutRecords = useWorkoutStore((state) => state.records);

  const {
    goals,
    currentStreak,
    addGoal,
    updateGoal,
    deleteGoal,
    getGoalProgress,
    getGoalStats,
    refreshStreak,
    updateGoalProgress,
  } = useGoalsStore();
  const { addToast } = useToastStore();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<"all" | "active" | "completed">(
    "active"
  );

  useEffect(() => {
    // Refresh streak on mount
    refreshStreak(sleepRecords, workoutRecords);
    updateGoalProgress(sleepRecords, workoutRecords);
  }, [sleepRecords, workoutRecords]);

  const stats = getGoalStats();
  const filteredGoals = goals.filter((goal) => {
    if (selectedCategory === "all") return true;
    return goal.status === selectedCategory;
  });

  const handleCreateGoal = (goalInput: GoalInput) => {
    addGoal(goalInput);
    addToast({
      type: "success",
      title: "Goal created",
      message: `"${goalInput.title}" has been added to your goals.`,
    });
    setShowCreateModal(false);
    updateGoalProgress(sleepRecords, workoutRecords);
  };

  const handleDeleteGoal = (id: string) => {
    if (confirm("Are you sure you want to delete this goal?")) {
      const goal = goals.find((g) => g.id === id);
      deleteGoal(id);
      updateGoalProgress(sleepRecords, workoutRecords);
      if (goal) {
        addToast({
          type: "success",
          title: "Goal deleted",
          message: `"${goal.title}" has been removed.`,
        });
      }
    }
  };

  const handlePauseGoal = (id: string) => {
    updateGoal(id, {});
    // Note: You'd need to add status update to the store
  };

  const handleResumeGoal = (id: string) => {
    updateGoal(id, {});
    // Note: You'd need to add status update to the store
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Goals</h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Set goals and track your progress
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center space-x-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
          >
            <Plus className="h-5 w-5" />
            <span>New Goal</span>
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center space-x-3">
            <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/20">
              <Target className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {stats.totalGoals}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Total Goals</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center space-x-3">
            <div className="rounded-lg bg-yellow-100 p-2 dark:bg-yellow-900/20">
              <Target className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {stats.activeGoals}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Active Goals</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center space-x-3">
            <div className="rounded-lg bg-green-100 p-2 dark:bg-green-900/20">
              <Trophy className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {stats.completedGoals}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Completed</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center space-x-3">
            <div className="rounded-lg bg-purple-100 p-2 dark:bg-purple-900/20">
              <Trophy className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {stats.overallCompletionRate.toFixed(0)}%
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Success Rate</p>
            </div>
          </div>
        </div>
      </div>

      {/* Streak Display */}
      <div className="mb-6">
        <StreakDisplay streak={currentStreak} />
      </div>

      {/* Filter Tabs */}
      <div className="mb-4">
        <div className="flex space-x-1 rounded-lg bg-gray-100 p-1 dark:bg-gray-800">
          <button
            onClick={() => setSelectedCategory("active")}
            className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              selectedCategory === "active"
                ? "bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-gray-100"
                : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
            }`}
          >
            Active ({stats.activeGoals})
          </button>
          <button
            onClick={() => setSelectedCategory("completed")}
            className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              selectedCategory === "completed"
                ? "bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-gray-100"
                : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
            }`}
          >
            Completed ({stats.completedGoals})
          </button>
          <button
            onClick={() => setSelectedCategory("all")}
            className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              selectedCategory === "all"
                ? "bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-gray-100"
                : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
            }`}
          >
            All ({stats.totalGoals})
          </button>
        </div>
      </div>

      {/* Goals List */}
      <div className="flex-1 overflow-y-auto">
        {filteredGoals.length === 0 ? (
          <EmptyState
            type="goals"
            action={{
              label: "Create Goal",
              onClick: () => setShowCreateModal(true),
            }}
          />
        ) : (
          <div className="grid gap-4">
            {filteredGoals.map((goal) => {
              const progress = getGoalProgress(goal.id, sleepRecords, workoutRecords);
              if (!progress) return null;

              return (
                <GoalCard
                  key={goal.id}
                  goal={goal}
                  progress={progress}
                  onDelete={handleDeleteGoal}
                  onPause={handlePauseGoal}
                  onResume={handleResumeGoal}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Create Goal Modal */}
      <Modal
        open={showCreateModal}
        onOpenChange={() => setShowCreateModal(false)}
        title="Create New Goal"
      >
        <GoalForm onSubmit={handleCreateGoal} onCancel={() => setShowCreateModal(false)} />
      </Modal>
    </div>
  );
}
