import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";

import { prisma } from "../lib/prisma";
import {
  AirplaneSchema,
  CreateAirplaneSchema,
  UpsertAirplaneSchema,
} from "../data/airplanes";
import slugify from "slugify";

export const airplanesRoute = new OpenAPIHono();

const tags = ["Airplanes"];

// GET /airplanes
airplanesRoute.openapi(
  createRoute({
    tags,
    summary: "Get all airplanes",
    method: "get",
    path: "/",
    responses: {
      200: {
        description: "Get all airplanes",
        content: {
          "application/json": { schema: z.array(AirplaneSchema) },
        },
      },
    },
  }),
  async (c) => {
    const airplanes = await prisma.airplane.findMany();

    return c.json(airplanes);
  }
);

// GET /airplanes/search?name=... [{...}]
// TODO

// GET /airplanes/:id
airplanesRoute.openapi(
  createRoute({
    tags,
    method: "get",
    path: "/:slug",
    request: {
      params: z.object({ slug: z.string() }),
    },
    responses: {
      404: { description: "Airplane not found" },
      200: {
        description: "Get one airplane by slug",
        content: { "application/json": { schema: UpsertAirplaneSchema } },
      },
    },
  }),
  async (c) => {
    const { slug } = c.req.valid("param");

    // TODO: Get airplane by slug
    const airplane = await prisma.airplane.findUnique({
      where: { slug },
    });

    return c.json(airplane);
  }
);

// POST /airplanes
airplanesRoute.openapi(
  createRoute({
    tags,
    method: "post",
    path: "/",
    request: {
      body: {
        description: "New airplane data to add",
        content: {
          "application/json": { schema: CreateAirplaneSchema },
        },
      },
    },
    responses: {
      201: {
        description: "New airplane added",
        content: { "application/json": { schema: AirplaneSchema } },
      },
    },
  }),
  async (c) => {
    const body = c.req.valid("json");

    const newAirplane = await prisma.airplane.create({
      data: {
        ...body,
        slug: slugify(`${body.manufacturer}-${body.family}`, { lower: true }),
        // airbus-a220
        // boeing-737
      },
    });

    return c.json(newAirplane, 201);
  }
);

// DELETE /airplanes
airplanesRoute.openapi(
  createRoute({
    tags,
    method: "delete",
    path: "/",
    responses: {
      200: { description: "All airplanes deleted" },
    },
  }),
  (c) => {
    // airplanesVariable = [];

    return c.json({ message: "All airplanes deleted" });
  }
);

// DELETE /airplanes/:id
airplanesRoute.openapi(
  createRoute({
    tags,
    method: "delete",
    path: "/:id",
    request: {
      params: z.object({ id: z.string() }),
    },
    responses: {
      404: { description: "Airplane not found" },
      200: { description: "Airplane deleted" },
    },
  }),
  (c) => {
    const { id } = c.req.valid("param");

    // TODO: Delete airplane by ID

    return c.json({ message: "Airplane deleted" });
  }
);

// PATCH /airplanes/:id
airplanesRoute.openapi(
  createRoute({
    tags,
    method: "patch",
    path: "/:id",
    request: {
      params: z.object({ id: z.string() }),
      body: {
        description: "New airplane data to update",
        content: {
          "application/json": {
            schema: UpsertAirplaneSchema,
          },
        },
      },
    },
    responses: {
      404: { description: "Airplane not found" },
      200: { description: "Airplane updated" },
    },
  }),
  (c) => {
    const { id } = c.req.valid("param");
    const body = c.req.valid("json");

    // TODO: Update airplane by ID

    return c.json({});
  }
);
