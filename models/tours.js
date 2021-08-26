let mongoose = require("mongoose");
let today = new Date();
let y = today.getFullYear();
let m = String(today.getMonth() + 1).padStart(2, "0");
let d = String(today.getDay()).padStart(2, "0");
let date = y + "-" + m + "-" + d;

//creating article schema (structure of students collaction)
let toursSchema = mongoose.Schema({
  title: { type: String, required: true },
  overview: { type: String, required: true },
  included: [],
  excluded: [],
  images: [],
  location: { required: true, type: String },
  price: { required: true, type: Number },
  currency: { required: true, type: String },
  date: { type: String, default: date },
});

module.exports = mongoose.model("tours", toursSchema, "tours");
//mongoose.model('model name', schema_variable, 'collection name');
