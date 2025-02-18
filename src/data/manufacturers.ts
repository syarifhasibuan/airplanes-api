import { z } from "zod";
import { ManufacturerSchema as GeneratedManufacturerSchema } from "../../prisma/generated/zod";

export const ManufacturerSchema = GeneratedManufacturerSchema;

export const ManufacturerCreateSchema = z.object({
  slug: z
    .string()
    .nonempty("Slug should contain at least one character")
    .optional(),
  name: z.string(),
});
