import { describe, it, expect, vi } from "vitest";
import request from "supertest";

// Mock config before importing createApp
vi.mock("../../src/config", () => ({
  config: {
    nodeEnv: "test",
    port: 3000,
    databaseUrl: "postgresql://test",
    jwtSecret: "test-secret",
  },
}));

import { createApp } from "../../src/infrastructure/http/app";

const app = createApp();

describe("API Documentation endpoints", () => {
  describe("GET /docs/", () => {
    it("returns 200 with HTML content", async () => {
      const res = await request(app).get("/docs/");
      expect(res.status).toBe(200);
      expect(res.headers["content-type"]).toMatch(/html/);
    });
  });

  describe("GET /docs/openapi.json", () => {
    it("returns 200 with a valid OpenAPI spec", async () => {
      const res = await request(app).get("/docs/openapi.json");
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("openapi", "3.0.3");
      expect(res.body).toHaveProperty("info");
      expect(res.body).toHaveProperty("paths");
      expect(res.body).toHaveProperty("components");
    });

    it("spec includes all expected path groups", async () => {
      const res = await request(app).get("/docs/openapi.json");
      const paths = Object.keys(res.body.paths as object);
      expect(paths).toContain("/api/users");
      expect(paths).toContain("/api/users/login");
      expect(paths).toContain("/api/users/{id}");
      expect(paths).toContain("/api/users/{id}/tasks");
      expect(paths).toContain("/api/tasks");
      expect(paths).toContain("/api/tasks/my-tasks");
      expect(paths).toContain("/api/tasks/{id}");
    });
  });
});
