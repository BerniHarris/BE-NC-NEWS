const error404 =
  ("/*",
  (req, res) => {
    res.status(404).send({ message: "Path not found." });
  });

// ---- custom errors ----
const customError = (err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ message: err.msg });
  } else {
    next(err);
  }
};

// ---- PSQL errors ----
const psqlError = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({
      message: "ID not found. Please check your id number and try again",
    });
  } else if (err.code === "23502") {
    res.status(400).send({
      message: `Don't forget to include your username and comment body!`,
    });
  } else if (err.code === "23503") {
    res.status(404).send({
      message: `Input not found. Please try again`,
    });
  } else {
    next(err);
  }
};

// ---- final error! ----
const error500 = (err, req, res, next) => {
  res.status(500).send("Server Error!");
};

module.exports = { error404, customError, psqlError, error500 };
