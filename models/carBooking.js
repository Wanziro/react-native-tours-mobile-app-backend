let mongoose = require("mongoose");
let today = new Date();
let y = today.getFullYear();
let m = String(today.getMonth() + 1).padStart(2, "0");
let d = String(today.getDay()).padStart(2, "0");
let date = y + "-" + m + "-" + d;

//creating article schema (structure of students collaction)
let carBooking = mongoose.Schema({
  carId: { type: String, required: true },
  userEmail: { type: String, required: true },
  daysBooked: { type: String, required: true },
  amountPaid: { type: String, required: true },
  currency: { type: String, required: true },
  date: { type: String, default: date },
});

module.exports = mongoose.model("carsBooking", carBooking, "carsBooking");
//mongoose.model('model name', schema_variable, 'collection name');
