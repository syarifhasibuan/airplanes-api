import { seedDataAirplanes } from "../src/data/airplanes";
import { prisma } from "../src/lib/prisma";
import { convertSlug } from "../src/lib/slug";

async function seedAirplanes() {
  // await prisma.airplane.deleteMany();
  // await prisma.manufacturer.deleteMany();

  for (const seedDataAirplane of seedDataAirplanes) {
    const airplaneSlug = convertSlug(
      `${seedDataAirplane.manufacturerName}-${seedDataAirplane.family}`
    );

    const manufacturerSlug = convertSlug(seedDataAirplane.manufacturerName);

    const { manufacturerName, ...airplane } = seedDataAirplane;

    const airplaneInput = {
      ...airplane,
      slug: airplaneSlug,
      manufacturer: {
        connectOrCreate: {
          where: { slug: manufacturerSlug },
          create: {
            slug: manufacturerSlug,
            name: seedDataAirplane.manufacturerName,
          },
        },
      },
    };

    const newAirplane = await prisma.airplane.upsert({
      where: { slug: airplaneSlug },
      create: airplaneInput,
      update: airplaneInput,
    });

    console.info(`✈️ ${newAirplane.slug}`);
  }
}

seedAirplanes();
