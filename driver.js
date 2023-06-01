var neo4j = require('neo4j-driver');

function setDriver(){
    var driver = neo4j.driver(
        process.env.URI,
        neo4j.auth.basic(
            process.env.USERNAMEDB,
            process.env.PASSWORD
        )
    );
    
    return driver
}

module.exports={
    setDriver
}