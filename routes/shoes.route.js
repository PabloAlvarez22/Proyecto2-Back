'use strict'
var express = require("express");
var shoesController = require("../controllers/shoes.controller");

var api = express.Router();

api.get("/",[],shoesController.getShoes);
api.post("/",[], shoesController.saveShoes);
api.post("/getShoeByUser",[],shoesController.getShoeByUser);
api.post("/getShoeByBrand",[],shoesController.getShoeByBrand);
api.post("/getShoeByStyle",[],shoesController.getShoeByStyle);
api.get("/getImgShoes/:fileName",[mdUpload],shoesController.getImgShoes);

module.exports = api;