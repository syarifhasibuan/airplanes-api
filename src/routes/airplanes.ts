import { Prisma } from "@prisma/client";
import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";

import { SeedAirplaneSchema, PrismaAirplaneSchema } from "../data/airplanes";
import { prisma } from "../lib/prisma";

export const airplanesRoute = new OpenAPIHono();

const tags = ["Airplanes"];

// ✅ GET /airplanes
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
          "application/json": { schema: z.array(PrismaAirplaneSchema) },
        },
      },
    },
  }),
  async (c) => {
    const airplanes = await prisma.airplane.findMany();
    return c.json(airplanes);
  }
);

// ✅ GET /airplanes/:slug
airplanesRoute.openapi(
  createRoute({
    tags,
    summary: "Get airplane by slug",
    method: "get",
    path: "/:slug",
    request: {
      params: z.object({ slug: z.string() }),
    },
    responses: {
      404: { description: "Airplane not found" },
      200: {
        description: "Get one airplane by slug",
        content: { "application/json": { schema: PrismaAirplaneSchema } },
      },
    },
  }),
  async (c) => {
    const { slug } = c.req.valid("param");

    const airplane = await prisma.airplane.findUnique({
      where: { slug },
    });

    if (!airplane) return c.notFound();

    return c.json(airplane);
  }
);

// GET /airplanes/search?name=... [{...}]
// LATER

// ❌ POST /airplanes
airplanesRoute.openapi(
  createRoute({
    tags,
    method: "post",
    path: "/",
    request: {
      body: {
        description: "New airplane data to add",
        content: {
          "application/json": { schema: SeedAirplaneSchema.omit({ id: true }) },
        },
      },
    },
    responses: {
      201: {
        description: "New airplane added",
        content: { "application/json": { schema: SeedAirplaneSchema } },
      },
    },
  }),
  // @ts-ignore
  (c) => {
    const body = c.req.valid("json");

    // const newAirplaneData = {
    //   ...body,
    //   id: generateId(airplanes),
    // };

    // airplanes = [...airplanes, newAirplaneData];

    return c.json(null, 201);
  }
);

// ✅ DELETE /airplanes
airplanesRoute.openapi(
  createRoute({
    tags,
    summary: "Delete all airplanes",
    method: "delete",
    path: "/",
    responses: {
      200: { description: "All airplanes data deleted" },
    },
  }),
  async (c) => {
    await prisma.airplane.deleteMany();
    return c.json({ message: "All airplanes data deleted" });
  }
);

// ✅ DELETE /airplanes/:slug
airplanesRoute.openapi(
  createRoute({
    tags,
    summary: "Delete airplane by slug",
    method: "delete",
    path: "/:slug",
    request: {
      params: z.object({ slug: z.string() }),
    },
    responses: {
      400: { description: "Delete airplane failed" },
      200: { description: "Airplane deleted" },
    },
  }),
  async (c) => {
    const { slug } = c.req.valid("param");

    try {
      const deletedAirplane = await prisma.airplane.delete({
        where: { slug },
      });

      return c.json({
        message: "Airplane deleted",
        airplane: deletedAirplane,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        return c.json(
          {
            message: "Delete airplane failed because slug doesn't exist",
            slug,
            error,
          },
          400
        );
      }
      return c.json({ message: "Delete airplane failed", slug, error }, 400);
    }
  }
);

// ❌ PATCH /airplanes/:id
// TODO: PATCH /airplanes/:slug
airplanesRoute.openapi(
  createRoute({
    tags,
    method: "patch",
    path: "/:id",
    request: {
      params: z.object({ id: z.coerce.number().int().positive() }),
      body: {
        description: "New airplane data to update",
        content: {
          "application/json": {
            schema: SeedAirplaneSchema.omit({ id: true }).partial(),
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

    // const updatedAirplanes = airplanes.map((airplane) => {
    //   if (airplane.id === id) return { ...airplane, ...body };
    //   return airplane;
    // });

    // airplanes = updatedAirplanes;

    // const updatedAirplane = airplanes.find((airplane) => airplane.id === id);
    // if (!updatedAirplane) return c.notFound();

    return c.json(null);
  }
);
