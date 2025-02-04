import { z } from "zod";

const year = new Date().getFullYear();

export const AirplaneSchema = z.object({
  id: z.number(), // 1, 2, 3, etc.
  manufacturer: z.string().nonempty(), // Airbus, Boeing, etc.
  family: z.string().nonempty(), // A320, 737, etc.
  year: z // 1988, 1967, etc.
    .number()
    .int("Year must be an integer")
    .positive("Year must be positive")
    .min(1900, { message: "Year must be minimum of 1900" })
    .max(year, { message: "Year must be maximum of this year" }),
  isAvailable: z.boolean().optional(),
});

export const PrismaAirplaneSchema = z.object({
  id: z.string(),
  slug: z.string(),
  manufacturerId: z.string(),
  family: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const SeedAirplaneSchema = PrismaAirplaneSchema.omit({
  id: true,
  slug: true,
  createdAt: true,
  updatedAt: true,
});

export type Airplane = z.infer<typeof AirplaneSchema>;

export type SeedAirplane = z.infer<typeof SeedAirplaneSchema>;

export const dataAirplanes: Airplane[] = [
  {
    id: 1,
    manufacturer: "Airbus",
    family: "A320",
    year: 1988,
  },
  {
    id: 2,
    manufacturer: "Boeing",
    family: "B737",
    year: 1967,
  },
  {
    id: 3,
    manufacturer: "Boeing",
    family: "B747",
    year: 1999,
  },
  {
    id: 4,
    manufacturer: "Airbus",
    family: "A380",
    year: 2000,
  },
  {
    id: 5,
    manufacturer: "Embraer",
    family: "E190",
    year: 2000,
  },
  {
    id: 6,
    manufacturer: "Bombardier",
    family: "CRJ",
    year: 2000,
  },
];
