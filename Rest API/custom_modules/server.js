const utils = require('./utils')

exports.initServer = (port, con) => {

    var http = require('http')
    var url = require('url')

    let sendNotAllowedResponse = function(res) {
        res.setHeader('Content-Type', 'text/plain')
        res.statusCode = 403
        res.statusMessage = "You don't have permission to access the API!"
        res.end(res.statusMessage)
    }

    http.createServer(async (req, res) => {

        var parsedUrl = url.parse(req.url, true)
        let pathName = parsedUrl.pathname
        let params = parsedUrl.query

        // check key for permission to use api
        if (Object.keys(params).length > 0 && params['key']) {
            let hasPerm = await utils.hasPermission(params['key'], con)
            // key not found in database
            if (!hasPerm) {
                sendNotAllowedResponse(res)
                return
            }
        // no key in url
        } else {
            sendNotAllowedResponse(res)
            return
        }

        // check if post request
        if (req.method === 'POST') {
            let found = utils.handleQuery('post', pathName)
            if (!found) {
                res.statusCode = 404
                res.statusMessage = 'Page not found'
                res.write('Page not found')
                res.end()
            } else {
                res.setHeader('Content-Type', 'text/plain')
                await utils.queryResult(found, con)
                res.end('Post request successful')
            }

        } else {
            let found = utils.handleQuery('get', pathName, params)
            // cookies
            // res.setHeader('Set-Cookie', 'foo=bar')

            if (!found) {
                res.statusCode = 404
                res.statusMessage = 'Page not found'
                res.end('Page not found')

            } else {
                console.log('finished', res.finished);
                if (res.finished) {
                    return
                }
                res.setHeader('Content-Type', 'text/json')
                res.end(JSON.stringify(await utils.queryResult(found, con)))
            }
        }

    }).listen(port)
}

