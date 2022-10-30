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

exports.selectReviews = (category, sort_by = "created_at", order = "DESC") => {
  const validSort_byQueries = [
    "review_id",
    "title",
    "review_body",
    "designer",
    "review_img_url",
    "votes",
    "category",
    "owner",
    "created_at",
    "comment_count",
  ];
  const validOrderQueries = ["ASC", "DESC"];

  if (
    !validSort_byQueries.includes(sort_by.toLowerCase()) &&
    sort_by !== undefined
  ) {
    return Promise.reject({
      status: 400,
      message: "Sort_by value does not exist",
    });
  }
  if (!validOrderQueries.includes(order.toUpperCase()) && order !== undefined) {
    return Promise.reject({
      status: 400,
      message: "Order does not exist - use asc or desc",
    });
  }
  // if (
  //   !validSort_byQueries.includes(sort_by.toLowerCase()) ||
  //   !validOrderQueries.includes(order.toUpperCase())
  // ) {
  //   return Promise.reject({
  //     status: 400,
  //     msg: "Invalid queries. Reconsider query options.",
  //   });
  // }

  let formatStr = `SELECT reviews. *, COUNT(comments) ::INT AS comment_count FROM reviews LEFT JOIN comments ON comments.review_id = reviews.review_id`;

  let queryValue = [];
  const validCategories = [
    "euro game",
    "strategy",
    "hidden-roles",
    "dexterity",
    "push-your-luck",
    "roll-and-write",
    "deck-building",
    "engine-building",
    "children's games",
  ];

  if (category) {
    if (!validCategories.includes(category)) {
      return Promise.reject({
        status: 404,
        message: `${category} not found`,
      });
    } else {
      formatStr += ` WHERE category = $1`;
      queryValue.push(category);
    }
  }
  formatStr += ` GROUP BY reviews.review_id ORDER BY ${sort_by.toLowerCase()} ${order.toUpperCase()}`;

  return db
    .query(formatStr, queryValue)

    .then((results) => {
      return results.rows;
    });
};

exports.selectCommentsById = (id) => {
  return db
    .query(
      `SELECT * FROM comments WHERE review_id = $1 ORDER BY created_at ASC`,
      [id]
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.insertCommentById = (id, comment) => {
  const { username, body } = comment;
  if (username === undefined) {
    return Promise.reject({ status: 400, message: "Username required" });
  }
  if (body === undefined) {
    return Promise.reject({ status: 400, message: "Body required" });
  }
  return db
    .query(
      `INSERT INTO comments (body, review_id, author) values ($1, $2, $3) RETURNING *`,
      [body, id, username]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};
