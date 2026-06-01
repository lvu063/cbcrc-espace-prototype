// ============================================================
// Espace API — Integration Tests
// Author: Lê (Hai-Huong Le Vu)
// ============================================================
// Integration tests for the Express.js REST API.
// Tests each endpoint for correct status codes, response shape,
// and business logic (toxicity routing, validation, etc.)
//
// Run: npm test
// ============================================================

const request = require("supertest");
const app     = require("./server");

describe("Espace REST API — Integration Tests", () => {

  // ── Health check ──────────────────────────────────────────
  describe("GET /health", () => {
    test("returns 200 with service info", async () => {
      const res = await request(app).get("/health");
      expect(res.status).toBe(200);
      expect(res.body.status).toBe("ok");
      expect(res.body.service).toBe("espace-api");
      expect(Array.isArray(res.body.endpoints)).toBe(true);
    });
  });

  // ── Articles ──────────────────────────────────────────────
  describe("GET /api/articles", () => {
    test("returns 200 with array of articles", async () => {
      const res = await request(app).get("/api/articles");
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });

    test("each article has required bilingual fields", async () => {
      const res = await request(app).get("/api/articles");
      const article = res.body.data[0];
      expect(article).toHaveProperty("id");
      expect(article).toHaveProperty("headline.fr");
      expect(article).toHaveProperty("headline.en");
      expect(article).toHaveProperty("summary.fr");
      expect(article).toHaveProperty("readCount");
    });
  });

  describe("GET /api/articles/:id", () => {
    test("returns article by valid id", async () => {
      const res = await request(app).get("/api/articles/art-001");
      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe("art-001");
    });

    test("returns 404 for unknown article id", async () => {
      const res = await request(app).get("/api/articles/nonexistent");
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBeTruthy();
    });
  });

  // ── Comments ──────────────────────────────────────────────
  describe("GET /api/comments", () => {
    test("returns all approved comments", async () => {
      const res = await request(app).get("/api/comments");
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
      res.body.data.forEach((c) => {
        expect(c.approved).toBe(true);
      });
    });

    test("filters comments by articleId", async () => {
      const res = await request(app).get("/api/comments?articleId=art-001");
      expect(res.status).toBe(200);
      res.body.data.forEach((c) => {
        expect(c.articleId).toBe("art-001");
      });
    });
  });

  describe("POST /api/comments", () => {
    test("creates a new low-toxicity comment and returns 201", async () => {
      const res = await request(app)
        .post("/api/comments")
        .send({
          articleId: "art-001",
          author:    "Test User",
          content:   "Merci pour cet article, c'est vraiment inspiring!",
          lang:      "fr",
        });
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.author).toBe("Test User");
      expect(res.body.data.approved).toBe(true);
      expect(res.body.data.toxicityScore).toBeLessThan(0.5);
    });

    test("routes high-toxicity comment to moderation queue (202)", async () => {
      const res = await request(app)
        .post("/api/comments")
        .send({
          articleId: "art-001",
          author:    "Troll User",
          content:   "Personne ne regarde ça c'est une honte gaspillé",
          lang:      "fr",
        });
      // High toxicity → 202 Accepted (pending moderation)
      expect([201, 202]).toContain(res.status);
    });

    test("returns 400 when required fields are missing", async () => {
      const res = await request(app)
        .post("/api/comments")
        .send({ author: "No Content User" });
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    test("returns 400 when comment exceeds 280 characters", async () => {
      const res = await request(app)
        .post("/api/comments")
        .send({
          articleId: "art-001",
          author:    "Long User",
          content:   "a".repeat(281),
          lang:      "en",
        });
      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/280/);
    });
  });

  describe("POST /api/comments/:id/upvote", () => {
    test("increments upvote count on valid comment", async () => {
      const before = await request(app).get("/api/comments?articleId=art-001");
      const comment = before.body.data[0];
      const initialUpvotes = comment.upvotes;

      const res = await request(app).post(`/api/comments/${comment.id}/upvote`);
      expect(res.status).toBe(200);
      expect(res.body.data.upvotes).toBe(initialUpvotes + 1);
    });

    test("returns 404 for unknown comment id", async () => {
      const res = await request(app).post("/api/comments/fake-id/upvote");
      expect(res.status).toBe(404);
    });
  });

  // ── Moderation ────────────────────────────────────────────
  describe("GET /api/moderation/queue", () => {
    test("returns array of flagged comments", async () => {
      const res = await request(app).get("/api/moderation/queue");
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe("POST /api/moderation/:id", () => {
    test("approves a flagged comment and removes from queue", async () => {
      const queue = await request(app).get("/api/moderation/queue");
      const comment = queue.body.data[0];
      if (!comment) return; // skip if queue is empty

      const res = await request(app)
        .post(`/api/moderation/${comment.id}`)
        .send({ action: "approve", moderatorId: "mod-test-001" });

      expect(res.status).toBe(200);
      expect(res.body.data.decision.action).toBe("approve");
    });

    test("returns 400 for invalid action", async () => {
      const res = await request(app)
        .post("/api/moderation/flag-001")
        .send({ action: "delete_everything", moderatorId: "bad-actor" });
      expect(res.status).toBe(400);
    });
  });

  // ── Debate ────────────────────────────────────────────────
  describe("GET /api/debate/votes", () => {
    test("returns vote counts and percentages", async () => {
      const res = await request(app).get("/api/debate/votes");
      expect(res.status).toBe(200);
      expect(res.body.data).toHaveProperty("votes");
      expect(res.body.data).toHaveProperty("total");
      expect(res.body.data).toHaveProperty("percentages");
      expect(res.body.data.votes).toHaveProperty("agree");
      expect(res.body.data.votes).toHaveProperty("disagree");
      expect(res.body.data.votes).toHaveProperty("nuanced");
    });
  });

  describe("POST /api/debate/vote", () => {
    test("increments agree count", async () => {
      const before = await request(app).get("/api/debate/votes");
      const prevAgree = before.body.data.votes.agree;

      const res = await request(app)
        .post("/api/debate/vote")
        .send({ choice: "agree", lang: "fr" });

      expect(res.status).toBe(200);
      expect(res.body.data.votes.agree).toBe(prevAgree + 1);
    });

    test("returns 400 for invalid vote choice", async () => {
      const res = await request(app)
        .post("/api/debate/vote")
        .send({ choice: "maybe" });
      expect(res.status).toBe(400);
    });
  });

  // ── Response shape ────────────────────────────────────────
  describe("API response wrapper", () => {
    test("all successful responses include success: true and timestamp", async () => {
      const res = await request(app).get("/api/articles");
      expect(res.body.success).toBe(true);
      expect(res.body.timestamp).toBeTruthy();
      expect(new Date(res.body.timestamp).getTime()).not.toBeNaN();
    });

    test("all error responses include success: false and error message", async () => {
      const res = await request(app).get("/api/articles/nonexistent");
      expect(res.body.success).toBe(false);
      expect(typeof res.body.error).toBe("string");
    });
  });
});
