let mongoose = require("mongoose");
let today = new Date();
let y = today.getFullYear();
let m = String(today.getMonth() + 1).padStart(2, "0");
let d = String(today.getDay()).padStart(2, "0");
let date = y + "-" + m + "-" + d;

//creating article schema (structure of students collaction)
let carsSchema = mongoose.Schema({
  name: { type: String, required: true },
  price: { type: String, required: true },
  currency: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  status: { type: String, default: "Not Booked" },
  daysBooked: { type: String, default: "0" },
  date: { type: String, default: date },
});

module.exports = mongoose.model("cars", carsSchema, "cars");
//mongoose.model('model name', schema_variable, 'collection name');
