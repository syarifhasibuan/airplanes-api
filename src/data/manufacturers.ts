import { z } from "zod";

export const PrismaManufacturerSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const InputManufacturerSchema = z.object({
  slug: z.string().optional(),
  name: z.string(),
});
