const {Client} = require('pg')
const { password } = require('pg/lib/defaults')

const client =new Client({
    host : "localhost",
    user : "postgres",
    port :5432,
    password :"suchit",
    database :"postgres"
})
module. exports = client;