const request = require("supertest");
const app = require("../app"); // Import your Express app
const Faq = require("../models/Faq");
const redisClient = require("../config/redisClient");

describe("FAQ API Tests", () => {
  let faqId; // To store an FAQ ID for update/delete tests

  beforeAll(async () => {
    await Faq.deleteMany({}); // Clean DB before running tests
    await redisClient.flushAll(); // Clear Redis cache
  });

  test("should add a new FAQ", async () => {
    const response = await request(app).post("/api/faq/add").send({
      question: "What is BharatFD?",
      answer: "BharatFD is a financial service provider.",
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("message", "FAQ added successfully");
    expect(response.body.faq).toHaveProperty("_id");

    faqId = response.body.faq._id; // Store ID for update/delete tests
  });

  test("should return FAQs in a different language", async () => {
    const response = await request(app).get("/api/faqs/?lang=fr");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    if (response.body.length > 0) {
      expect(response.body[0]).toHaveProperty("question");
      expect(response.body[0]).toHaveProperty("answer");
    }
  });

  test("should fetch translated FAQs from Redis cache", async () => {
    await request(app).get("/api/faqs?lang=fr"); // First request to store in cache
    const response = await request(app).get("/api/faqs?lang=fr"); // Should fetch from cache

    expect(response.status).toBe(200);
    const cachedData = await redisClient.get("fr");
    expect(cachedData).not.toBeNull(); // Ensure cache is stored
  });

  test("should update an existing FAQ", async () => {
    const response = await request(app)
      .put(`/api/faq/update/${faqId}`)
      .send({ question: "Updated Question?", answer: "Updated Answer." });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("question", "Updated Question?");
    expect(response.body).toHaveProperty("answer", "Updated Answer.");
  });

  test("should delete an FAQ", async () => {
    const response = await request(app).delete(`/api/faq/delete/${faqId}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message", "FAQ deleted successfully");
  });
});