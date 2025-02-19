import { z } from "zod";

const currentFullYear = new Date().getFullYear();

export const YearSchema = z
  .number()
  .int("Year must be an integer")
  .positive("Year must be positive")
  .min(1900, { message: "Year must be minimum of 1900" })
  .max(currentFullYear, { message: "Year must be maximum of this year" });

export const ResponseErrorSchema = z.object({
  message: z.string(),
  error: z.any(),
  slug: z.string().optional(),
});
