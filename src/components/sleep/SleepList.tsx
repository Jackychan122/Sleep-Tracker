import { useState } from "react";
import { Plus, Filter, X } from "lucide-react";
import { Button, Input, Modal } from "../common";
import { SleepForm } from "./SleepForm";
import { SleepCard } from "./SleepCard";
import { useSleepStore } from "../../stores";
import type { SleepRecord } from "../../types";

export function SleepList() {
  const { records, filteredRecords, deleteRecord, setFilters, clearFilters } = useSleepStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<SleepRecord | undefined>();
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setLocalFilters] = useState({
    startDate: "",
    endDate: "",
    minQuality: "",
    maxQuality: "",
  });

  const displayRecords = showFilters ? filteredRecords : records;

  const handleAdd = () => {
    setEditingRecord(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (record: SleepRecord) => {
    setEditingRecord(record);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this sleep record?")) {
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
      minQualityScore: filters.minQuality ? parseInt(filters.minQuality) : undefined,
      maxQualityScore: filters.maxQuality ? parseInt(filters.maxQuality) : undefined,
    });
  };

  const clearLocalFilters = () => {
    setLocalFilters({
      startDate: "",
      endDate: "",
      minQuality: "",
      maxQuality: "",
    });
    clearFilters();
    setShowFilters(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Sleep Records</h2>
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
              label="Min Quality"
              placeholder="1-10"
              min="1"
              max="10"
              value={filters.minQuality}
              onChange={(e) => setLocalFilters({ ...filters, minQuality: e.target.value })}
            />
            <Input
              type="number"
              label="Max Quality"
              placeholder="1-10"
              min="1"
              max="10"
              value={filters.maxQuality}
              onChange={(e) => setLocalFilters({ ...filters, maxQuality: e.target.value })}
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
          <p className="text-gray-500">No sleep records found.</p>
          <Button onClick={handleAdd} className="mt-4">
            <Plus className="mr-2 h-4 w-4" />
            Add Your First Record
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {displayRecords.map((record) => (
            <SleepCard
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
        title={editingRecord ? "Edit Sleep Record" : "Add Sleep Record"}
        description={
          editingRecord
            ? "Update your sleep record details."
            : "Log your sleep for better tracking and insights."
        }
      >
        <SleepForm
          record={editingRecord}
          onSuccess={handleModalClose}
          onCancel={handleModalClose}
        />
      </Modal>
    </div>
  );
}
