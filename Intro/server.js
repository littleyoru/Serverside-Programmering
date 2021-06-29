const http = require('http')
const fs = require('fs') // for file system
const path = require('path') // for file and folder paths
const url = require('url')
const mysql = require('mysql')
const mssql = require('mssql')


// queries
let selectQuery = `SELECT * FROM Books`
let insertQuery = String.raw`INSERT INTO Books(BookName, Author, PublishYear) VALUES ('TestBook', 'Test Author', 2019)`
let deleteQuery = String.raw`DELETE FROM Books WHERE PublishYear = 2019`

const choseQuery = (nr) => {
    let query = ''
    switch(nr) {
        case 1:
            query = insertQuery
            break
        case 2:
            query = deleteQuery
            break
        default:
            query = selectQuery
            break
    }
    return query
}


// handle errors function
const handleError = (err, res) => {
    let err_info = {
        nr: err.errno,
        msg: err.code
    }
    switch(err.errno) {
        case 1045:
            err_info.msg = 'Connection denied. Incorrect username or password.'
            break
        case 1049:
            err_info.msg = 'Database does not exist!'
            break
        case 1146:
            err_info.msg = 'Specified table does not exist.'
            break
        case 1149:
            err_info.msg = 'There is an error in the sql query syntax.'
            break
        default:
            err_info.msg = 'Unkown error.'
            break
    }
    
    if (res) {
        res.end(JSON.stringify(err_info.msg))
        console.log(JSON.stringify(err_info.msg))
    }
}


// create server
const server = http.createServer(function(req, res) { 

    // database connection setup
    var conn = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'Bookstore'
    })

    // connect to databse
    conn.connect(function(err) {
        if (err) {
            handleError(err, res)
        }
        else {
            // switch query value depending on url
            let queryType = 0
            switch(req.url) {
                case '/add':
                    queryType = 1
                    break
                case '/remove':
                    queryType = 2
                    break
                default:
                    break
            }

            conn.query(choseQuery(queryType), function(err, data) {
                if (err) {
                    handleError(err, res)
                } else {
                    res.write(JSON.stringify(data))
                    res.end()
                }
            })

            
            
        }
    })
})






// MSSQL shit!! (wasted time)


// var mssqlConfig = {
//     user: 'sa',
//     password: 'MyStupidPassword1.',
//     server: String.raw`DESKTOP-0EB0QIQ\SQLEXPRESS`,
//     database: 'Bookstore',
//     port: 1433
// }

// const server = http.createServer(function(req, res) {
//     mssql.connect(mssqlConfig, function(err) {
//         if (err) {
//             res.statusCode = 404
//             console.log('error in connection to DB')
//             res.end()
//         }
//         else {
//             let request = new mssql.Request()
//             let queryString = 'SELECT * FROM Books'
    
//             request.query(queryString, function(err, data) {
//                 if (err) console.log('error in query')
//                 console.log('data ', data)
//                 //res.setHeader('Content-Type', 'text/html')
//                 res.write('test')
//                 //res.write(JSON.stringify(data))
//                 res.end()
//             })
//         }

//     })
// })




server.listen(8080)