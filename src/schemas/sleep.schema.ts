import { z } from "zod";

export const sleepRecordSchema = z.object({
  date: z.string().min(1, "Date is required"),
  bedtime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: "Invalid time format. Use HH:MM",
  }),
  wakeTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: "Invalid time format. Use HH:MM",
  }),
  duration: z
    .number()
    .min(0, "Duration must be positive")
    .max(1440, "Duration cannot exceed 24 hours"),
  deepSleep: z
    .number()
    .min(0, "Deep sleep must be positive")
    .max(1440, "Deep sleep cannot exceed 24 hours"),
  remSleep: z
    .number()
    .min(0, "REM sleep must be positive")
    .max(1440, "REM sleep cannot exceed 24 hours"),
  lightSleep: z
    .number()
    .min(0, "Light sleep must be positive")
    .max(1440, "Light sleep cannot exceed 24 hours"),
  efficiency: z
    .number()
    .min(0, "Efficiency must be between 0 and 100")
    .max(100, "Efficiency must be between 0 and 100"),
  qualityScore: z
    .number()
    .min(1, "Quality score must be between 1 and 10")
    .max(10, "Quality score must be between 1 and 10"),
  notes: z.string().optional(),
});

export type SleepRecordFormData = z.infer<typeof sleepRecordSchema>;
