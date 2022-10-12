const express = require("express");
const app = express();

const { getCategories } = require("./controllers/categories.controller");
const {
  handleInternalErrors,
  handlePSQLErrors,
  handleCustomErrors,
} = require("./controllers/errors.controller");
const { getReviewById } = require("./controllers/reviews.controller");

app.use(express.json());

app.get("/api/categories", getCategories);

app.get("/api/reviews/:review_id", getReviewById);

app.all("/api/*", (req, res) => {
  res.status(404).send({ msg: "Path not found" });
});

app.use(handleCustomErrors);

app.use(handlePSQLErrors);

app.use(handleInternalErrors);

module.exports = app;
