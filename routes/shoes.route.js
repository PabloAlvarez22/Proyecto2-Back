'use strict'
var express = require("express");
var shoesController = require("../controllers/shoes.controller");

var connectMultiparty = require('connect-multiparty');
var api = express.Router();


var mdUpload = connectMultiparty({ uploadDir: './uploads/shoes'});

api.get("/",[],shoesController.getShoes);
api.post("/",[mdUpload], shoesController.saveShoes);
api.post("/getShoeByUser",[],shoesController.getShoeByUser);
api.post("/getShoeByBrand",[],shoesController.getShoeByBrand);
api.post("/getShoeByStyle",[],shoesController.getShoeByStyle);
api.post("/setRelationShoeToUser",[],shoesController.setRelationShoeToUser);
api.post("/getFavorites",[],shoesController.getFavorites);
api.get("/getImgShoes/:fileName",[mdUpload],shoesController.getImgShoes);
api.post("/getByMaterialSoleShoes",[],shoesController.getByMaterialSoleShoes);

module.exports = api;