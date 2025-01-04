import { z } from "zod";

const year = new Date().getFullYear();

export const AirplaneSchema = z.object({
  id: z.number(), // 1, 2, 3, etc.
  manufacturer: z.string().nonempty(), // Airbus, Boeing, etc.
  family: z.string().nonempty(), // A320, 737, etc.
  year: z // 1967, 1988, etc.
    .number()
    .int("Year must be an integer")
    .positive("Year must be positive")
    .min(1900, { message: "Year must be minimum of 1900" })
    .max(year, { message: "Year must be maximum of this year" }),
  isAvailable: z.boolean().optional(),
});

export type Airplane = z.infer<typeof AirplaneSchema>;

export const dataAirplanes = [
  {
    id: 1,
    manufacturer: "Airbus",
    family: "A320",
    year: 1988,
  },
  {
    id: 2,
    manufacturer: "Boeing",
    family: "737",
    year: 1967,
  },
];
