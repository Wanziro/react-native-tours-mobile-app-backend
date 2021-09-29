const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const dbConfig = require("./config/db");

let toursTable = require("./models/tours");
let usersTable = require("./models/users");
let carsTable = require("./models/cars");
let toursBookingTable = require("./models/tours_booking");
let carsBookingTable = require("./models/cars_booking");

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

app.post("/api/allcars", (req, res) => {
  carsTable
    .find({}, (err, allTours) => {
      if (err) return err;
      res.json(allTours);
    })
    .sort({ date: "desc" });
});

app.post("/api/cars", (req, res) => {
  carsTable
    .find({ status: "Not Booked" }, (err, allTours) => {
      if (err) return err;
      res.json(allTours);
    })
    .sort({ date: "desc" });
});

app.post("/api/cars/booked", (req, res) => {
  carsTable
    .find({ status: "Booked" }, (err, allTours) => {
      if (err) return err;
      res.json(allTours);
    })
    .sort({ date: "desc" });
});

app.post("/api/cars/mystatus", (req, res) => {
  carsBookingTable
    .find({ userEmail: req.body.userEmail }, (err, allTours) => {
      if (err) return err;
      res.json(allTours);
    })
    .sort({ date: "desc" });
});

app.post("/api/car/pay", (req, res) => {
  let {
    carId,
    transactionId,
    name,
    price,
    currency,
    image,
    userEmail,
    userNames,
    days,
    amountPaid,
  } = req.body;

  let payment = new carsBookingTable();
  payment.carId = carId;
  payment.name = name;
  payment.userEmail = userEmail;
  payment.userNames = userNames;
  payment.price = price;
  payment.image = image;
  payment.currency = currency;
  payment.amountPaid = amountPaid;
  payment.transactionId = transactionId;
  payment.days = days;
  payment.save((err) => {
    if (err) {
      res.json({ message: "Something went wrong. " + err });
    } else {
      toursBookingTable.updateOne(
        { _id: carId },
        { status: "Booked" },
        (err) => {
          if (err) {
            return err;
          }
          // res.json({ message: "success" });
        }
      );
      res.json({ message: "success" });
    }
  });
});

const checkIfCAlreadyExist = (title) => {
  let query = { title: title };
  toursTable.find(query, (err, info) => {
    if (err) return err;
    if (info.length > 0) {
      return true;
    } else {
      return false;
    }
  });
};

app.post("/api/cars/new", (req, res) => {
  let { currency, description, name, price, image } = req.body;
  if (checkIfCAlreadyExist(name)) {
    res.json({
      message:
        "<p style='color:orange;font-size:20px'>The Car with the name you provided already exists.</p>",
    });
  } else {
    //The user has never booked this tour
    let car = new carsTable();
    car.name = name;
    car.currency = currency;
    car.description = description;
    car.price = price;
    car.image = image;
    car.save((err) => {
      if (err) {
        res.json({ message: "Something went wrong. " + err });
      } else {
        res.json({ message: "success" });
      }
    });
  }
});

app.post("/api/cars/delete", (req, res) => {
  carsTable.remove({ _id: req.body.id }, (err) => {
    if (err) {
      return err;
    }
    res.json({ message: "success" });
  });
});

app.post("/api/cars/notBooked", (req, res) => {
  carsTable
    .find({ status: "Not Booked" }, (err, allTours) => {
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

app.post("/api/users", (req, res) => {
  usersTable
    .find({}, (err, allTours) => {
      if (err) return err;
      res.json(allTours);
    })
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
            type: user[0].type,
          },
        ],
      };
    }
    res.json(message);
  });
});

