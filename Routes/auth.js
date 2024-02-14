const express = require('express');

const authController = require("../Controllers/auth");

const route = express.Router();

route.post("/signup", authController.signup);

route.post("/login", authController.login);

module.exports = route;