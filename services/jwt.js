'use strict'

var jwt = require("jwt-simple");
var moment = require("moment");
var secretKey = process.env.SECRET_KEY;

exports.createToken = (user)=>{
    var payload = {
        sub: user._id,
        email:user.email,
        name : user.name,
        age : user.age,
        typeShoes: user.typeShoes,
        brand: user.brand,
        iat: moment().unix,
        exp: moment().add(24,'hour').unix()
    }
    return jwt.encode(payload,secretKey);
}