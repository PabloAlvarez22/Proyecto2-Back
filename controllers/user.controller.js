'use strict'
var bcrypt = require("bcrypt-nodejs");
var jwt = require("../services/jwt");

var driverFile = require("./../driver");



async function login(req,res){
    var driver = driverFile.setDriver();
    var session = driver.session();
    var params = req.body;
    
    if(params.email && params.password){
        var query = "MATCH (u:users) WHERE u.email='"+params.email+"' RETURN u";
        var nodes = await session.run(query);
        if(nodes.records){
            
            bcrypt.compare(params.password,nodes.records[0]._fields[0].properties.password,(err,passwordCheck)=>{
                if(err){                        
                    return res.status(500).send({message: "ERROR GENERAL EN EL SERVICIO", err});
                }else if(passwordCheck){
                    return res.send({token:
                        jwt.createToken(nodes.records[0]._fields[0].properties),
                        find: nodes.records[0]._fields[0].properties,
                        message: "HAS INGRESADO SESIÓN"
                    });
                }else{
                    return res.send({message: "TU CONTRASEÑA ES INCORRECTA"});
                }
            })
        }else{
            res.send({message:"No hay registros de este usuario"});
        }
    }else{
        return res.send({message: "CAMPOS FALTANTES"});
    }
}


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



async function updateUser(req, res){
    var driver = driverFile.setDriver();
    var session = driver.session();
    var params = req.body;
    if(params.email  && params.name  && params.typeShoes && params.brand){
        console.log(params.password+" password")
        if(params.password=="" || params.password== undefined){
            var query = "MATCH (user:users {email: '"+params.email+"'}) SET user.name = '"+params.name+"', user.typeShoes = '"+params.typeShoes+"'  , user.brand = '"+params.brand+"'  , user.age = '"+params.age+"' , user.genre = '"+params.genre+"' RETURN user";
            var nodes = await session.run(query);
            return res.send({message: "USUARIO ACTUALIZADO", find:nodes.records[0]._fields[0].properties});
        }else{
           
            bcrypt.hash(params.password,null,null, async (err,passwordHash)=>{
                if(err){
                    return res.status(500).send({message: "error general en hash", err});
                }else if(passwordHash){
                    var query = "MATCH (user:users {email: '"+params.email+"'}) SET user.name = '"+params.name+"', user.typeShoes = '"+params.typeShoes+"'  , user.brand = '"+params.brand+"'  , user.age = '"+params.age+"' , user.genre = '"+params.genre+"' , user.password = '"+passwordHash+"' RETURN user";
                    var nodes = await session.run(query);

                    return res.send({message:"USUARIO ACTUALIZADO", find:nodes.records[0]._fields[0].properties})
                }
            });
        }
        
        
    }else{
        return res.send({message: "CAMPOS FALTANTES"});
    }
}


module.exports ={
    saveUser,
    login,
    updateUser
}