const express = require("express");
const auth = require("../middlewares/auth");
const Slot = require("../models/slot");
const Appointment = require("../models/appointment");
const router = express.Router();

// View Available Slots
router.get("/slots", auth, async (req, res) => {
  const slots = await Slot.find({ isBooked: false });
  res.json(slots);
});

// Book Appointment
router.post("/book", auth, async (req, res) => {
  const { slotId } = req.body;

  const slot = await Slot.findById(slotId);
  if (!slot || slot.isBooked) return res.status(400).json({ message: "Slot not available" });

  const appointment = new Appointment({
    professor: slot.professor,
    student: req.user.id,
    slot: slotId,
  });

  slot.isBooked = true;
  await slot.save();
  await appointment.save();

  res.status(201).json({ message: "Appointment booked successfully", appointment });
});

module.exports = router;
