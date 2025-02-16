import { z } from "zod";

const currentFullYear = new Date().getFullYear();

export const yearSchema = z
  .number()
  .int("Year must be an integer")
  .positive("Year must be positive")
  .min(1900, { message: "Year must be minimum of 1900" })
  .max(currentFullYear, { message: "Year must be maximum of this year" });
