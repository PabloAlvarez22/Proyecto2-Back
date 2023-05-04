var neo4j = require('neo4j-driver')

var driver = neo4j.driver(
    process.env.URI,
    neo4j.auth.basic(
        process.env.USERNAME,
        process.env.PASSWORD
    )
);

return driver;