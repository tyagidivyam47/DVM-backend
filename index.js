const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const authRoutes = require("./Routes/auth");
const electionRoutes = require("./Routes/election");

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "*");
  next();
});

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  let message = status === 500 ? "Internal Server Error" : error.message;
  const data = error.data;

  res.status(status).json({ msg: message, data: data });
});

app.use(authRoutes);
app.use(electionRoutes);

mongoose
  .connect("mongodb+srv://divyamt:2104@cluster0.hq32kiz.mongodb.net/dvm")
  .then((result) => {
    app.listen(8001);
    console.log("Connection Established");
  });
