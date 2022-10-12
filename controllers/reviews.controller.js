const { fetchReviewByID } = require("../models/reviews.models");

exports.getReviewById = (req, res, next) => {
  const { review_id } = req.params;
  fetchReviewByID(review_id)
    .then((review) => {
      console.log("review: ", review);
      res.status(200).send({ review });
    })
    .catch((err) => {
      next(err);
    });
};
