import { z } from "zod";
import {
  AirplaneSchema as GeneratedAirplaneSchema,
  ManufacturerSchema as GeneratedManufacturerSchema,
} from "../../prisma/generated/zod";
import { yearSchema } from "./common";

export const AirplaneSchema = GeneratedAirplaneSchema.extend({
  year: yearSchema,
});

export const AirplaneWithManufacturerSchema = AirplaneSchema.extend({
  manufacturer: GeneratedManufacturerSchema,
});

export const AirplaneCreateSchema = z.object({
  manufacturer: z
    .string()
    .nonempty({ message: "Airplane manufacturer name is required" }),
  family: z.string().nonempty({ message: "Airplane family name is required" }),
  year: yearSchema,
});

export type CreateInputAirplane = z.infer<typeof AirplaneCreateSchema>;

export const SeedAirplaneSchema = z.object({
  manufacturerName: z.string().nonempty(), // Airbus, Boeing, etc.
  family: z.string().nonempty(), // A320, 737, etc.
  year: yearSchema,
});

export type SeedAirplane = z.infer<typeof SeedAirplaneSchema>;

export const seedDataAirplanes: SeedAirplane[] = [
  {
    manufacturerName: "Airbus",
    family: "A320",
    year: 1988,
  },
  {
    manufacturerName: "Boeing",
    family: "B737",
    year: 1967,
  },
  {
    manufacturerName: "Boeing",
    family: "B747",
    year: 1999,
  },
  {
    manufacturerName: "Airbus",
    family: "A380",
    year: 2000,
  },
  {
    manufacturerName: "Embraer",
    family: "E190",
    year: 2000,
  },
  {
    manufacturerName: "Bombardier",
    family: "CRJ",
    year: 2000,
  },
];
