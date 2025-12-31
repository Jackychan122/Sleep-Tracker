import { Edit2, Trash2, Moon, Clock, Zap } from "lucide-react";
import { Button } from "../common";
import { formatDate, formatTime, formatDuration } from "../../utils";
import type { SleepRecord } from "../../types";

interface SleepCardProps {
  record: SleepRecord;
  onEdit: (record: SleepRecord) => void;
  onDelete: (id: string) => void;
}

export function SleepCard({ record, onEdit, onDelete }: SleepCardProps) {
  const getQualityColor = (score: number) => {
    if (score >= 8) return "text-green-600 bg-green-50";
    if (score >= 6) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-3 flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-gray-900">{formatDate(record.date)}</h3>
          <p className="mt-1 text-sm text-gray-500">
            {formatTime(record.bedtime)} - {formatTime(record.wakeTime)}
          </p>
        </div>
        <div
          className={`rounded-full px-3 py-1 text-sm font-medium ${getQualityColor(record.qualityScore)}`}
        >
          Score: {record.qualityScore}/10
        </div>
      </div>

      <div className="mb-3 grid grid-cols-2 gap-3">
        <div className="flex items-center gap-2 text-sm">
          <Clock className="h-4 w-4 text-gray-400" />
          <span className="text-gray-600">{formatDuration(record.duration)}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Zap className="h-4 w-4 text-gray-400" />
          <span className="text-gray-600">{record.efficiency}% efficiency</span>
        </div>
      </div>

      <div className="mb-3 flex items-center gap-2 text-sm">
        <Moon className="h-4 w-4 text-gray-400" />
        <div className="flex gap-2 text-xs">
          <span className="rounded bg-blue-50 px-2 py-1 text-blue-700">
            Deep: {record.deepSleep}m
          </span>
          <span className="rounded bg-purple-50 px-2 py-1 text-purple-700">
            REM: {record.remSleep}m
          </span>
          <span className="rounded bg-green-50 px-2 py-1 text-green-700">
            Light: {record.lightSleep}m
          </span>
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
