const express = require("express");
const jwt = require("jsonwebtoken");

const Admin = require("../Models/admin");

exports.signup = async (req, res, next) => {
  try {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const password = req.body.password;

    const userExists = await Admin.findOne({ email: email });
    if (userExists) {
      res.status(409).json({ msg: "User with same email already exists" });
      return;
    }
    const userObj = {
      firstName,
      lastName,
      email,
      password,
    };
    const admin = new Admin(userObj);

    admin
      .save()
      .then(() => {
        res.status(201).json({ msg: "User created successfully" });
      })
      .catch((error) => {
        error.statusCode = 500;
        next(error);
      });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const existingUser = await Admin.findOne({ email: email });

    if (!existingUser) {
      res.status(401).json("This user doesn't exists");
      return;
    }

    const passwordMatched = password === existingUser.password;
    if (!passwordMatched) {
      res.status(401).json("Incorrect Password");
      return;
    }
    const token = jwt.sign(
      {
        email: email,
        userId: existingUser._id,
      },
      "secretkey",
      { expiresIn: "24hr" }
    );
    res.status(200).json({ token: token, userId: existingUser._id });
  } catch (error) {}
};
