import { Prisma } from "@prisma/client";
import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import slugify from "slugify";
import {
  ManufacturerCreateSchema,
  ManufacturerSchema,
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
          "application/json": { schema: z.array(ManufacturerSchema) },
        },
      },
      400: {
        description: "Get all manufacturers failed",
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
      return c.json(manufacturers, { status: 200 });
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
        content: { "application/json": { schema: ManufacturerCreateSchema } },
      },
    },
    responses: {
      201: {
        description: "New manufacturer added",
        content: { "application/json": { schema: ManufacturerSchema } },
      },
      400: {
        description: "New manufacturer failed",
        content: {
          "application/json": {
            schema: z.object({ message: z.string(), error: z.any() }),
          },
        },
      },
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

      return c.json(newManufacturer, { status: 201 });
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
      400: {
        description: "Get manufacturer by slug failed",
        content: {
          "application/json": {
            schema: z.object({ message: z.string(), error: z.any() }),
          },
        },
      },
      200: {
        description: "Get manufacturer by slug",
        content: { "application/json": { schema: ManufacturerSchema } },
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

// PATCH /manufacturers/:slug
manufacturersRoute.openapi(
  createRoute({
    tags,
    summary: "Patch a manufacturer by slug",
    method: "patch",
    path: "/:slug",
    request: {
      params: z.object({ slug: z.string() }),
      body: {
        description: "Updated manufacturer data",
        content: { "application/json": { schema: ManufacturerCreateSchema } }, // Question: How to make it optional?
        required: true,
      },
    },
    responses: {
      200: {
        description: "Manufacturer updated",
        content: { "application/json": { schema: ManufacturerSchema } },
      },
      400: {
        description: "Update manufacturer failed",
        content: {
          "application/json": {
            schema: z.object({ message: z.string(), error: z.any() }),
          },
        },
      },
    },
  }),
  async (c) => {
    const { slug } = c.req.valid("param");
    const body = c.req.valid("json");

    try {
      const manufacturerSlug = convertSlug(body.name);
      const updatedManufacturer = await prisma.manufacturer.update({
        where: { slug },
        data: {
          slug: manufacturerSlug,
          name: body.name,
        },
      });
      return c.json(updatedManufacturer, { status: 200 });
    } catch (error) {
      console.error(error);
      return c.json(
        {
          message: "Update manufacturer failed",
          error,
        },
        400
      );
    }
  }
);
