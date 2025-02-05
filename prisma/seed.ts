import { Airplane, dataAirplanes, SeedAirplane } from "../src/data/airplanes";
import { prisma } from "../src/lib/prisma";
import slugify from "slugify";

async function seedAirplanes() {
  for (const airplane of dataAirplanes) {
    const airplaneSlug = slugify(
      `${airplane.manufacturer}-${airplane.family}`,
      { lower: true }
    );

    const airplaneData = {
      slug: airplaneSlug,
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
        slug: airplaneSlug,
      },
      create: airplaneData,
      update: airplaneData,
    });

    console.info(`✈️ ${newAirplane.slug}`);
  }
}

seedAirplanes();
