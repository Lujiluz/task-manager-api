import express, { Application } from "express";
import helmet from "helmet";
import cors from "cors";
import path from "path";
import { readFileSync } from "fs";
import yaml from "js-yaml";
import swaggerUi from "swagger-ui-express";
import { httpLogger } from "../../shared/logger";
import { errorHandler } from "../../presentation/middlewares/errorHandler";
import router from "../../presentation/routes";

export const createApp = (): Application => {
  const app = express();

  // first — logs all incoming requests before any middleware can short-circuit
  app.use(httpLogger);

  const specPath = path.join(__dirname, "../../../docs/openapi.yaml");
  const rawSpec = yaml.load(readFileSync(specPath, "utf8"));
  if (!rawSpec || typeof rawSpec !== "object" || Array.isArray(rawSpec)) {
    throw new Error(`Failed to parse OpenAPI spec at ${specPath}`);
  }
  const spec = rawSpec as object;
  app.get("/docs/openapi.json", (_req, res) => res.json(spec));
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(spec));

  app.use(helmet());
  app.use(cors());
  app.use(express.json());

  app.use("/api", router);

  app.use(errorHandler);

  return app;
};
