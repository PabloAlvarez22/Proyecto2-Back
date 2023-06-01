'use strict'
var express = require("express");
var userController = require("../controllers/user.controller");
var api = express.Router();


api.post("/login",[], userController.login);
api.post("/register",[], userController.saveUser);
api.post("/updateUser",[], userController.updateUser);
module.exports = api;