const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const dbConfig = require("./config/db");

let toursTable = require("./models/tours");
let usersTable = require("./models/users");
let toursBookingTable = require("./models/tours_booking");

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
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ limit: "25mb" }));

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

app.post("/api/login", (req, res) => {
  let query = { email: req.body.email, password: req.body.password };
  usersTable.find(query, (err, user) => {
    if (err) return err;
    let message;
    if (user.length !== 1) {
      message = {
        success: false,
        msg: "Invalid username or password",
        pwd: req.body.password,
      };
    } else {
      message = {
        success: true,
        msg: "Logged in successfull",
        user: [
          {
            email: user[0].email,
            name: user[0].name,
            address: user[0].address,
            phone: user[0].phone,
          },
        ],
      };
    }
    res.json(message);
  });
});

app.post("/api/tours/booking1", (req, res) => {
  let { tourId, userEmail, documentType, bookingDocument } = req.body;
  let booking = new toursBookingTable();
  // booking.tourId = tourId;
  // booking.userEmail = userEmail;
  // booking.bookingType = "Travel Documents";
  // booking.bookingDocumentType = documentType;
  // booking.bookingDocument = bookingDocument;
  // booking.payment = [];
  // booking.save((err) => {
  //   if (err) {
  //     res.json({ message: "Something went wrong. " + err });
  //   } else {
  //     res.json({ message: "success" });
  //   }
  // });
  res.json({ tourId: tourId });
});

app.post("/api/register", (req, res) => {
  let user = new usersTable();
  user.name = req.body.names;
  user.email = req.body.email;
  user.password = req.body.password;
  //??? check if passwords are equal
  user.save((err) => {
    if (err) {
      res.json({ message: "Failed" });
    } else {
      res.json({ message: "Success" });
    }
  });
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log("Server started on port " + port);
});