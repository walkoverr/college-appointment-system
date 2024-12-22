const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../index");
const {faker} = require("@faker-js/faker")
let server;
let professorToken;
let studentToken;
let slotId;
let appointmentId;
const pfakeEmail = faker.internet.email();
const sfakeEmail = faker.internet.email();
beforeAll(() => {
  server = app.listen(3001); // Start the server before tests
});

afterAll(async () => {
  await mongoose.connection.close(); // Close database connection
  server.close(); // Stop the server after tests
});

describe("E2E Test for College Appointment System", () => {
  
  // Register a new student
  it("should register a student", async () => {
   
    const res = await request(app).post("/auth/register").send({
      name: "Test Student",
      email: sfakeEmail, // Use a valid student email
      password: "123456",
      role: "student",
    });
    studentToken = res.body.token; // Store student token for login
    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("User registered successfully");
  });

  // Register a new professor
  it("should register a professor", async () => {
    
    const res = await request(app).post("/auth/register").send({
      name: "Test Professor",
      email: pfakeEmail, // Use a valid professor email
      password: "123456",
      role: "professor",
    });
    professorToken = res.body.token; // Store professor token for login
    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("User registered successfully");
  });

  // Student login
  it("should log in a registered student", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({
        email: sfakeEmail, // Use the email from registration
        password: "123456",
      });
    studentToken = res.body.token; // Store student token
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Login successful");
    expect(res.body.token).toBeDefined();
  });

  // Professor login
  it("should log in a registered professor", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({
        email: pfakeEmail, // Use the email from registration
        password: "123456",
      });
    professorToken = res.body.token; // Store professor token
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Login successful");
    expect(res.body.token).toBeDefined();
  });

  // Professor creates a new slot
  it("should create a new slot for a professor", async () => {
    console.log("Professor Token:", professorToken); 
    const res = await request(app)
      .post("/professor/slots")
      .set("Authorization", `Bearer ${professorToken}`) // Ensure the token is valid
      .send({
        date: "2024-12-22",
        time: "10:00 AM",
      });
      console.log("Professor Token:", professorToken); 
      console.log("Request headers:", res.request.headers);
      console.log("Response status:", res.statusCode);
      console.log("Response body:", res.body); // Log the response to inspect it
  
    // Store the slot ID for later use
    slotId = res.body.slot?.id || res.body.slot?._id;
  
    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("Slot created successfully");
    expect(slotId).toBeDefined(); // Ensure slotId is valid
  });
  

  // Student views available slots
  it("should fetch available slots", async () => {
    const res = await request(app)
      .get("/student/slots")
      .set("Authorization", `Bearer ${studentToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  // Student books an appointment
  it("should allow a student to book an appointment", async () => {
    const res = await request(app)
      .post("/student/book")
      .set("Authorization", `Bearer ${studentToken}`)
      .send({
        slotId: slotId, // Use the slotId from the previous test
      });
    appointmentId = res.body.appointment._id; // Store the appointment ID
    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("Appointment booked successfully");
  });

  // Student views their appointment status
  it("should fetch student appointment status", async () => {
    const res = await request(app)
      .post("/student/status")
      .set("Authorization", `Bearer ${studentToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.appointments.length).toBeGreaterThan(0);
  });

  // Professor cancels an appointment
  it("should allow a professor to cancel an appointment", async () => {
    const res = await request(app)
      .delete(`/professor/cancel/${appointmentId}`)
      .set("Authorization", `Bearer ${professorToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Appointment cancelled");
  });

  // Student checks if the appointment is cancelled
  it("should show no pending appointments for the student after cancellation", async () => {
    const res = await request(app)
      .post("/student/status")
      .set("Authorization", `Bearer ${studentToken}`);
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("All appointments are cancelled");
  });

});
