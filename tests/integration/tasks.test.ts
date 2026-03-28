import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import { createApp } from "../../src/infrastructure/http/app";
import { prisma } from "../../src/infrastructure/database/prisma";
import { cleanDb } from "../helpers/db";

const app = createApp();

let ownerToken: string;
let ownerUserId: string;
let otherToken: string;
let taskId: string;

beforeAll(async () => {
  await cleanDb();

  // Create owner user and get token
  const ownerRes = await request(app).post("/api/users").send({
    name: "Owner",
    email: "owner@example.com",
    password: "secret123",
  });
  ownerUserId = ownerRes.body.id;

  const ownerLogin = await request(app).post("/api/users/login").send({
    email: "owner@example.com",
    password: "secret123",
  });
  ownerToken = ownerLogin.body.token;

  // Create another user for ownership tests
  await request(app).post("/api/users").send({
    name: "Other",
    email: "other@example.com",
    password: "secret123",
  });

  const otherLogin = await request(app).post("/api/users/login").send({
    email: "other@example.com",
    password: "secret123",
  });
  otherToken = otherLogin.body.token;
});

afterAll(async () => {
  await cleanDb();
  await prisma.$disconnect();
});

describe("Task endpoints", () => {
  // --- POST /api/tasks ---

  describe("POST /api/tasks", () => {
    it("creates a task with valid token and body, returns 201", async () => {
      const res = await request(app)
        .post("/api/tasks")
        .set("Authorization", `Bearer ${ownerToken}`)
        .send({ title: "My Task", description: "Do something" });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("id");
      expect(res.body).toHaveProperty("title", "My Task");
      expect(res.body).toHaveProperty("completed", false);

      taskId = res.body.id;
    });

    it("returns 401 without token", async () => {
      const res = await request(app)
        .post("/api/tasks")
        .send({ title: "No Auth Task" });

      expect(res.status).toBe(401);
    });
  });

  // --- GET /api/tasks ---

  describe("GET /api/tasks", () => {
    it("returns 200 with array including user relation", async () => {
      const res = await request(app).get("/api/tasks");

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThanOrEqual(1);
      expect(res.body[0]).toHaveProperty("user");
      expect(res.body[0].user).not.toHaveProperty("password");
    });
  });

  // --- GET /api/tasks/my-tasks ---

  describe("GET /api/tasks/my-tasks", () => {
    it("returns 200 with only the requester's tasks", async () => {
      const res = await request(app)
        .get("/api/tasks/my-tasks")
        .set("Authorization", `Bearer ${ownerToken}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.every((t: { userId: string }) => t.userId === ownerUserId)).toBe(true);
    });

    it("returns 401 without token", async () => {
      const res = await request(app).get("/api/tasks/my-tasks");

      expect(res.status).toBe(401);
    });
  });

  // --- GET /api/tasks/:id ---

  describe("GET /api/tasks/:id", () => {
    it("returns 200 with a single task", async () => {
      const res = await request(app).get(`/api/tasks/${taskId}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("id", taskId);
      expect(res.body).toHaveProperty("user");
    });

    it("returns 404 for unknown id", async () => {
      const res = await request(app).get("/api/tasks/nonexistent-id-12345");

      expect(res.status).toBe(404);
    });
  });

  // --- PUT /api/tasks/:id ---

  describe("PUT /api/tasks/:id", () => {
    it("returns 200 when updated by owner", async () => {
      const res = await request(app)
        .put(`/api/tasks/${taskId}`)
        .set("Authorization", `Bearer ${ownerToken}`)
        .send({ title: "Updated Task" });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("title", "Updated Task");
    });

    it("returns 403 when updated by non-owner", async () => {
      const res = await request(app)
        .put(`/api/tasks/${taskId}`)
        .set("Authorization", `Bearer ${otherToken}`)
        .send({ title: "Hijacked" });

      expect(res.status).toBe(403);
    });
  });

  // --- DELETE /api/tasks/:id ---

  describe("DELETE /api/tasks/:id", () => {
    it("returns 403 when deleted by non-owner", async () => {
      const res = await request(app)
        .delete(`/api/tasks/${taskId}`)
        .set("Authorization", `Bearer ${otherToken}`);

      expect(res.status).toBe(403);
    });

    it("returns 204 when deleted by owner", async () => {
      const res = await request(app)
        .delete(`/api/tasks/${taskId}`)
        .set("Authorization", `Bearer ${ownerToken}`);

      expect(res.status).toBe(204);
    });
  });

  // --- GET /api/users/:id/tasks ---

  describe("GET /api/users/:id/tasks", () => {
    it("returns 200 with array of user's tasks", async () => {
      // Create a task first so there's data
      await request(app)
        .post("/api/tasks")
        .set("Authorization", `Bearer ${ownerToken}`)
        .send({ title: "Task for sub-route test" });

      const res = await request(app).get(`/api/users/${ownerUserId}/tasks`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.every((t: { userId: string }) => t.userId === ownerUserId)).toBe(true);
    });
  });
});
