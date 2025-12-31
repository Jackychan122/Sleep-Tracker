import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Button, Input } from "../common";
import { sleepRecordSchema, type SleepRecordFormData } from "../../schemas";
import { useSleepStore } from "../../stores";
import { getTodayDate, calculateDuration } from "../../utils";
import type { SleepRecord } from "../../types";

interface SleepFormProps {
  record?: SleepRecord;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function SleepForm({ record, onSuccess, onCancel }: SleepFormProps) {
  const { addRecord, updateRecord } = useSleepStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<SleepRecordFormData>({
    resolver: zodResolver(sleepRecordSchema),
    defaultValues: record
      ? {
          date: record.date,
          bedtime: record.bedtime,
          wakeTime: record.wakeTime,
          duration: record.duration,
          deepSleep: record.deepSleep,
          remSleep: record.remSleep,
          lightSleep: record.lightSleep,
          efficiency: record.efficiency,
          qualityScore: record.qualityScore,
          notes: record.notes,
        }
      : {
          date: getTodayDate(),
          bedtime: "23:00",
          wakeTime: "07:00",
          duration: 480,
          deepSleep: 90,
          remSleep: 90,
          lightSleep: 300,
          efficiency: 85,
          qualityScore: 7,
          notes: "",
        },
  });

  const bedtime = watch("bedtime");
  const wakeTime = watch("wakeTime");

  useEffect(() => {
    if (bedtime && wakeTime) {
      const duration = calculateDuration(bedtime, wakeTime);
      setValue("duration", duration);
    }
  }, [bedtime, wakeTime, setValue]);

  const onSubmit = async (data: SleepRecordFormData) => {
    try {
      if (record) {
        updateRecord(record.id, data);
      } else {
        addRecord(data);
      }
      onSuccess?.();
    } catch (error) {
      console.error("Error saving sleep record:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input type="date" label="Date" {...register("date")} error={errors.date?.message} />

      <div className="grid grid-cols-2 gap-4">
        <Input
          type="time"
          label="Bedtime"
          {...register("bedtime")}
          error={errors.bedtime?.message}
        />
        <Input
          type="time"
          label="Wake Time"
          {...register("wakeTime")}
          error={errors.wakeTime?.message}
        />
      </div>

      <Input
        type="number"
        label="Duration (minutes)"
        {...register("duration", { valueAsNumber: true })}
        error={errors.duration?.message}
        helperText="Auto-calculated from bedtime and wake time"
      />

      <div className="grid grid-cols-3 gap-4">
        <Input
          type="number"
          label="Deep Sleep (min)"
          {...register("deepSleep", { valueAsNumber: true })}
          error={errors.deepSleep?.message}
        />
        <Input
          type="number"
          label="REM Sleep (min)"
          {...register("remSleep", { valueAsNumber: true })}
          error={errors.remSleep?.message}
        />
        <Input
          type="number"
          label="Light Sleep (min)"
          {...register("lightSleep", { valueAsNumber: true })}
          error={errors.lightSleep?.message}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          type="number"
          label="Efficiency (%)"
          {...register("efficiency", { valueAsNumber: true })}
          error={errors.efficiency?.message}
        />
        <Input
          type="number"
          label="Quality Score (1-10)"
          {...register("qualityScore", { valueAsNumber: true })}
          error={errors.qualityScore?.message}
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Notes</label>
        <textarea
          {...register("notes")}
          className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 shadow-sm placeholder:text-gray-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
          placeholder="Any additional notes about your sleep..."
        />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" isLoading={isSubmitting}>
          {record ? "Update" : "Save"} Sleep Record
        </Button>
      </div>
    </form>
  );
}
