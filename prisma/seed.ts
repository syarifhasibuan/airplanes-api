import { Airplane, dataAirplanes, SeedAirplane } from "../src/data/airplanes";
import { prisma } from "../src/lib/prisma";
import slugify from "slugify";

async function seedAirplanes() {
  for (const airplane of dataAirplanes) {
    const slug = slugify(
      "".concat(airplane.manufacturer, " ", airplane.family),
      {
        lower: true,
      }
    );
    const airplaneData = {
      slug: slug,
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
        slug: slug,
      },
      create: airplaneData,
      update: airplaneData,
    });
  }
}

seedAirplanes();
