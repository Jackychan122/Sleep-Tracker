// Date range picker component with presets

import { useState } from "react";
import { format, isValid, parseISO } from "date-fns";
import { Calendar, ChevronDown } from "lucide-react";
import { getDateRangePresets } from "../../utils/chart";

export interface DateRange {
  startDate: string;
  endDate: string;
}

export interface DateRangePreset {
  label: string;
  startDate: Date;
  endDate: Date;
}

export interface DateRangePickerProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
  presets?: boolean;
}

export function DateRangePicker({ value, onChange, presets = true }: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const presetsList = getDateRangePresets();

  const formatDate = (dateStr: string) => {
    try {
      const date = parseISO(dateStr);
      if (isValid(date)) {
        return format(date, "MMM d, yyyy");
      }
      return dateStr;
    } catch {
      return dateStr;
    }
  };

  const handlePresetClick = (preset: DateRangePreset) => {
    onChange({
      startDate: format(preset.startDate, "yyyy-MM-dd"),
      endDate: format(preset.endDate, "yyyy-MM-dd"),
    });
    setIsOpen(false);
  };

  const handleCustomDateChange = (field: "startDate" | "endDate", dateStr: string) => {
    onChange({
      ...value,
      [field]: dateStr,
    });
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 transition-colors hover:bg-gray-50"
      >
        <Calendar className="h-4 w-4 text-gray-500" />
        <span className="text-sm text-gray-700">
          {formatDate(value.startDate)} - {formatDate(value.endDate)}
        </span>
        <ChevronDown className="h-4 w-4 text-gray-400" />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />

          {/* Dropdown */}
          <div className="absolute right-0 top-full z-20 mt-2 w-72 rounded-lg border border-gray-200 bg-white shadow-lg">
            <div className="p-4">
              <h4 className="mb-3 text-sm font-medium text-gray-900">Select Date Range</h4>

              {/* Presets */}
              {presets && (
                <div className="mb-4">
                  <p className="mb-2 text-xs text-gray-500">Quick Select</p>
                  <div className="grid grid-cols-2 gap-2">
                    {presetsList.map((preset) => (
                      <button
                        key={preset.label}
                        onClick={() => handlePresetClick(preset)}
                        className="rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-gray-100"
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Custom range */}
              <div>
                <p className="mb-2 text-xs text-gray-500">Custom Range</p>
                <div className="space-y-2">
                  <div>
                    <label htmlFor="start-date" className="mb-1 block text-xs text-gray-600">
                      From
                    </label>
                    <input
                      id="start-date"
                      type="date"
                      value={value.startDate}
                      onChange={(e) => handleCustomDateChange("startDate", e.target.value)}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="end-date" className="mb-1 block text-xs text-gray-600">
                      To
                    </label>
                    <input
                      id="end-date"
                      type="date"
                      value={value.endDate}
                      onChange={(e) => handleCustomDateChange("endDate", e.target.value)}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
