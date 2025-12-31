import { z } from "zod";

export const moodEnergyRecordSchema = z.object({
  date: z.string().min(1, "Date is required"),
  mood: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)], {
    required_error: "Mood rating is required",
  }),
  morningEnergy: z
    .number()
    .min(1, "Morning energy must be between 1 and 10")
    .max(10, "Morning energy must be between 1 and 10"),
  afternoonEnergy: z
    .number()
    .min(1, "Afternoon energy must be between 1 and 10")
    .max(10, "Afternoon energy must be between 1 and 10"),
  eveningEnergy: z
    .number()
    .min(1, "Evening energy must be between 1 and 10")
    .max(10, "Evening energy must be between 1 and 10"),
  notes: z.string().optional(),
});

export type MoodEnergyRecordFormData = z.infer<typeof moodEnergyRecordSchema>;
