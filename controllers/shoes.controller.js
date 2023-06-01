'use strict'

var driverFile = require("./../driver");

var fs = require("fs");
var path = require("path");

async function  getShoes(req, res){
    var driver = driverFile.setDriver();
    var session = driver.session();

    try {
        var query = 'MATCH (s:shoes) RETURN s';
        var nodes = await session.run(query);
        res.send({message:"nodes found", nodes:nodes.records});
    } catch (error) {
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



async function  getShoeByStyle(req, res){
    var driver = driverFile.setDriver();
    var session = driver.session();
    var params = req.body;
    var typeShoes = params.typeShoes;
    var genre = params.genre;
    try {
        var query = 'MATCH (shoe:shoes) WHERE shoe.style = "'+typeShoes+'"  AND shoe.genre = "'+genre+'"  RETURN shoe ';
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


async function  saveShoes(req, res){
    var driver = driverFile.setDriver();
    var session = driver.session();
    var params = req.body;
    if(req.files){
        var name=uploadImgProd(req.files.imgShoe.path);
        try {
            var query = 'CREATE (:shoes { name: "'+params.name+'", brand: "'+params.brand+'", style: "'+params.style+'", materialSole: "'+params.materialSole+'", materialShoe: "'+params.materialShoe+'", imgShoe: "'+name+'", price: "'+params.price+'"  , genre: "'+params.genre+'" })';
            await session.run(query);
            res.send({message: "node created"});
        }catch(error){
            console.error(error);
            res.status(500).json({status:500, message:"internal error"})
        }
    }else{
        return res.status(404).send({message: 'Imagen es obligatorio'});
    }
}



function uploadImgProd(filePath){    
    //captura la ruta de la imagen
    //var filePath = req.files.image.path;
    
    //separa en indices cada carpeta
    //si se trabaja en linux ('\');
    var fileSplit =  filePath.split('\\');

    //captura el nombre de la imagen
    var fileName = fileSplit[2];

    var ext = fileName.split('\.');
    var fileExt = ext[1];

    if( fileExt == 'png' ||
        fileExt == 'jpg' ||
        fileExt == 'jpeg' ||
        fileExt == 'JPG' ||
        fileExt == 'PNG' ||
        fileExt == 'gif'){
           return fileName;
    }else{
        fs.unlink(filePath, (err)=>{
            if(err){
                return null;
            }else{
                return null;
            }
        })
    }
        
}

function getImgShoes(req, res){
    var fileName = req.params.fileName;
    var pathFile = './uploads/shoes/' + fileName;
    fs.exists(pathFile, (exists)=>{
        if(exists){                    
            return res.sendFile(path.resolve(pathFile))
        }else{
           return res.status(404).send({message: 'Imagen inexistente'});
        }
    })
}



async function  setRelationShoeToUser(req, res){
    var driver = driverFile.setDriver();
    var session = driver.session();
    var params = req.body;
    var email = params.email;
    var name = params.name;
    try {
        var query = 'MATCH (user:users {email: "'+email+'"}) MATCH (shoe:shoes {name: "'+name+'"}) CREATE (user)-[:LIKE]->(shoe)';
        var nodes = await session.run(query);
        
        res.send({message:"SE MARCÓ COMO FAVORITO"});
        
    } catch (error) {
        console.error(error);
        res.status(500).json({status:500, message:"internal error"})
    }

}

async function  getByMaterialSoleShoes(req, res){
    var driver = driverFile.setDriver();
    var session = driver.session();
    var params = req.body;
    var email = params.email;
    try {
        var query = 'MATCH (n:users {email: "'+email+'"}) MATCH (n)-[r]->(m) RETURN m';
        var nodes = await session.run(query);
        if(nodes.records.length==0){
            res.send({message:"nodes not found"});
        }else{
            const recuento = {};

            nodes.records.forEach(element => {
                let string = element._fields[0].properties.materialSole;
                recuento[string] = (recuento[string] || 0) + 1;
            });

            let stringMasFrecuente;
            let frecuenciaMasAlta = 0;

            Object.entries(recuento).forEach(([string, frecuencia]) => {
                if (frecuencia > frecuenciaMasAlta) {
                stringMasFrecuente = string;
                frecuenciaMasAlta = frecuencia;
                }
            });
            
            var query1 = 'MATCH (shoe:shoes) WHERE shoe.materialSole = "'+stringMasFrecuente+'"    RETURN shoe ';
            var nodes1 = await session.run(query1);
            if(nodes1.records.length==0){
                res.send({message:"nodes not found"});
            }else{
                res.send({message:"nodes found", nodes:nodes1.records, string:stringMasFrecuente});
            }      
        }
        
    } catch (error) {
        console.error(error);
        res.status(500).json({status:500, message:"internal error"})
    }

}

async function  getFavorites(req, res){
    var driver = driverFile.setDriver();
    var session = driver.session();
    var params = req.body;
    var email = params.email;
    try {
        var query = 'MATCH (user:users {email: "'+email+'"})-[:LIKE]->(shoe:shoes) RETURN shoe';
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
    getShoeByBrand,
    getShoeByStyle,
    getImgShoes,
    setRelationShoeToUser,
    getByMaterialSoleShoes,
    getFavorites
}