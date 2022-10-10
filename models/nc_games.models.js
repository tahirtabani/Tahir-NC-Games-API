const db = require("../db/connection");

exports.fetchCategories = () => {
  return db.query(`SELECT * from categories;`).then((result) => result.rows);
};
