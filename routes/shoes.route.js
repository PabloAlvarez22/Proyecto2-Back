'use strict'
var express = require("express");
var shoesController = require("../controllers/shoes.controller");

var api = express.Router();

api.get("/getShoes",[],shoesController.getShoes);

module.exports = api;