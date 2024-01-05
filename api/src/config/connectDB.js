const mongoose = require("mongoose");
const { CONNECTION, DB} = require("./db.connect");

const remoteDbUri = `${CONNECTION}/${DB}`;

mongoose.connect(remoteDbUri, {
  serverSelectionTimeoutMS: 20000,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("Connected successfully to MongoDB");
});

module.exports = db;
