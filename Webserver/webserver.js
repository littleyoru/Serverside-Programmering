const url = require('url') // url resolution and parsing
const http = require('http')
const fs = require('fs') // file system
const path = require('path') // file and directory paths

const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.ico': 'image/x-icon',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.json': 'application/json',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.pdf': 'application/pdf',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.txt': 'text/plain'
}

const webserver = http.createServer((req, res) => {
    let parsedUrl = url.parse(req.url)
    let pathName = parsedUrl.pathname
    let ext = path.extname(pathName)

    console.log('requrl: ', parsedUrl)

    // if request is for root directory return index.html
    // otherwise append '.html' to all other requests without ext
    if (pathName === '/') {
        ext = '.html'
        pathName = 'index.html'
    } else if (!ext) {
        ext = '.html'
        pathName += ext
    }

    // construct a path for assets
    var filePath = path.join(process.cwd(), '/Website', pathName)
    if (pathName.indexOf('/Assets') != -1)  filePath = path.join(process.cwd(), pathName)

    // check if asset exists on the server
    fs.exists(filePath, (exists, err) => {
        if (!exists || !mimeTypes[ext]) {
            console.log('File does not exist: ', pathName)
            res.writeHead(404, 'Resource not found', {'Content-Type': 'text/plain'})
            res.write('404 Not found')
            res.end()
            return
        } else {
            res.writeHead(200, {'Content-Type': mimeTypes[ext]})
            fs.readFile(filePath, (err, data) => {

                res.end(data)
            })
        }
    })

    //res.end(JSON.stringify(parsedUrl))
})

webserver.listen(8081)