const checkIfUserHasAlreadyBooked = (userEmail, tourId) => {
  let query = { tourId, userEmail };
  toursBookingTable.find(query, (err, info) => {
    if (err) return err;
    if (info.length > 0) {
      return true;
    } else {
      return false;
    }
  });
};
app.post("/api/tours/booking1", (req, res) => {
  let { tourId, title, userEmail, documentType, bookingDocument } = req.body;
  if (checkIfUserHasAlreadyBooked(userEmail, tourId)) {
    res.json({
      message:
        "<p style='color:orange;font-size:20px'>You have already booked at this tour.</p>",
    });
  } else {
    //The user has never booked this tour
    let booking = new toursBookingTable();
    booking.tourId = tourId;
    booking.userEmail = userEmail;
    booking.bookingType = "Travel Documents";
    booking.bookingDocumentType = documentType;
    booking.bookingDocument = bookingDocument;
    booking.title = title;
    booking.payment = [];
    booking.save((err) => {
      if (err) {
        res.json({ message: "Something went wrong. " + err });
      } else {
        res.json({ message: "success" });
      }
    });
  }
});

app.post("/api/tours/booking2", (req, res) => {
  let { userEmail, title, tourId, price, amount, currency, transactionId } =
    req.body;
  let paid = [
    {
      price,
      amount,
      currency,
      transactionId,
    },
  ];
  //The user has never booked this tour
  let booking = new toursBookingTable();
  booking.tourId = tourId;
  booking.userEmail = userEmail;
  booking.bookingType = "Payment of 50%";
  booking.title = title;
  booking.payment = paid;
  booking.status = "Approved";
  booking.save((err) => {
    if (err) {
      res.json({ message: "Something went wrong. " + err });
    } else {
      res.json({ message: "success" });
    }
  });
});

const checkIfTourAlreadyExist = (title) => {
  let query = { title: title };
  toursTable.find(query, (err, info) => {
    if (err) return err;
    if (info.length > 0) {
      return true;
    } else {
      return false;
    }
  });
};

app.post("/api/tours/new", (req, res) => {
  let { currency, overview, title, location, price, image } = req.body;
  if (checkIfTourAlreadyExist(title)) {
    res.json({
      message:
        "<p style='color:orange;font-size:20px'>The tour whit the title you provided already exists.</p>",
    });
  } else {
    //The user has never booked this tour
    let tour = new toursTable();
    tour.title = title;
    tour.currency = currency;
    tour.location = location;
    tour.price = price;
    tour.title = title;
    tour.overview = overview;
    tour.images = [image];
    tour.save((err) => {
      if (err) {
        res.json({ message: "Something went wrong. " + err });
      } else {
        res.json({ message: "success" });
      }
    });
  }
});

app.post("/api/tours/info/", (req, res) => {
  let userEmail = req.body.userEmail;
  toursBookingTable
    .find({ userEmail: userEmail }, (err, allTours) => {
      if (err) return err;
      res.json(allTours);
    })
    .sort({ date: "desc" });
});

app.post("/api/tours/delete/", (req, res) => {
  toursTable.remove({ _id: req.body.id }, (err) => {
    if (err) {
      return err;
    }
    res.json({ message: "success" });
  });
});

app.post("/api/tours/allInfo/", (req, res) => {
  toursBookingTable
    .find({}, (err, allTours) => {
      if (err) return err;
      res.json(allTours);
    })
    .sort({ date: "desc" });
});

app.post("/api/booking/delete", (req, res) => {
  toursBookingTable.remove({ _id: req.body.id }, (err) => {
    if (err) {
      return err;
    }
    res.json({ message: "success" });
  });
});

app.post("/api/booking/aprove", (req, res) => {
  toursBookingTable.updateOne(
    { _id: req.body.id },
    { status: "Approved" },
    (err) => {
      if (err) {
        return err;
      }
      res.json({ message: "success" });
    }
  );
});

app.post("/api/booking/reject", (req, res) => {
  toursBookingTable.updateOne(
    { _id: req.body.id },
    { status: "Rejected" },
    (err) => {
      if (err) {
        return err;
      }
      res.json({ message: "success" });
    }
  );
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
