const spawn = require('child_process').spawn
const http = require('http')
const url = require('url')
const qs = require('querystring')
const index = require('fs').readFileSync(__dirname+'/index.html')

function afterwards (res, wkhtmltopdf) {
   if (!res.finished) {
      wkhtmltopdf.kill('SIGTERM')
      res.end('Unable to load within 30 seconds')
   }
}

function snagit (query, res) {
   query.html || (query.html = null)
   query.url  || (query.url  = null)
   query.name || (query.name = 'output')

   if (!query.html && !query.url) {
      res.writeHead(200, { 'Content-Type': 'text/html' })
      res.end(index)
   }
   else {
      res.writeHead(200, {
         'Content-Type': 'application/pdf',
         'Content-Disposition': 'attachment; filename='+query.name+'.pdf'
      })

      var wkhtmltopdf = spawn('wkhtmltopdf',[ (query.html ? '-' : query.url),'-'])
      if (query.html) wkhtmltopdf.stdin.end(query.html)
      wkhtmltopdf.stdout.pipe(res)
      setTimeout(afterwards, 30000, res, wkhtmltopdf)
   }
}

http.createServer( function (req, res) {
   var query = url.parse(req.url, true).query

   if (req.method === 'POST') {
      req.setEncoding('utf-8')
      var body = ''
      req.on('data', function (chunk) {
         body += chunk
      })
      req.on('end', function () {
         query = qs.parse(body)
         snagit(query, res)
      })
   } else snagit(query, res)
}).listen(8003)
