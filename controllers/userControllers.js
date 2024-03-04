const { fetchUserNames } = require("../models/userModels");
const fs = require("fs");

const getUserNames = async (req, res, next) => {
  try {
    const users = await fetchUserNames();
    res.status(200).json({ users });
  } catch (err) {
    next(err);
  }
};

const getApi = async (req, res, next) => {
  try {
    const data = await fs.promises.readFile("endpoints.json", "utf8");
    const allEndpoints = JSON.parse(data);
    res.status(200).send(allEndpoints);
  } catch (err) {
    next(err);
  }
};

module.exports = { getUserNames, getApi };
