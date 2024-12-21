const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const router = express.Router();

router.post("/register", async (req, res) => {
  console.log(req.body)
  const { name, email, password, role } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already registered" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, role });
    await user.save();
    res.status(201).json({ message: "User registered successfully"});
  } catch (err) {
    res.status(400).json({ message: "Registration failed", error: err.message });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) 
    {
      return res.status(400).json({ message: "Invalid credentials" });
    }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) 
    {
      return res.status(400).json({ message: "Invalid credentials" });
    }

  const token = jwt.sign({ id: user._id, role: user.role }, process.env.SECRET_KEY,{expiresIn:"1h"});
  return res.status(200).json({
    message: "Login successful",
    token: token
  });
});

module.exports = router;
