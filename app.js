const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const dbConfig = require("./config/db");

let toursTable = require("./models/tours");

//connecting to db
mongoose.connect(dbConfig.database, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
let db = mongoose.connection;

//check if we are connected to db
db.once("open", () => {
  console.log("connected to DB successful.");
});

//check if there an error when connecting to db
db.on("error", (err) => {
  console.log(`Error occured: ${err}`);
});

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("<h1>Rwanda Nziza REST API's</h1>");
});

//image api
app.get("/images/:name", (req, res) => {
  console.log("recived " + req.params.name);
  let image = path.join(__dirname, "assets/img/" + req.params.name);
  res.sendFile(image);
});

app.get("/api/tours", (req, res) => {
  toursTable
    .find({}, (err, allTours) => {
      if (err) return err;
      res.json(allTours);
    })
    .sort({ date: "desc" });
});

app.get("/api/home/tours", (req, res) => {
  toursTable
    .find({}, (err, allTours) => {
      if (err) return err;
      res.json(allTours);
    })
    .limit(5)
    .select("title images price currency")
    .sort({ date: "desc" });
});

app.listen(8080, () => {
  console.log("Server started on port 8080");
});
