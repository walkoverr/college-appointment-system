const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../index");
const {faker} = require("@faker-js/faker")
let server;
let professorToken;
let studentToken;
let slotId;
let appointmentId;

//generate unique fake emails for student and professor for registration
const pfakeEmail = faker.internet.email();
const sfakeEmail = faker.internet.email();

//start server before test
beforeAll(() => {
  server = app.listen(3001); 
});

//close server and disconnect database
afterAll(async () => {
  await mongoose.connection.close(); 
  server.close(); 
});

describe("E2E Test College-Appointment-System", () => {
  
  it("Student can register", async () => {
   
    const res = await request(app).post("/auth/register").send({
      name: "Test Student",
      email: sfakeEmail, 
      password: "123456",
      role: "student",
    });
    studentToken = res.body.token; 
    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("User registered successfully");
  });
  it("Professor can register", async () => {
    
    const res = await request(app).post("/auth/register").send({
      name: "Test Professor",
      email: pfakeEmail, 
      password: "123456",
      role: "professor",
    });
    professorToken = res.body.token; 
    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("User registered successfully");
  });

  it("Registered student can login", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({
        email: sfakeEmail, 
        password: "123456",
      });
    studentToken = res.body.token; 
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Login successful");
    expect(res.body.token).toBeDefined();
  });
  it("Registered professor can login", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({
        email: pfakeEmail, 
        password: "123456",
      });
    professorToken = res.body.token; 
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Login successful");
    expect(res.body.token).toBeDefined();
  });

  
  it("Professsor can  create a new slot for a students", async () => {
    console.log("Professor Token:", professorToken); 
    const res = await request(app)
      .post("/professor/slots")
      .set("Authorization", `Bearer ${professorToken}`) 
      .send({
        date: "2024-12-22",
        time: "10:00 AM",
      });
      console.log("Professor Token:", professorToken); 
      console.log("Request headers:", res.request.headers);
      console.log("Response status:", res.statusCode);
      console.log("Response body:", res.body); 
  
    
    slotId = res.body.slot.id || res.body.slot._id;
  
    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("Slot created successfully");
    expect(slotId).toBeDefined(); 
  });
  

  it("student can view available slots", async () => {
    const res = await request(app)
      .get("/student/slots")
      .set("Authorization", `Bearer ${studentToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  
  it("student can book an appointment", async () => {
    const res = await request(app)
      .post("/student/book")
      .set("Authorization", `Bearer ${studentToken}`)
      .send({
        slotId: slotId, 
      });
    appointmentId = res.body.appointment._id; 
    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("Appointment booked successfully");
  });

  
  it("student can view appointment status", async () => {
    const res = await request(app)
      .post("/student/status")
      .set("Authorization", `Bearer ${studentToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.appointments.length).toBeGreaterThan(0);
  });

  
  it("should allow a professor to cancel an appointment", async () => {
    const res = await request(app)
      .delete(`/professor/cancel/${appointmentId}`)
      .set("Authorization", `Bearer ${professorToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Appointment cancelled");
  });

  it("should show appointments status to the student incase of cancellation", async () => {
    const res = await request(app)
      .post("/student/status")
      .set("Authorization", `Bearer ${studentToken}`);
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("All appointments are cancelled");
  });

});
