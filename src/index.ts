import { apiReference } from "@scalar/hono-api-reference";
import { OpenAPIHono } from "@hono/zod-openapi";

import { airplanesRoute } from "./routes/airplanes";
import { manufacturersRoute } from "./routes/manufacturers";

const app = new OpenAPIHono();

const apiRoutes = app
  .basePath("/")
  .route("/airplanes", airplanesRoute)
  .route("/manufacturers", manufacturersRoute);

apiRoutes
  .doc("/openapi.json", {
    openapi: "3.1.1",
    info: {
      title: "Airplanes API",
      version: "1.0.0",
    },
  })
  .get("/", apiReference({ spec: { url: "/openapi.json" } }));

export default app;
