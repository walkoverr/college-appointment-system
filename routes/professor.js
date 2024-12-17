const express = require("express");
const auth = require("../middlewares/auth");
const Slot = require("../models/slot");
const Appointment = require("../models/appointment");
const router = express.Router();

// Add Availability Slots
router.post("/slots", auth, async (req, res) => {
  if (req.user.role !== "professor") return res.status(403).json({ message: "Access denied" });

  const { date, time } = req.body;
  const slot = new Slot({ professor: req.user.id, date, time });

  try {
    await slot.save();
    res.status(201).json({ message: "Slot created successfully", slot });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Failed to create slot" });
  }
});

// Cancel Appointment
router.delete("/cancel/:appointmentId", auth, async (req, res) => {
  // Code for cancelling appointment
  if (req.user.role !== "professor") return res.status(403).send("Access denied");

  const appointment = await Appointment.findByIdAndDelete(req.params.appointmentId);
  if (!appointment) return res.status(404).send("Appointment not found");

  await Slot.updateOne({ time: appointment.slot }, { isBooked: false });
  res.status(200).send("Appointment canceled");
});

module.exports = router;
