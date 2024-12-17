const request = require("supertest");
const app = require("../server");

describe("E2E Test for College Appointment System", () => {
  it("should register a user", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "Test Student",
      email: "student@example.com",
      password: "123456",
      role: "student",
    });
    expect(res.statusCode).toBe(201);
  });
});
