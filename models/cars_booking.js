let mongoose = require("mongoose");
let today = new Date();
let y = today.getFullYear();
let m = String(today.getMonth() + 1).padStart(2, "0");
let d = String(today.getDay()).padStart(2, "0");
let date = y + "-" + m + "-" + d;

//creating article schema (structure of students collaction)
let toursBookingSchema = mongoose.Schema({
  carId: { type: String, required: true },
  name: { type: String, required: true },
  userEmail: { type: String, required: true },
  userNames: { type: String, required: true },
  days: { required: true, type: String },
  price: { required: true, type: String },
  amountPaid: { required: true, type: String },
  transactionId: { required: true, type: String },
  currency: { required: true, type: String },
  image: { required: true, type: String },
  status: { type: String, default: "Paid " },
  date: { type: String, default: date },
});

module.exports = mongoose.model(
  "carsBooking",
  toursBookingSchema,
  "carsBooking"
);
//mongoose.model('model name', schema_variable, 'collection name');
