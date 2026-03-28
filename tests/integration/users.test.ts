import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import { createApp } from "../../src/infrastructure/http/app";
import { prisma } from "../../src/infrastructure/database/prisma";
import { cleanDb } from "../helpers/db";

const app = createApp();

beforeAll(async () => {
  await cleanDb();
});

afterAll(async () => {
  await cleanDb();
  await prisma.$disconnect();
});

describe("User endpoints", () => {
  let userId: string;

  // --- POST /api/users (register) ---

  describe("POST /api/users", () => {
    it("creates a user and returns 201 without password", async () => {
      const res = await request(app).post("/api/users").send({
        name: "Alice",
        email: "alice@example.com",
        password: "secret123",
      });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("id");
      expect(res.body).toHaveProperty("name", "Alice");
      expect(res.body).toHaveProperty("email", "alice@example.com");
      expect(res.body).not.toHaveProperty("password");

      userId = res.body.id;
    });

    it("returns 409 for duplicate email", async () => {
      const res = await request(app).post("/api/users").send({
        name: "Alice Dup",
        email: "alice@example.com",
        password: "secret123",
      });

      expect(res.status).toBe(409);
    });

    it("returns 400 for invalid body", async () => {
      const res = await request(app).post("/api/users").send({
        name: "",
        email: "not-an-email",
      });

      expect(res.status).toBe(400);
    });
  });

  // --- POST /api/users/login ---

  describe("POST /api/users/login", () => {
    it("returns 200 with token and user for correct credentials", async () => {
      const res = await request(app).post("/api/users/login").send({
        email: "alice@example.com",
        password: "secret123",
      });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("token");
      expect(res.body).toHaveProperty("user");
      expect(res.body.user).toHaveProperty("email", "alice@example.com");
      expect(res.body.user).not.toHaveProperty("password");
    });

    it("returns 401 for wrong password", async () => {
      const res = await request(app).post("/api/users/login").send({
        email: "alice@example.com",
        password: "wrongpassword",
      });

      expect(res.status).toBe(401);
    });

    it("returns 401 for unknown email", async () => {
      const res = await request(app).post("/api/users/login").send({
        email: "nobody@example.com",
        password: "secret123",
      });

      expect(res.status).toBe(401);
    });
  });

  // --- GET /api/users ---

  describe("GET /api/users", () => {
    it("returns 200 with an array of users", async () => {
      const res = await request(app).get("/api/users");

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThanOrEqual(1);
      expect(res.body[0]).not.toHaveProperty("password");
    });
  });

  // --- GET /api/users/:id ---

  describe("GET /api/users/:id", () => {
    it("returns 200 with a single user for valid id", async () => {
      const res = await request(app).get(`/api/users/${userId}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("id", userId);
      expect(res.body).not.toHaveProperty("password");
    });

    it("returns 404 for unknown id", async () => {
      const res = await request(app).get("/api/users/nonexistent-id-12345");

      expect(res.status).toBe(404);
    });
  });

  // --- PUT /api/users/:id ---

  describe("PUT /api/users/:id", () => {
    it("returns 200 with updated user", async () => {
      const res = await request(app).put(`/api/users/${userId}`).send({
        name: "Alice Updated",
      });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("name", "Alice Updated");
      expect(res.body).not.toHaveProperty("password");
    });
  });

  // --- DELETE /api/users/:id ---

  describe("DELETE /api/users/:id", () => {
    it("returns 204", async () => {
      const res = await request(app).delete(`/api/users/${userId}`);

      expect(res.status).toBe(204);
    });
  });
});
