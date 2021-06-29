const mysql = require('mysql')
const utils = require('./utils')

// create database connection
exports.dbConnect = (user, password, database, host, server) => {

    var conn = mysql.createConnection({
        user: user,
        password: password,
        database: database,
        host: host
    })

    conn.connect((err) => {
        if (err) {
            console.log('db error ', err.code)
        }
        server(conn)
    })
}

