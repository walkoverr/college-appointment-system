const request = require("supertest");
const mongoose = require('mongoose')
const app = require("../index");
const {faker} = require('@faker-js/faker')
let server;

beforeAll(() => {
  server = app.listen(5001); // Start the server before tests
});

afterAll(async () => {
  await mongoose.connection.close(); // Close database connection
  server.close(); // Stop the server after tests
});
describe("E2E Test for College Appointment System", () => {
  it("should register a user", async () => {
    const uniqueEmail = faker.internet.email();
    const res = await request(app).post("/api/auth/register").send({
      name: "Test Student",
      email: uniqueEmail,
      password: "123456",
      role: "student",
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("User registered successfully");
  });
});
