const mongoose = require("mongoose");

const AppointmentSchema = new mongoose.Schema({
  professor: 
  { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  student: 
  { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  slot: 
  { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Slot", 
    required: true 
  },
  status: 
  { 
    type: String, 
    enum: ["booked", "cancelled"], 
    default: "booked" 
  }
});

module.exports = mongoose.model("Appointment", AppointmentSchema);
