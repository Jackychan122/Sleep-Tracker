import { Edit2, Trash2, Sun, Zap } from "lucide-react";
import { Button } from "../common";
import { formatDate } from "../../utils";
import type { MoodEnergyRecord } from "../../types";

interface MoodEnergyCardProps {
  record: MoodEnergyRecord;
  onEdit: (record: MoodEnergyRecord) => void;
  onDelete: (id: string) => void;
}

const moodEmojis: Record<number, { emoji: string; label: string; color: string }> = {
  1: { emoji: "😔", label: "Very Low", color: "bg-red-100 text-red-700" },
  2: { emoji: "😕", label: "Low", color: "bg-orange-100 text-orange-700" },
  3: { emoji: "😐", label: "Neutral", color: "bg-yellow-100 text-yellow-700" },
  4: { emoji: "🙂", label: "Good", color: "bg-green-100 text-green-700" },
  5: { emoji: "😊", label: "Excellent", color: "bg-emerald-100 text-emerald-700" },
};

const getEnergyColor = (level: number) => {
  if (level >= 8) return "bg-green-100 text-green-700";
  if (level >= 5) return "bg-yellow-100 text-yellow-700";
  return "bg-red-100 text-red-700";
};

export function MoodEnergyCard({ record, onEdit, onDelete }: MoodEnergyCardProps) {
  const mood = moodEmojis[record.mood];
  const avgEnergy = Math.round(
    (record.morningEnergy + record.afternoonEnergy + record.eveningEnergy) / 3
  );

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-3 flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-gray-900">{formatDate(record.date)}</h3>
        </div>
        <div className={`rounded-full px-3 py-1 text-sm font-medium ${mood.color}`}>
          <span className="mr-1">{mood.emoji}</span>
          {mood.label}
        </div>
      </div>

      <div className="mb-3 grid grid-cols-3 gap-2">
        <div className="rounded-lg bg-gray-50 p-2 text-center">
          <div className="mb-1 flex items-center justify-center gap-1 text-xs text-gray-500">
            <Sun className="h-3 w-3" />
            Morning
          </div>
          <div
            className={`text-lg font-bold ${getEnergyColor(record.morningEnergy)} rounded px-2 py-1`}
          >
            {record.morningEnergy}
          </div>
        </div>
        <div className="rounded-lg bg-gray-50 p-2 text-center">
          <div className="mb-1 text-xs text-gray-500">Afternoon</div>
          <div
            className={`text-lg font-bold ${getEnergyColor(record.afternoonEnergy)} rounded px-2 py-1`}
          >
            {record.afternoonEnergy}
          </div>
        </div>
        <div className="rounded-lg bg-gray-50 p-2 text-center">
          <div className="mb-1 text-xs text-gray-500">Evening</div>
          <div
            className={`text-lg font-bold ${getEnergyColor(record.eveningEnergy)} rounded px-2 py-1`}
          >
            {record.eveningEnergy}
          </div>
        </div>
      </div>

      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm">
          <Zap className="h-4 w-4 text-gray-400" />
          <span className="text-gray-600">Avg Energy: {avgEnergy}/10</span>
        </div>
        <div className={`rounded px-2 py-1 text-xs font-medium ${getEnergyColor(avgEnergy)}`}>
          {avgEnergy >= 8 ? "High" : avgEnergy >= 5 ? "Moderate" : "Low"}
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
