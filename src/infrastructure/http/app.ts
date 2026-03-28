import express, { Application } from "express";
import helmet from "helmet";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { readFileSync } from "fs";
import yaml from "js-yaml";
import swaggerUi from "swagger-ui-express";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
import { httpLogger } from "../../shared/logger.js";
import { errorHandler } from "../../presentation/middlewares/errorHandler.js";
import router from "../../presentation/routes/index.js";

export const createApp = (): Application => {
  const app = express();

  // first — logs all incoming requests before any middleware can short-circuit
  app.use(httpLogger);

  if (process.env.NODE_ENV !== "production") {
    try {
      const specPath = path.join(process.cwd(), "docs", "openapi.yaml");
      const rawSpec = yaml.load(readFileSync(specPath, "utf8"));
      const spec = rawSpec as object;

      app.get("/docs/openapi.json", (_req, res) => res.json(spec));
      app.use("/docs", swaggerUi.serve, swaggerUi.setup(spec));
      console.log("Swagger docs initialized at /docs");
    } catch (error) {
      console.error("Swagger failed to load:", error);
    }
  }

  app.use(helmet());
  app.use(cors());
  app.use(express.json());

  app.use("/api", router);

  app.use(errorHandler);

  return app;
};
