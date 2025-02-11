import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import {
  InputManufacturerSchema,
  PrismaManufacturerSchema,
} from "../data/manufacturers";
import { prisma } from "../lib/prisma";
import slugify from "slugify";

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
      const manufacturers = await prisma.manufacturer.findMany();
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
      slug: slugify(body.name, { lower: true }),
      name: body.name,
    };

    try {
      const newManufacturer = await prisma.manufacturer.create({
        data: newManufacturerData,
      });

      return c.json(newManufacturer);
    } catch (error) {
      console.error(error);
      return c.json(
        {
          message: "New manufacturer failed",
          error,
        },
        400
      );
    }
  }
);
