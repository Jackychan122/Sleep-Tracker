import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input } from "../common";
import { moodEnergyRecordSchema, type MoodEnergyRecordFormData } from "../../schemas";
import { useMoodEnergyStore } from "../../stores";
import { getTodayDate } from "../../utils";
import type { MoodEnergyRecord } from "../../types";

interface MoodEnergyFormProps {
  record?: MoodEnergyRecord;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const moodEmojis: Record<number, string> = {
  1: "😔",
  2: "😕",
  3: "😐",
  4: "🙂",
  5: "😊",
};

const moodLabels: Record<number, string> = {
  1: "Very Low",
  2: "Low",
  3: "Neutral",
  4: "Good",
  5: "Excellent",
};

export function MoodEnergyForm({ record, onSuccess, onCancel }: MoodEnergyFormProps) {
  const { addRecord, updateRecord } = useMoodEnergyStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<MoodEnergyRecordFormData>({
    resolver: zodResolver(moodEnergyRecordSchema),
    defaultValues: record
      ? {
          date: record.date,
          mood: record.mood,
          morningEnergy: record.morningEnergy,
          afternoonEnergy: record.afternoonEnergy,
          eveningEnergy: record.eveningEnergy,
          notes: record.notes,
        }
      : {
          date: getTodayDate(),
          mood: 3,
          morningEnergy: 5,
          afternoonEnergy: 5,
          eveningEnergy: 5,
          notes: "",
        },
  });

  const selectedMood = watch("mood");

  const onSubmit = async (data: MoodEnergyRecordFormData) => {
    try {
      if (record) {
        updateRecord(record.id, data);
      } else {
        addRecord(data);
      }
      onSuccess?.();
    } catch (error) {
      console.error("Error saving mood/energy record:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input type="date" label="Date" {...register("date")} error={errors.date?.message} />

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          How was your overall mood today?
        </label>
        <div className="grid grid-cols-5 gap-2">
          {[1, 2, 3, 4, 5].map((value) => (
            <label
              key={value}
              className={`
                cursor-pointer rounded-lg border-2 p-3 text-center transition-all
                ${
                  selectedMood === value
                    ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
                    : "border-gray-200 hover:border-gray-300"
                }
              `}
            >
              <input
                type="radio"
                {...register("mood", { valueAsNumber: true })}
                value={value}
                className="sr-only"
              />
              <div className="mb-1 text-2xl">{moodEmojis[value]}</div>
              <div className="text-xs text-gray-600">{moodLabels[value]}</div>
            </label>
          ))}
        </div>
        {errors.mood && <p className="mt-1 text-sm text-red-600">{errors.mood.message}</p>}
      </div>

      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          Energy Level Throughout the Day (1-10)
        </label>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="mb-1 block text-xs text-gray-500">Morning</label>
            <Input
              type="number"
              min="1"
              max="10"
              {...register("morningEnergy", { valueAsNumber: true })}
              error={errors.morningEnergy?.message}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-gray-500">Afternoon</label>
            <Input
              type="number"
              min="1"
              max="10"
              {...register("afternoonEnergy", { valueAsNumber: true })}
              error={errors.afternoonEnergy?.message}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-gray-500">Evening</label>
            <Input
              type="number"
              min="1"
              max="10"
              {...register("eveningEnergy", { valueAsNumber: true })}
              error={errors.eveningEnergy?.message}
            />
          </div>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Notes</label>
        <textarea
          {...register("notes")}
          className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 shadow-sm placeholder:text-gray-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
          placeholder="Any additional notes about your mood or energy..."
        />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" isLoading={isSubmitting}>
          {record ? "Update" : "Save"} Mood & Energy Record
        </Button>
      </div>
    </form>
  );
}
