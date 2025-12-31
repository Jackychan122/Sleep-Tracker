import { useState } from "react";
import { Plus, Filter, X } from "lucide-react";
import { Button, Input, Modal } from "../common";
import { MoodEnergyForm } from "./MoodEnergyForm";
import { MoodEnergyCard } from "./MoodEnergyCard";
import { useMoodEnergyStore } from "../../stores";
import type { MoodEnergyRecord } from "../../types";

export function MoodEnergyList() {
  const { records, filteredRecords, deleteRecord, setFilters, clearFilters } = useMoodEnergyStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<MoodEnergyRecord | undefined>();
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setLocalFilters] = useState({
    startDate: "",
    endDate: "",
    minMood: "",
    maxMood: "",
  });

  const displayRecords = showFilters ? filteredRecords : records;

  const handleAdd = () => {
    setEditingRecord(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (record: MoodEnergyRecord) => {
    setEditingRecord(record);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this mood/energy record?")) {
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
      minMood: filters.minMood ? (parseInt(filters.minMood) as any) : undefined,
      maxMood: filters.maxMood ? (parseInt(filters.maxMood) as any) : undefined,
    });
  };

  const clearLocalFilters = () => {
    setLocalFilters({
      startDate: "",
      endDate: "",
      minMood: "",
      maxMood: "",
    });
    clearFilters();
    setShowFilters(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Mood & Energy Records</h2>
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
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
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
            <Input
              type="number"
              label="Min Mood"
              placeholder="1-5"
              min="1"
              max="5"
              value={filters.minMood}
              onChange={(e) => setLocalFilters({ ...filters, minMood: e.target.value })}
            />
            <Input
              type="number"
              label="Max Mood"
              placeholder="1-5"
              min="1"
              max="5"
              value={filters.maxMood}
              onChange={(e) => setLocalFilters({ ...filters, maxMood: e.target.value })}
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
          <p className="text-gray-500">No mood & energy records found.</p>
          <Button onClick={handleAdd} className="mt-4">
            <Plus className="mr-2 h-4 w-4" />
            Add Your First Record
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {displayRecords.map((record) => (
            <MoodEnergyCard
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
        title={editingRecord ? "Edit Mood & Energy Record" : "Add Mood & Energy Record"}
        description={
          editingRecord
            ? "Update your mood and energy record details."
            : "Track your mood and energy levels throughout the day."
        }
      >
        <MoodEnergyForm
          record={editingRecord}
          onSuccess={handleModalClose}
          onCancel={handleModalClose}
        />
      </Modal>
    </div>
  );
}
