const express = require('express');
const routes = express.Router();
const { updatePassword, deleteUser } = require("../controllers/user");
const verify = require("../middleware/verify");

routes.put("/user", verify, updatePassword);
routes.delete("/user", verify, deleteUser);

module.exports = routes;