import { Prisma } from "@prisma/client";
import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import slugify from "slugify";
import {
  InputManufacturerSchema,
  PrismaManufacturerSchema,
} from "../data/manufacturers";
import { prisma } from "../lib/prisma";
import { convertSlug } from "../lib/slug";

export const manufacturersRoute = new OpenAPIHono();

const tags = ["Manufacturers"];

// GET /manufacturers
manufacturersRoute.openapi(
  createRoute({
    tags,
    summary: "Get all manufacturers",
    method: "get",
    path: "/",
    responses: {
      200: {
        description: "Get all manufacturers",
        content: {
          "application/json": { schema: PrismaManufacturerSchema },
        },
      },
      400: { description: "Get all manufacturers failed" },
    },
  }),
  async (c) => {
    try {
      const manufacturers = await prisma.manufacturer.findMany({
        include: {
          airplanes: {
            select: {
              id: true,
              slug: true,
              family: true,
            },
          },
        },
      });
      return c.json(manufacturers);
    } catch (error) {
      console.error(error);
      return c.json(
        {
          message: "Get all manufacturers failed",
          error,
        },
        400
      );
    }
  }
);

// POST /manufacturers
manufacturersRoute.openapi(
  createRoute({
    tags,
    summary: "Add new manufacturer",
    method: "post",
    path: "/",
    request: {
      body: {
        description: "New manufacturer data to add",
        content: { "application/json": { schema: InputManufacturerSchema } },
      },
    },
    responses: {
      201: {
        description: "New manufacturer added",
        content: { "application/json": { schema: PrismaManufacturerSchema } },
      },
      400: { description: "New manufacturer failed" },
    },
  }),
  async (c) => {
    const body = c.req.valid("json");

    const newManufacturerData = {
      ...body,
      slug: body.slug ?? convertSlug(body.name),
    };

    try {
      const newManufacturer = await prisma.manufacturer.create({
        data: newManufacturerData,
      });

      return c.json(newManufacturer);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        const targets = error.meta?.target as string[];
        return c.json(
          {
            message: `Error ${targets} already exist, unique constraint violation`,
            error,
          },
          400
        );
      } else {
        console.error(error);
        return c.json({ message: "New manufacturer failed", error }, 400);
      }
    }
  }
);

// GET /manufacturers/:slug
manufacturersRoute.openapi(
  createRoute({
    tags,
    summary: "Get manufacturer by slug",
    method: "get",
    path: "/:slug",
    request: { params: z.object({ slug: z.string() }) },
    responses: {
      404: { description: "Manufacturer not found" },
      400: { description: "Get manufacturer by slug failed" },
      200: {
        description: "Get manufacturer by slug",
        content: { "application/json": { schema: PrismaManufacturerSchema } },
      },
    },
  }),
  async (c) => {
    const { slug } = c.req.valid("param");
    try {
      const manufacturer = await prisma.manufacturer.findUnique({
        where: { slug },
        include: {
          airplanes: {
            select: {
              id: true,
              slug: true,
              family: true,
            },
          },
        },
      });
      if (!manufacturer) return c.notFound();
      return c.json(manufacturer);
    } catch (error) {
      console.error(error);
      return c.json(
        {
          message: "Get manufacturer by slug failed",
          error,
        },
        400
      );
    }
  }
);
