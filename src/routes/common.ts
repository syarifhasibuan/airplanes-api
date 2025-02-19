import { OpenAPIHono } from "@hono/zod-openapi";
import { createRoute } from "@hono/zod-openapi";

import { z } from "zod";
import { prisma } from "../lib/prisma";
import { ResponseErrorSchema } from "../data/common";
import { AirplaneWithManufacturerSchema } from "../data/airplanes";
import { ManufacturerSchema } from "../data/manufacturers";

export const commonRoute = new OpenAPIHono();

const tags = ["Common"];

// GET /search?keyword=... [{...}]
commonRoute.openapi(
  createRoute({
    tags,
    summary: "Search everything",
    method: "get",
    path: "/search",
    request: {
      query: z.object({
        q: z.string().nonempty(),
      }),
    },
    responses: {
      200: {
        description: "Search results",
        content: {
          "application/json": {
            schema: z.object({
              airplanes: z.array(AirplaneWithManufacturerSchema),
              manufacturers: z.array(ManufacturerSchema),
            }),
          },
        },
      },
      400: {
        description: "Search failed",
        content: { "application/json": { schema: ResponseErrorSchema } },
      },
    },
  }),
  async (c) => {
    const { q } = c.req.valid("query");

    // NOTE: Try https://github.com/Kinjalrk2k/prisma-extension-pg-trgm
    // A IR B = Trigram
    // ARBII = Fuzzy

    try {
      const [manufacturers, airplanes] = await Promise.all([
        prisma.manufacturer.findMany({
          where: {
            OR: [
              { name: { contains: q, mode: "insensitive" } },
              { slug: { contains: q, mode: "insensitive" } },
            ],
          },
          skip: 10,
        }),
        prisma.airplane.findMany({
          where: {
            OR: [
              { family: { contains: q, mode: "insensitive" } },
              { slug: { contains: q, mode: "insensitive" } },
              {
                manufacturer: {
                  OR: [
                    { name: { contains: q, mode: "insensitive" } },
                    { slug: { contains: q, mode: "insensitive" } },
                  ],
                },
              },
            ],
          },
          include: { manufacturer: true },
          skip: 10,
        }),
      ]);

      return c.json(
        {
          manufacturers,
          airplanes,
        },
        200
      );
    } catch (error) {
      console.error(error);
      return c.json({ message: "Search failed", error }, 400);
    }
  }
);
