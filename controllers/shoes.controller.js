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



async function  saveShoes(req, res){
    var session = driver.session();
    var params = req.body;

    try {
        var query = 'CREATE (:Shoes { name: "'+params.name+'", brand: "'+params.brand+'", style: "'+params.style+'", style: "'+params.style+'", materialSole: "'+params.materialSole+'", materialShoe: "'+params.materialShoe+'" })';
        await session.run(query);
        res.send({message: "node created"});
    }catch(error){
        console.error(error);
        res.status(500).json({status:500, message:"internal error"})
    }
}

module.exports ={
    saveShoes,
    getShoes
}