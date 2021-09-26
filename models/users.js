let mongoose = require("mongoose");
let today = new Date();
let y = today.getFullYear();
let m = String(today.getMonth() + 1).padStart(2, "0");
let d = String(today.getDay()).padStart(2, "0");
let date = y + "-" + m + "-" + d;

//creating article schema (structure of students collaction)
let usersSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  address: { type: String, default: "Not set" },
  phone: { type: String, default: "Not Set" },
  type: { type: String, default: "visitor" },
  date: { type: String, default: date },
});

module.exports = mongoose.model("users", usersSchema, "users");
//mongoose.model('model name', schema_variable, 'collection name');
