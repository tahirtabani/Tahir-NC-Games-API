const express = require("express");
const app = express();

const { getCategories } = require("./controllers/nc_games.controller");

app.get("/api/categories", getCategories);

app.use((err, req, res, next) => {
  console.log("ERR: ", err);
  res.status(500).send({ msg: "internal server error" });
});

app.all("/api/*", (req, res) => {
  res.status(404).send({ msg: "Path not found" });
});
module.exports = app;
