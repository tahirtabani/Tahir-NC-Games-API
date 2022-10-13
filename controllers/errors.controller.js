exports.handleInternalErrors = (err, req, res, next) => {
  console.log("ERR: ", err);
  res.status(500).send({ message: "internal server error" });
};

exports.handlePSQLErrors = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ message: "Invalid datatype found" });
  } else {
    next(err);
  }
};

exports.handleCustomErrors = (err, req, res, next) => {
  console.log("err: ", err);
  if (err.status) {
    res.status(err.status).send({ message: err.message });
  } else {
    next(err);
  }
};
