const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth");
const professorRoutes = require("./routes/professor");
const studentRoutes = require("./routes/student");
const app = express();

//port to listen
const PORT =3002;

//access .env file
dotenv.config();

//inbuilt middleware
app.use(express.json());


//database connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("Database connected"))
.catch((err) => console.error("Database connection failed", err));

//routes
app.use("/auth", authRoutes);
app.use("/professor", professorRoutes);
app.use("/student", studentRoutes);

//port listening
app.listen(PORT,() =>{
    console.log(`Server running on port ${PORT}`)
});

module.exports = app;
