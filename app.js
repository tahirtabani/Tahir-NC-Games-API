const express = require("express");
const app = express();
const cors = require("cors");
const { getCategories } = require("./controllers/categories.controller");
const {
  handleInternalErrors,
  handlePSQLErrors,
  handleCustomErrors,
} = require("./controllers/errors.controller");
const {
  getReviews,
  getReviewById,
  patchReviewById,
  getCommentsById,
  postCommentById,
} = require("./controllers/reviews.controller");
const { getUsers } = require("./controllers/users.controller");
const { deleteCommentById } = require("./controllers/comments.controller");
const { getAPI } = require("./controllers/endpoints.controller");

app.use(cors());
app.use(express.json());

app.get("/api", getAPI);

app.get("/api/categories", getCategories);
app.get("/api/reviews", getReviews);
app.get("/api/reviews/:review_id", getReviewById);

app.get("/api/users", getUsers);

app.get("/api/reviews/:review_id/comments", getCommentsById);
app.patch("/api/reviews/:review_id", patchReviewById);
app.post("/api/reviews/:review_id/comments", postCommentById);

app.delete("/api/comments/:comment_id", deleteCommentById);

app.all("/api/*", (req, res) => {
  res.status(404).send({ message: "Path not found" });
});

app.use(handleCustomErrors);

app.use(handlePSQLErrors);

app.use(handleInternalErrors);

module.exports = app;
