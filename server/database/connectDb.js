const mongoose = require("mongoose");
// 0MsnXyFlyziegusR
// mongodb+srv://prateek:<password>@cluster0.hg316ou.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
const URL =
  "mongodb+srv://prateek:0MsnXyFlyziegusR@cluster0.hg316ou.mongodb.net/course_era?retryWrites=true&w=majority";

const connectDb = () => {
  mongoose
    .connect(URL)
    .then(() => {
      console.log("mongodb connected");
    })
    .catch((err) => {
      throw err;
    });
};

module.exports = connectDb;
