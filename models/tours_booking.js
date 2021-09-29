let mongoose = require("mongoose");
let today = new Date();
let y = today.getFullYear();
let m = String(today.getMonth() + 1).padStart(2, "0");
let d = String(today.getDay()).padStart(2, "0");
let date = y + "-" + m + "-" + d;

//creating article schema (structure of students collaction)
let toursBookingSchema = mongoose.Schema({
  tourId: { type: String, required: true },
  title: { type: String, required: true },
  userEmail: { type: String, required: true },
  bookingType: { type: String, required: true },
  bookingDocumentType: { type: String, default: null },
  bookingDocument: { type: String, default: null },
  payment: [],
  status: { type: String, default: "Pending" },
  date: { type: String, default: date },
});

module.exports = mongoose.model(
  "tours_booking",
  toursBookingSchema,
  "tours_booking"
);
//mongoose.model('model name', schema_variable, 'collection name');
