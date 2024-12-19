const express = require("express");
const auth = require("../middlewares/auth");
const Slot = require("../models/slot");
const Appointment = require("../models/appointment");
const router = express.Router();

// Add Availability Slots
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
    res.status(201).json({ message: "Slot created successfully", slot });
  } 
  catch (err)
  {
    console.log(err);
    res.status(400).json({ message: "Failed to create slot" });
  }
});

// Cancel Appointment
router.delete("/cancel/:appointmentId", auth, async (req, res) => 
  {
  // Code for cancelling appointment
  try {
    const appointment = await Appointment.findById(req.params.appointmentId);
    console.log("hello")
    if (!appointment) return res.status(404).json({ message: "Appointment not found" });

    // Update the associated slot to mark it as not booked
    // console.log(appointment)
    const slot = await Slot.findById(appointment.slot);
    
    slot.isBooked = false; // Mark the slot as not booked
    await slot.save(); // Save the updated slot

    console.log(slot);
    // Delete the appointment
    await Appointment.findByIdAndDelete(req.params.appointmentId)

    res.status(200).json({ message: "Appointment cancelled" });
  } catch (err) 
  {
    console.log(err)
    res.status(500).json({ message: "error" });
  }
});

module.exports = router;
