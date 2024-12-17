const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth");
const professorRoutes = require("./routes/professor");
const studentRoutes = require("./routes/student");

dotenv.config();

const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection failed", err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/professor", professorRoutes);
app.use("/api/student", studentRoutes);

// Default route
app.get("/", (req, res) => 
    {
        res.send("College Appointment System API Running")
    });

// Server listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>{
    console.log(`Server running on port ${PORT}`)
});

