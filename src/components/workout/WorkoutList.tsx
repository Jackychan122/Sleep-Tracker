import { useState } from "react";
import { Plus, Filter, X } from "lucide-react";
import { Button, Input, Modal, Select } from "../common";
import { WorkoutForm } from "./WorkoutForm";
import { WorkoutCard } from "./WorkoutCard";
import { useWorkoutStore } from "../../stores";
import type { WorkoutRecord } from "../../types";

const workoutTypeOptions = [
  { value: "", label: "All Types" },
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
  { value: "", label: "All Intensities" },
  { value: "low", label: "Low" },
  { value: "moderate", label: "Moderate" },
  { value: "high", label: "High" },
  { value: "very-high", label: "Very High" },
];

export function WorkoutList() {
  const { records, filteredRecords, deleteRecord, setFilters, clearFilters } = useWorkoutStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<WorkoutRecord | undefined>();
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setLocalFilters] = useState({
    startDate: "",
    endDate: "",
    type: "",
    intensity: "",
    minDuration: "",
    maxDuration: "",
  });

  const displayRecords = showFilters ? filteredRecords : records;

  const handleAdd = () => {
    setEditingRecord(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (record: WorkoutRecord) => {
    setEditingRecord(record);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this workout record?")) {
      deleteRecord(id);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingRecord(undefined);
  };

  const applyFilters = () => {
    setFilters({
      startDate: filters.startDate || undefined,
      endDate: filters.endDate || undefined,
      type: (filters.type as any) || undefined,
      intensity: (filters.intensity as any) || undefined,
      minDuration: filters.minDuration ? parseInt(filters.minDuration) : undefined,
      maxDuration: filters.maxDuration ? parseInt(filters.maxDuration) : undefined,
    });
  };

  const clearLocalFilters = () => {
    setLocalFilters({
      startDate: "",
      endDate: "",
      type: "",
      intensity: "",
      minDuration: "",
      maxDuration: "",
    });
    clearFilters();
    setShowFilters(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Workout Records</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
            <Filter className="mr-2 h-4 w-4" />
            {showFilters ? "Hide Filters" : "Show Filters"}
          </Button>
          <Button onClick={handleAdd}>
            <Plus className="mr-2 h-4 w-4" />
            Add Record
          </Button>
        </div>
      </div>

      {showFilters && (
        <div className="space-y-4 rounded-lg bg-gray-50 p-4">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            <Input
              type="date"
              label="Start Date"
              value={filters.startDate}
              onChange={(e) => setLocalFilters({ ...filters, startDate: e.target.value })}
            />
            <Input
              type="date"
              label="End Date"
              value={filters.endDate}
              onChange={(e) => setLocalFilters({ ...filters, endDate: e.target.value })}
            />
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Type</label>
              <Select
                options={workoutTypeOptions}
                value={filters.type}
                onValueChange={(value) => setLocalFilters({ ...filters, type: value })}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Intensity</label>
              <Select
                options={intensityOptions}
                value={filters.intensity}
                onValueChange={(value) => setLocalFilters({ ...filters, intensity: value })}
              />
            </div>
            <Input
              type="number"
              label="Min Duration (min)"
              placeholder="0"
              min="0"
              value={filters.minDuration}
              onChange={(e) => setLocalFilters({ ...filters, minDuration: e.target.value })}
            />
            <Input
              type="number"
              label="Max Duration (min)"
              placeholder="1440"
              min="0"
              max="1440"
              value={filters.maxDuration}
              onChange={(e) => setLocalFilters({ ...filters, maxDuration: e.target.value })}
            />
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={applyFilters}>
              Apply Filters
            </Button>
            <Button size="sm" variant="ghost" onClick={clearLocalFilters}>
              <X className="mr-1 h-4 w-4" />
              Clear
            </Button>
          </div>
        </div>
      )}

      {displayRecords.length === 0 ? (
        <div className="rounded-lg bg-gray-50 py-12 text-center">
          <p className="text-gray-500">No workout records found.</p>
          <Button onClick={handleAdd} className="mt-4">
            <Plus className="mr-2 h-4 w-4" />
            Add Your First Record
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {displayRecords.map((record) => (
            <WorkoutCard
              key={record.id}
              record={record}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <Modal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        title={editingRecord ? "Edit Workout Record" : "Add Workout Record"}
        description={
          editingRecord
            ? "Update your workout record details."
            : "Log your workout for better tracking and insights."
        }
      >
        <WorkoutForm
          record={editingRecord}
          onSuccess={handleModalClose}
          onCancel={handleModalClose}
        />
      </Modal>
    </div>
  );
}
