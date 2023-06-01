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




async function  getShoeByUser(req, res){
    var driver = driverFile.setDriver();
    var session = driver.session();
    var params = req.body;
    var typeShoes = params.typeShoes;
    var brand = params.brand;
    var genre = params.genre;
    console.log(genre)
    try {
        var query = 'MATCH (shoe:shoes) WHERE shoe.brand = "'+brand+'" AND shoe.style = "'+typeShoes+'" AND shoe.genre = "'+genre+'" RETURN shoe LIMIT 1';
        var nodes = await session.run(query);
        if(nodes.records.length==0){
            res.send({message:"nodes not found"});
        }else{
            res.send({message:"nodes found", nodes:nodes.records[0]});
        }
        
    } catch (error) {
        console.error(error);
        res.status(500).json({status:500, message:"internal error"})
    }

}



async function  getShoeByBrand(req, res){
    var driver = driverFile.setDriver();
    var session = driver.session();
    var params = req.body;
    var brand = params.brand;
    var genre = params.genre;
    try {
        var query = 'MATCH (shoe:shoes) WHERE shoe.brand = "'+brand+'"  AND shoe.genre = "'+genre+'"  RETURN shoe ';
        var nodes = await session.run(query);
        if(nodes.records.length==0){
            res.send({message:"nodes not found"});
        }else{
            res.send({message:"nodes found", nodes:nodes.records});
        }
        
    } catch (error) {
        console.error(error);
        res.status(500).json({status:500, message:"internal error"})
    }

}

module.exports ={
    saveShoes,
    getShoes,
    getShoeByUser,
    getShoeByBrand
}