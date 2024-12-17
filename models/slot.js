const mongoose = require("mongoose");

const SlotSchema = new mongoose.Schema({
  professor: 
  { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  date: 
  { 
    type: String, 
    required: true 
},
  time: 
  { 
    type: String, 
    required: true 
},
  isBooked: 
  { 
    type: Boolean, 
    default: false 
},
});

module.exports = mongoose.model("Slot", SlotSchema);
