const GETROOMS = String.raw`SELECT * FROM Rooms`
const GETUSERS = String.raw`SELECT * FROM Users`

const GETBOOKINGSTODAY = String.raw`SELECT b.BookDate, r.Nr, r.Alias, u.Name FROM Bookings b
INNER JOIN Rooms r ON b.RoomId = r.Id
INNER JOIN Users u ON b.UserId = u.Id
WHERE DATE(b.BookDate) = CURRENT_DATE()`

const GETBOOKINGSCUSTOM = (day) => String.raw`SELECT b.BookDate, r.Nr, r.Alias, u.Name FROM Bookings b
INNER JOIN Rooms r ON b.RoomId = r.Id
INNER JOIN Users u ON b.UserId = u.Id
WHERE DAY(b.BookDate) = ${day} AND MONTH(B.BookDate) = MONTH(CURRENT_DATE) AND YEAR(b.BookDate) = YEAR(CURRENT_DATE)`

const ADDBOOKING = String.raw`INSERT INTO Bookings (BookDate, RoomId, UserId) VALUES (CURRENT_TIMESTAMP, 2, 2)`

// method to return the query to execute for different paths
exports.handleQuery = (method, path, params) => {
    switch (path) {
        case '/rooms':
            return GETROOMS
        case '/users':
            return GETUSERS
        case '/bookings':
            if (Object.keys(params).length > 1) {
                let dayParam = params['day']
                return GETBOOKINGSCUSTOM(dayParam)
            }
            return GETBOOKINGSTODAY
        case '/add':
            if (method === 'post')
                return ADDBOOKING
            else return false
        default:
            return false
    }
}


// method to return different error messages depending on error number
exports.handleError = (err, res = null) => {
    let errInfo = {
        nr: err.errno,
        msg: err.code
    }
    switch (errInfo.nr) {
        case 400:
            errInfo,msg = 'Bad request!'
            break
        case 404:
            errInfo.msg = 'Page not found! Check url.'
            break
        case 1045:
            errInfo.msg = 'Connection denied. Incorrect username or password.'
            break
        case 1049:
            errInfo.msg = 'Database does not exist!'
            break
        case 1146:
            errInfo.msg = 'Specified table does not exist.'
            break
        case 1149:
            errInfo.msg = 'There is an error in the sql query syntax.'
            break
        default:
            errInfo.msg = 'Unkown error.'
            break
    }
    if (res !== null) {
        res.setHeader('Content-Type', 'text/plain')
        res.statusCode = err.errno
        res.statusMessage = JSON.stringify(errInfo.msg)
        res.end()
    }
}


// return results of a query
exports.queryResult = async (query, con) => {

    return new Promise((resolve, reject) => {
        con.query(query, (err, data) => {
            if (err) {
                reject(err)
            } else {
                resolve(data)
            }
        })
    }).catch(error => {
        this.handleError(error)
    })

}

exports.dataFound = (data) => {
    let dataNull = (data !== undefined && data !== null && data.length > 0)
    return dataNull
}

// check api permissions
exports.hasPermission = async (key, con) => {
    return new Promise((resolve, reject) => {
        let permQuery = String.raw`SELECT * FROM Tokens WHERE TokenName = '${key}'`
        con.query(permQuery, (err, data) => {
            if (err) {
                reject(err)
            } else {
                resolve(this.dataFound(data))
            }
        })
    }).catch(error => {
        this.handleError(error)
    })

}

