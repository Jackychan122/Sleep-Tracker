import { useState } from "react";
import { X } from "lucide-react";
import type { GoalInput, GoalType, GoalCategory, GoalPeriod } from "../../types";
import { Button } from "../common";

interface GoalFormProps {
  onSubmit: (goal: GoalInput) => void;
  onCancel: () => void;
}

const goalTypes: Array<{ value: GoalType; label: string; description: string }> = [
  {
    value: "sleep-duration",
    label: "Sleep Duration",
    description: "Target average sleep time per night",
  },
  {
    value: "sleep-quality",
    label: "Sleep Quality",
    description: "Target average sleep quality score",
  },
  {
    value: "sleep-efficiency",
    label: "Sleep Efficiency",
    description: "Target sleep efficiency percentage",
  },
  {
    value: "bedtime-consistency",
    label: "Bedtime Consistency",
    description: "Maintain consistent bedtime",
  },
  {
    value: "workout-frequency",
    label: "Workout Frequency",
    description: "Target number of workouts",
  },
  {
    value: "workout-duration",
    label: "Workout Duration",
    description: "Target total workout time",
  },
  {
    value: "streak-days",
    label: "Streak Days",
    description: "Target consecutive days of tracking",
  },
];

const categories: Array<{ value: GoalCategory; label: string }> = [
  { value: "sleep", label: "Sleep" },
  { value: "workout", label: "Workout" },
  { value: "consistency", label: "Consistency" },
  { value: "custom", label: "Custom" },
];

const periods: Array<{ value: GoalPeriod; label: string }> = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
];

export function GoalForm({ onSubmit, onCancel }: GoalFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<GoalType>("sleep-duration");
  const [category, setCategory] = useState<GoalCategory>("sleep");
  const [targetValue, setTargetValue] = useState("480");
  const [period, setPeriod] = useState<GoalPeriod>("daily");
  const [endDate, setEndDate] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const goal: GoalInput = {
      title: title.trim() || goalTypes.find((gt) => gt.value === type)?.label || "New Goal",
      description: description.trim(),
      type,
      category,
      targetValue: parseFloat(targetValue) || 0,
      period,
      endDate: endDate || undefined,
    };

    onSubmit(goal);
  };

  const getTargetValueLabel = () => {
    switch (type) {
      case "sleep-duration":
      case "workout-duration":
        return "Target Duration (minutes)";
      case "sleep-quality":
        return "Target Quality Score (0-100)";
      case "sleep-efficiency":
      case "bedtime-consistency":
        return "Target Percentage (%)";
      case "workout-frequency":
      case "streak-days":
        return "Target Count";
      default:
        return "Target Value";
    }
  };

  const getTargetValuePlaceholder = () => {
    switch (type) {
      case "sleep-duration":
        return "e.g., 480 (8 hours)";
      case "sleep-quality":
        return "e.g., 75";
      case "sleep-efficiency":
      case "bedtime-consistency":
        return "e.g., 85";
      case "workout-frequency":
        return "e.g., 3";
      case "workout-duration":
        return "e.g., 150";
      case "streak-days":
        return "e.g., 30";
      default:
        return "Enter value";
    }
  };

  const getDefaultValue = () => {
    switch (type) {
      case "sleep-duration":
        return "480";
      case "sleep-quality":
        return "70";
      case "sleep-efficiency":
      case "bedtime-consistency":
        return "85";
      case "workout-frequency":
        return "3";
      case "workout-duration":
        return "150";
      case "streak-days":
        return "30";
      default:
        return "0";
    }
  };

  const handleTypeChange = (newType: GoalType) => {
    setType(newType);
    setTargetValue(getDefaultValue());

    // Auto-set category based on type
    if (newType.startsWith("sleep")) {
      setCategory("sleep");
    } else if (newType.startsWith("workout")) {
      setCategory("workout");
    } else if (newType === "bedtime-consistency" || newType === "streak-days") {
      setCategory("consistency");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Type Selection */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Goal Type
        </label>
        <select
          value={type}
          onChange={(e) => handleTypeChange(e.target.value as GoalType)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          required
        >
          {goalTypes.map((gt) => (
            <option key={gt.value} value={gt.value}>
              {gt.label} - {gt.description}
            </option>
          ))}
        </select>
      </div>

      {/* Title */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter goal title (optional)"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        />
      </div>

      {/* Description */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your goal (optional)"
          rows={3}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        />
      </div>

      {/* Category */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Category
        </label>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.value}
              type="button"
              onClick={() => setCategory(cat.value)}
              className={`rounded-lg px-4 py-2 font-medium transition-colors ${
                category === cat.value
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Target Value */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          {getTargetValueLabel()}
        </label>
        <input
          type="number"
          value={targetValue}
          onChange={(e) => setTargetValue(e.target.value)}
          placeholder={getTargetValuePlaceholder()}
          step="1"
          min="0"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          required
        />
      </div>

      {/* Period */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Period
        </label>
        <div className="flex flex-wrap gap-2">
          {periods.map((per) => (
            <button
              key={per.value}
              type="button"
              onClick={() => setPeriod(per.value)}
              className={`rounded-lg px-4 py-2 font-medium transition-colors ${
                period === per.value
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              {per.label}
            </button>
          ))}
        </div>
      </div>

      {/* End Date (Optional) */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          End Date (Optional)
        </label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          min={new Date().toISOString().split("T")[0]}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <Button type="submit" className="flex-1">
          Create Goal
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
