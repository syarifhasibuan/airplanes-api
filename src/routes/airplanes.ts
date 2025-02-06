import { Prisma } from "@prisma/client";
import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";

import {
  SeedAirplaneSchema,
  PrismaAirplaneSchema,
  PostAirplaneSchema,
} from "../data/airplanes";
import { prisma } from "../lib/prisma";
import slugify from "slugify";
import { makeStrictEnum } from "@prisma/client/runtime/library";

export const airplanesRoute = new OpenAPIHono();

const tags = ["Airplanes"];

// ✅ GET /airplanes
airplanesRoute.openapi(
  createRoute({
    tags,
    summary: "Get /airplanes",
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
    summary: "Get /airplanes/:slug",
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

// ✅ POST /airplanes
airplanesRoute.openapi(
  createRoute({
    tags,
    summary: "Post /airplanes",
    method: "post",
    path: "/",
    request: {
      body: {
        description: "New airplane data to add",
        content: { "application/json": { schema: PostAirplaneSchema } },
      },
    },
    responses: {
      201: {
        description: "New airplane added",
        content: { "application/json": { schema: PostAirplaneSchema } },
      },
    },
  }),
  async (c) => {
    const body = c.req.valid("json");

    const airplaneSlug = slugify(`${body.manufacturer}-${body.family}`, {
      lower: true,
    });

    const manufacturerSlug = slugify(body.manufacturer, { lower: true });

    const newAirplaneData = {
      slug: airplaneSlug,
      family: body.family,
      manufacturer: {
        connectOrCreate: {
          where: { slug: body.manufacturer },
          create: { slug: manufacturerSlug, name: body.manufacturer },
        },
      },
    };

    console.log(newAirplaneData);
    const newAirplane = await prisma.airplane.create({
      data: newAirplaneData,
    });

    return c.json(body);
  }
);

// ✅ DELETE /airplanes
airplanesRoute.openapi(
  createRoute({
    tags,
    summary: "Delete /airplanes",
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
    summary: "Delete /airplanes/:slug",
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
    summary: "Patch /airplanes/:slug",
    method: "patch",
    path: "/:slug",
    request: {
      params: z.object({ slug: z.string() }),
      body: {
        description: "New airplane data to update",
        content: {
          "application/json": { schema: PostAirplaneSchema },
        },
      },
    },
    responses: {
      404: { description: "Airplane not found" },
      200: { description: "Airplane updated" },
    },
  }),
  async (c) => {
    const { slug } = c.req.valid("param");
    const body = c.req.valid("json");

    const airplaneSlug = slugify(`${body.manufacturer}-${body.family}`, {
      lower: true,
    });
    const manufacturerSlug = slugify(body.manufacturer, { lower: true });

    const updatedAirplaneData = {
      slug: airplaneSlug,
      family: body.family,
      manufacturer: {
        connectOrCreate: {
          where: { slug: body.manufacturer },
          create: { slug: manufacturerSlug, name: body.manufacturer },
        },
      },
    };

    const updatedAirplane = await prisma.airplane.update({
      where: { slug },
      data: updatedAirplaneData,
    });

    return c.json({ message: "Airplane updated", airplane: updatedAirplane });
  }
);
