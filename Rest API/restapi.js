
var db = require('./custom_modules/database')
var server = require('./custom_modules/server')

var serv = (conn) => server.initServer(8081, conn)

db.dbConnect('root', '', 'BookingSystem', 'localhost', serv)


