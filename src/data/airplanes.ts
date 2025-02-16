import { z } from "zod";
export { AirplaneSchema } from "../../prisma/generated/zod";

const year = new Date().getFullYear();

export const SeedAirplaneSchema = z.object({
  manufacturer: z.string().nonempty(), // Airbus, Boeing, etc.
  family: z.string().nonempty(), // A320, 737, etc.
  year: z // 1988, 1967, etc.
    .number()
    .int("Year must be an integer")
    .positive("Year must be positive")
    .min(1900, { message: "Year must be minimum of 1900" })
    .max(year, { message: "Year must be maximum of this year" })
    .optional(),
});

export const InputAirplaneSchema = z.object({
  manufacturer: z.string(), // slug
  family: z.string(),
});

export type SeedAirplane = z.infer<typeof SeedAirplaneSchema>;

export const dataAirplanes: SeedAirplane[] = [
  {
    manufacturer: "Airbus",
    family: "A320",
    // year: 1988,
  },
  {
    manufacturer: "Boeing",
    family: "B737",
    // year: 1967,
  },
  {
    manufacturer: "Boeing",
    family: "B747",
    // year: 1999,
  },
  {
    manufacturer: "Airbus",
    family: "A380",
    // year: 2000,
  },
  {
    manufacturer: "Embraer",
    family: "E190",
    // year: 2000,
  },
  {
    manufacturer: "Bombardier",
    family: "CRJ",
    // year: 2000,
  },
];
