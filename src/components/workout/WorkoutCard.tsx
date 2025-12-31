import { Edit2, Trash2, Dumbbell, Clock, Flame } from "lucide-react";
import { Button } from "../common";
import { formatDate, formatTime, formatDuration } from "../../utils";
import type { WorkoutRecord } from "../../types";

interface WorkoutCardProps {
  record: WorkoutRecord;
  onEdit: (record: WorkoutRecord) => void;
  onDelete: (id: string) => void;
}

const workoutTypeLabels: Record<string, string> = {
  cardio: "Cardio",
  strength: "Strength",
  hiit: "HIIT",
  yoga: "Yoga",
  pilates: "Pilates",
  cycling: "Cycling",
  running: "Running",
  swimming: "Swimming",
  walking: "Walking",
  other: "Other",
};

const intensityColors: Record<string, string> = {
  low: "bg-green-100 text-green-700",
  moderate: "bg-yellow-100 text-yellow-700",
  high: "bg-orange-100 text-orange-700",
  "very-high": "bg-red-100 text-red-700",
};

export function WorkoutCard({ record, onEdit, onDelete }: WorkoutCardProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-3 flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-gray-900">{formatDate(record.date)}</h3>
          <p className="mt-1 text-sm text-gray-500">{formatTime(record.time)}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
            {workoutTypeLabels[record.type]}
          </span>
          <span
            className={`rounded px-2 py-1 text-xs font-medium ${intensityColors[record.intensity]}`}
          >
            {record.intensity.replace("-", " ")}
          </span>
        </div>
      </div>

      <div className="mb-3 grid grid-cols-2 gap-3">
        <div className="flex items-center gap-2 text-sm">
          <Clock className="h-4 w-4 text-gray-400" />
          <span className="text-gray-600">{formatDuration(record.duration)}</span>
        </div>
        {record.performanceMetrics.caloriesBurned && (
          <div className="flex items-center gap-2 text-sm">
            <Flame className="h-4 w-4 text-gray-400" />
            <span className="text-gray-600">{record.performanceMetrics.caloriesBurned} cal</span>
          </div>
        )}
      </div>

      <div className="mb-3 flex items-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <Dumbbell className="h-4 w-4 text-gray-400" />
          <span className="text-gray-600">Exertion: {record.perceivedExertion}/10</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-600">Energy: {record.energyLevel}/10</span>
        </div>
      </div>

      {record.notes && <p className="mb-3 line-clamp-2 text-sm text-gray-600">{record.notes}</p>}

      <div className="flex justify-end gap-2 border-t border-gray-100 pt-3">
        <Button size="sm" variant="ghost" onClick={() => onEdit(record)}>
          <Edit2 className="mr-1 h-4 w-4" />
          Edit
        </Button>
        <Button size="sm" variant="danger" onClick={() => onDelete(record.id)}>
          <Trash2 className="mr-1 h-4 w-4" />
          Delete
        </Button>
      </div>
    </div>
  );
}
