import { z } from "zod";
import {
  AirplaneSchema as GeneratedAirplaneSchema,
  ManufacturerSchema as GeneratedManufacturerSchema,
} from "../../prisma/generated/zod";
import { YearSchema } from "./common";
import { Prisma } from "@prisma/client";

export const PriceSchema = z
  .instanceof(Prisma.Decimal)
  .refine((price) => price.gte("0.01"));

export const AirplaneSchema = GeneratedAirplaneSchema.extend({
  year: YearSchema,
  price: PriceSchema,
});

export const AirplaneWithManufacturerSchema = AirplaneSchema.extend({
  manufacturer: GeneratedManufacturerSchema,
});

export const AirplaneCreateSchema = z.object({
  manufacturer: z
    .string()
    .nonempty({ message: "Airplane manufacturer name is required" }),
  family: z.string().nonempty({ message: "Airplane family name is required" }),
  year: YearSchema,
  price: PriceSchema,
});

// Question: How to make it optional?
export const AirplaneUpdateSchema = AirplaneCreateSchema.extend({
  manufacturer: z
    .string()
    .nonempty({ message: "Airplane manufacturer name is required" })
    .optional(),
  family: z
    .string()
    .nonempty({ message: "Airplane family name is required" })
    .optional(),
  year: YearSchema.optional(),
});

export type CreateInputAirplane = z.infer<typeof AirplaneCreateSchema>;

export const SeedAirplaneSchema = z.object({
  manufacturerName: z.string().nonempty(), // Airbus, Boeing, etc.
  family: z.string().nonempty(), // A320, 737, etc.
  year: YearSchema,
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
