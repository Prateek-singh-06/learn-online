const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
// const { KEY } = require("../utils/getEnv");
const saltRounds = 10;
const JWT = require("jsonwebtoken");
const bcrypt = require("bcrypt");

router.use(express.json());

const UserSchema = new mongoose.Schema({
  email: { type: String, require: true },
  password: { type: String, require: true },
  //   Varification: { type: Boolean, require: true },
  Auth: { type: String },
});

const Users = mongoose.model("users", UserSchema);

router.post("/signup", passwordHash, sign_token, async (req, resp) => {
  try {
    // req.body.Varification = 0;
    const User = new Users(req.body);
    var result = await User.save();
    result = { email: result.email };
    resp.send({ success: true, result, auth: req.body.auth });
  } catch (error) {
    console.error(error);
    resp.status(500).send({ success: false, message: "Internal Server Error" });
  }
});

function sign_token(req, resp, next) {
  try {
    const password = req.body.password;
    JWT.sign(
      { password },
      `${process.env.key}`,
      { expiresIn: "2h" },
      (err, Token) => {
        req.body.auth = Token;
        if (err) {
          console.log(err);
          resp.send(err);
        }
        next();
      }
    );
  } catch (err) {
    console.log(err);
    next(err);
  }
}

function passwordHash(req, resp, next) {
  try {
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(req.body.password, salt);
    req.body.password = hashedPassword;

    next();
  } catch (error) {
    next(error);
  }
}

router.post("/signin", async (req, resp) => {
  try {
    console.log(req.body);
    let User = await Users.findOne({ email: req.body.email }).select(
      "-_id -password"
    );
    if (User) {
      JWT.sign(
        { User },
        `${process.env.key}`,
        { expiresIn: "2h" },
        (err, token) => {
          resp.send({ success: true, User, auth: token });
        }
      );
    } else {
      // resp.send({ User });
      resp.send({ success: false, user: "no user found" });
    }
  } catch (error) {
    console.error(error);
    resp.status(500).send({ success: false, message: "Internal Server Error" });
  }
});

module.exports = router;
