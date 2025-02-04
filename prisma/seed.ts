import { Airplane, dataAirplanes, SeedAirplane } from "../src/data/airplanes";
import { prisma } from "../src/lib/prisma";
import slugify from "slugify";

async function seedAirplanes() {
  for (const airplane of dataAirplanes) {
    const airplaneData = {
      slug: slugify("".concat(airplane.manufacturer, " ", airplane.family), {
        lower: true,
      }),
      family: airplane.family,
      manufacturer: {
        connectOrCreate: {
          where: { slug: slugify(airplane.manufacturer, { lower: true }) },
          create: {
            slug: slugify(airplane.manufacturer, { lower: true }),
            name: airplane.manufacturer,
          },
        },
      },
    };

    const newAirplane = await prisma.airplane.upsert({
      where: {
        slug: slugify("".concat(airplane.manufacturer, " ", airplane.family)),
      },
      create: airplaneData,
      update: airplaneData,
    });
  }
}

seedAirplanes();
