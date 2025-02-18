import { Prisma } from "@prisma/client";
import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";

import {
  AirplaneSchema,
  AirplaneCreateSchema,
  AirplaneWithManufacturerSchema,
} from "../data/airplanes";
import { prisma } from "../lib/prisma";
import { convertSlug } from "../lib/slug";

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
          "application/json": {
            schema: z.array(AirplaneWithManufacturerSchema),
          },
        },
      },
      400: {
        description: "Get all airplanes failed",
        content: {
          "application/json": {
            schema: z.object({
              message: z.string(),
              error: z.any(),
            }),
          },
        },
      },
    },
  }),
  async (c) => {
    try {
      const airplanes = await prisma.airplane.findMany({
        include: { manufacturer: true },
      });
      return c.json(airplanes, { status: 200 });
    } catch (error) {
      console.error(error);
      return c.json(
        {
          message: "Get all airplanes failed",
          error,
        },
        400
      );
    }
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
        content: { "application/json": { schema: AirplaneSchema } },
      },
    },
  }),
  async (c) => {
    const { slug } = c.req.valid("param");

    const airplane = await prisma.airplane.findUnique({
      where: { slug },
      include: { manufacturer: true },
    });

    if (!airplane) return c.notFound();

    return c.json(airplane, { status: 200 });
  }
);

// GET /airplanes/search?name=... [{...}]
// TODO: LATER

// ✅ POST /airplanes
airplanesRoute.openapi(
  createRoute({
    tags,
    summary: "Add new airplane",
    method: "post",
    path: "/",
    request: {
      body: {
        description: "New airplane data to add",
        content: { "application/json": { schema: AirplaneCreateSchema } },
      },
    },
    responses: {
      201: {
        description: "New airplane added",
        content: { "application/json": { schema: AirplaneSchema } },
      },
      400: {
        description: "New airplane failed",
        content: {
          "application/json": {
            schema: z.object({
              message: z.string(),
              error: z.any(),
            }),
          },
        },
      },
    },
  }),
  async (c) => {
    const body = c.req.valid("json");

    const airplaneSlug = convertSlug(`${body.manufacturer}-${body.family}`);
    const manufacturerSlug = convertSlug(body.manufacturer);

    try {
      const newAirplane = await prisma.airplane.create({
        data: {
          slug: airplaneSlug,
          family: body.family,
          year: body.year,
          manufacturer: {
            connectOrCreate: {
              where: { slug: manufacturerSlug },
              create: { slug: manufacturerSlug, name: body.manufacturer },
            },
          },
        },
        include: { manufacturer: true },
      });

      return c.json(newAirplane, { status: 201 });
    } catch (error) {
      console.error(error);
      return c.json(
        {
          message: "New airplane failed",
          slug: airplaneSlug,
          error,
        },
        400
      );
    }
  }
);

// ✅ DELETE /airplanes
airplanesRoute.openapi(
  createRoute({
    tags,
    summary: "Delete all airplanes data",
    method: "delete",
    path: "/",
    responses: {
      200: {
        description: "All airplanes data deleted",
        content: {
          "application/json": {
            schema: z.object({
              message: z.string(),
              result: z.object({ count: z.number() }).optional(),
            }),
          },
        },
      },
      400: {
        description: "All airplanes data deleted failed",
        content: {
          "application/json": {
            schema: z.object({
              message: z.string(),
              error: z.any(),
            }),
          },
        },
      },
    },
  }),
  async (c) => {
    try {
      const result = await prisma.airplane.deleteMany();
      return c.json(
        {
          message: "All airplanes data deleted",
          result: { count: result.count },
        },
        200
      );
    } catch (error) {
      console.error(error);
      return c.json(
        {
          message: "All airplanes data deleted failed",
          error,
        },
        400
      );
    }
  }
);

// ✅ DELETE /airplanes/:slug
airplanesRoute.openapi(
  createRoute({
    tags,
    summary: "Delete an airplane data by slug",
    method: "delete",
    path: "/:slug",
    request: {
      params: z.object({ slug: z.string() }),
    },
    responses: {
      200: {
        description: "Airplane deleted",
        content: {
          "application/json": {
            schema: z.object({ message: z.string(), result: z.unknown() }),
          },
        },
      },
      400: { description: "Delete airplane failed" },
    },
  }),
  async (c) => {
    const { slug } = c.req.valid("param");

    try {
      const result = await prisma.airplane.delete({ where: { slug } });

      return c.json({
        message: "Airplane deleted",
        result,
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

// ✅ PATCH /airplanes/:id
airplanesRoute.openapi(
  createRoute({
    tags,
    summary: "Patch an airplane data by slug",
    method: "patch",
    path: "/:slug",
    request: {
      params: z.object({ slug: z.string() }),
      body: {
        description: "New airplane data to update",
        content: { "application/json": { schema: AirplaneCreateSchema } }, // Question: How to make it optional?
      },
    },
    responses: {
      200: {
        description: "Airplane updated",
        content: { "application/json": { schema: AirplaneSchema } },
      },
      400: {
        description: "Update airplane failed",
        content: {
          "application/json": {
            schema: z.object({
              message: z.string(),
              slug: z.string(),
              error: z.any(),
            }),
          },
        },
      },
    },
  }),
  async (c) => {
    const { slug } = c.req.valid("param");
    const body = c.req.valid("json");

    const airplaneSlug = convertSlug(`${body.manufacturer}-${body.family}`);
    const manufacturerSlug = convertSlug(body.manufacturer);

    try {
      const updatedAirplane = await prisma.airplane.update({
        where: { slug },
        data: {
          slug: airplaneSlug,
          family: body.family,
          year: body.year,
          manufacturer: {
            connectOrCreate: {
              where: { slug: manufacturerSlug },
              create: { slug: manufacturerSlug, name: body.manufacturer },
            },
          },
        },
        include: { manufacturer: true },
      });

      return c.json(updatedAirplane, { status: 200 });
    } catch (error) {
      console.error(error);
      return c.json({ message: "Update airplane failed", slug, error }, 400);
    }
  }
);
