'use strict'

var driver = require("./../driver");


async function  getShoes(req, res){
    var session = driver.session();

    try {
        var query = 'MATCH (s:Shoes) RETURN s';
        var nodes = await session.run(query);
        res.send({message:"nodes found", nodes:nodes});
    } catch (error) {
        console.error(error);
        res.status(500).json({status:500, message:"internal error"})
    }

}