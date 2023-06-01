'use strict'
var express = require("express");
var shoesController = require("../controllers/shoes.controller");

var api = express.Router();

api.get("/",[],shoesController.getShoes);
api.post("/",[], shoesController.saveShoes);

module.exports = api;