'use strict'
var bcrypt = require("bcrypt-nodejs");
var jwt = require("../services/jwt");

var driverFile = require("./../driver");


async function saveUser(req, res){
    var driver = driverFile.setDriver();
    var session = driver.session();
    var params = req.body;
    if(params.email  && params.name && params.password && params.typeShoes && params.brand){
        var query = "MATCH (u:users) WHERE u.email='"+params.email+"' RETURN u";
        var nodes = await session.run(query);
        if(nodes.records.length!=0){
            return res.send({message: "ESTE USUARIO YA ESTÁ INGRESADO"});
        }else{
            bcrypt.hash(params.password,null,null, async (err,passwordHash)=>{
                if(err){
                    return res.status(500).send({message: "error general en hash", err});
                }else if(passwordHash){
                    query = "CREATE (u:users {name:'"+params.name+"', email:'"+params.email+"', age:'"+params.age+"', password:'"+passwordHash+"', typeShoes:'"+params.typeShoes+"', brand:'"+params.brand+"' }) RETURN u";
                    var nodes = await session.run(query);
                    return res.send({message:"USUARIO REGISTRADO EXITOSAMENTE", find:nodes.records[0]._fields[0]})
                }
            });
        }
        
    }else{
        return res.send({message: "CAMPOS FALTANTES"});
    }
}


module.exports ={
    saveUser
}