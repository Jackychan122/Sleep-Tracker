import { z } from "zod";

export const workoutRecordSchema = z.object({
  date: z.string().min(1, "Date is required"),
  time: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: "Invalid time format. Use HH:MM",
  }),
  type: z.enum(
    [
      "cardio",
      "strength",
      "hiit",
      "yoga",
      "pilates",
      "cycling",
      "running",
      "swimming",
      "walking",
      "other",
    ],
    {
      required_error: "Workout type is required",
    }
  ),
  duration: z
    .number()
    .min(1, "Duration must be at least 1 minute")
    .max(1440, "Duration cannot exceed 24 hours"),
  intensity: z.enum(["low", "moderate", "high", "very-high"], {
    required_error: "Intensity level is required",
  }),
  performanceMetrics: z.object({
    caloriesBurned: z.number().min(0).optional(),
    distance: z.number().min(0).optional(),
    heartRateAvg: z.number().min(0).max(250).optional(),
    heartRateMax: z.number().min(0).max(250).optional(),
    reps: z.number().min(0).optional(),
    sets: z.number().min(0).optional(),
    weight: z.number().min(0).optional(),
  }),
  perceivedExertion: z
    .number()
    .min(1, "Perceived exertion must be between 1 and 10")
    .max(10, "Perceived exertion must be between 1 and 10"),
  energyLevel: z
    .number()
    .min(1, "Energy level must be between 1 and 10")
    .max(10, "Energy level must be between 1 and 10"),
  notes: z.string().optional(),
});

export type WorkoutRecordFormData = z.infer<typeof workoutRecordSchema>;
