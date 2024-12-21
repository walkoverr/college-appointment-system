const express = require("express");
const auth = require("../middlewares/auth");
const Slot = require("../models/slot");
const Appointment = require("../models/appointment");
const router = express.Router();

router.get("/slots", auth, async (req, res) => {
  const slots = await Slot.find({ isBooked: false });
  if(!slots || slots.length===0)
  {
    return res.status(200).json({message:"No Professors Are Free!"})
  }
  res.json(slots);
});

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

  res.status(201).json({ 
    message: "Appointment booked successfully", 
    appointment:appointment});
});

router.post("/status",auth,async(req,res)=>{
  try{
  const status = await Appointment.find({student:req.user.id})
  .populate('professor','name email')
  .populate('slot','date time');

  if(!status || status.length===0){
    return res.status(404).json({message:"All appointments are cancelled"})
  }
  res.status(200).json({
    appointments: status.map((appointment) => ({
      professor: appointment.professor.name,
      slot: `${appointment.slot.date} - ${appointment.slot.time}`,
      status: appointment.status, 
    })),
  });
}catch(err){
  console.log(err)
  res.status(500).json({message:"server error! Please try again later"})

}
})


module.exports = router;
