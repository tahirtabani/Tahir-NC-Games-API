const db = require("../db/connection");

exports.fetchReviewByID = (id) => {
  return db
    .query(
      "SELECT reviews.*, COUNT (comment_id) AS comment_count FROM reviews LEFT JOIN comments ON reviews.review_id = comments.review_id WHERE reviews.review_id = $1 GROUP BY reviews.review_id",
      [id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          message: "Review ID does not exist",
        });
      }
      return rows[0];
    });
};

exports.updateReviewById = (id, inc_votes) => {
  return db
    .query(
      "UPDATE reviews SET votes = votes + $1 WHERE review_id = $2 RETURNING *",
      [inc_votes, id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          message: "Review ID does not exist",
        });
      } else {
        return rows[0];
      }
    });
};
