const express = require("express");
const auth = require("../middlewares/auth");
const Slot = require("../models/slot");
const Appointment = require("../models/appointment");
const router = express.Router();

router.post("/slots", auth, async(req, res) => {
  if (req.user.role !== "professor") 
    {
      return res.status(403).json({ message: "Access denied" });
    }
  const { date, time } = req.body;
  const slot = new Slot({professor: req.user.id, date, time });
  try
  {
    await slot.save();
    res.status(201).json({ 
      message: "Slot created successfully", 
      slot:slot});
  } 
  catch (err)
  {
    console.log(err);
    res.status(400).json({ message: "Failed to create slot" });
  }
});
router.delete("/cancel/:appointmentId", auth, async (req, res) => 
  {
  try {
    const appointment = await Appointment.findById(req.params.appointmentId);
    console.log("hello")
    if (!appointment) return res.status(404).json({ message: "Appointment not found" });
    const slot = await Slot.findById(appointment.slot);
    slot.isBooked = false; 
    await slot.save();
    console.log(slot);
    await Appointment.findByIdAndDelete(req.params.appointmentId)

    res.status(200).json({ message: "Appointment cancelled" });
  } catch (err) 
  {
    console.log(err)
    res.status(500).json({ message: "error" });
  }
});

module.exports = router;
