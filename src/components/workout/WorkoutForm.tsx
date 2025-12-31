import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input, Select } from "../common";
import { workoutRecordSchema, type WorkoutRecordFormData } from "../../schemas";
import { useWorkoutStore } from "../../stores";
import { getTodayDate } from "../../utils";
import type { WorkoutRecord } from "../../types";

const workoutTypeOptions = [
  { value: "cardio", label: "Cardio" },
  { value: "strength", label: "Strength" },
  { value: "hiit", label: "HIIT" },
  { value: "yoga", label: "Yoga" },
  { value: "pilates", label: "Pilates" },
  { value: "cycling", label: "Cycling" },
  { value: "running", label: "Running" },
  { value: "swimming", label: "Swimming" },
  { value: "walking", label: "Walking" },
  { value: "other", label: "Other" },
];

const intensityOptions = [
  { value: "low", label: "Low" },
  { value: "moderate", label: "Moderate" },
  { value: "high", label: "High" },
  { value: "very-high", label: "Very High" },
];

interface WorkoutFormProps {
  record?: WorkoutRecord;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function WorkoutForm({ record, onSuccess, onCancel }: WorkoutFormProps) {
  const { addRecord, updateRecord } = useWorkoutStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<WorkoutRecordFormData>({
    resolver: zodResolver(workoutRecordSchema),
    defaultValues: record
      ? {
          date: record.date,
          time: record.time,
          type: record.type,
          duration: record.duration,
          intensity: record.intensity,
          performanceMetrics: record.performanceMetrics,
          perceivedExertion: record.perceivedExertion,
          energyLevel: record.energyLevel,
          notes: record.notes,
        }
      : {
          date: getTodayDate(),
          time: "09:00",
          type: "cardio",
          duration: 30,
          intensity: "moderate",
          performanceMetrics: {
            caloriesBurned: 0,
            distance: 0,
            heartRateAvg: 0,
            heartRateMax: 0,
            reps: 0,
            sets: 0,
            weight: 0,
          },
          perceivedExertion: 5,
          energyLevel: 7,
          notes: "",
        },
  });

  const onSubmit = async (data: WorkoutRecordFormData) => {
    try {
      if (record) {
        updateRecord(record.id, data);
      } else {
        addRecord(data);
      }
      onSuccess?.();
    } catch (error) {
      console.error("Error saving workout record:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Input type="date" label="Date" {...register("date")} error={errors.date?.message} />
        <Input type="time" label="Time" {...register("time")} error={errors.time?.message} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Workout Type</label>
          <Select
            options={workoutTypeOptions}
            value={watch("type")}
            onValueChange={(value) => setValue("type", value as any)}
            placeholder="Select workout type"
            error={errors.type?.message}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Intensity</label>
          <Select
            options={intensityOptions}
            value={watch("intensity")}
            onValueChange={(value) => setValue("intensity", value as any)}
            placeholder="Select intensity"
            error={errors.intensity?.message}
          />
        </div>
      </div>

      <Input
        type="number"
        label="Duration (minutes)"
        {...register("duration", { valueAsNumber: true })}
        error={errors.duration?.message}
      />

      <div className="border-t border-gray-200 pt-4">
        <h4 className="mb-3 text-sm font-medium text-gray-700">Performance Metrics (Optional)</h4>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <Input
            type="number"
            label="Calories Burned"
            {...register("performanceMetrics.caloriesBurned", { valueAsNumber: true })}
          />
          <Input
            type="number"
            label="Distance (km)"
            {...register("performanceMetrics.distance", { valueAsNumber: true })}
          />
          <Input
            type="number"
            label="Avg Heart Rate"
            {...register("performanceMetrics.heartRateAvg", { valueAsNumber: true })}
          />
          <Input
            type="number"
            label="Max Heart Rate"
            {...register("performanceMetrics.heartRateMax", { valueAsNumber: true })}
          />
          <Input
            type="number"
            label="Reps"
            {...register("performanceMetrics.reps", { valueAsNumber: true })}
          />
          <Input
            type="number"
            label="Sets"
            {...register("performanceMetrics.sets", { valueAsNumber: true })}
          />
          <Input
            type="number"
            label="Weight (kg)"
            {...register("performanceMetrics.weight", { valueAsNumber: true })}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          type="number"
          label="Perceived Exertion (1-10)"
          {...register("perceivedExertion", { valueAsNumber: true })}
          error={errors.perceivedExertion?.message}
          helperText="Borg scale: 1 = very light, 10 = maximum effort"
        />
        <Input
          type="number"
          label="Energy Level (1-10)"
          {...register("energyLevel", { valueAsNumber: true })}
          error={errors.energyLevel?.message}
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Notes</label>
        <textarea
          {...register("notes")}
          className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 shadow-sm placeholder:text-gray-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
          placeholder="Any additional notes about your workout..."
        />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" isLoading={isSubmitting}>
          {record ? "Update" : "Save"} Workout Record
        </Button>
      </div>
    </form>
  );
}
