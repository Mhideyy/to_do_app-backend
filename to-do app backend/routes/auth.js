const express = require('express');
const routes = express.Router();
const { reqUser, loginUser, logoutUser, authReg } = require("../controllers/auth");
const verify = require("../middleware/verify")

routes.post('/create', reqUser);
routes.post('/auth', authReg);
routes.post('/login', loginUser);
routes.post('/logout', verify, logoutUser);

module.exports = routes;