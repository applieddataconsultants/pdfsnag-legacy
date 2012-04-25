#!/usr/bin/env node

const spawn = require('child_process').spawn
const http = require('http')
const url = require('url')
const qs = require('querystring')
const port = process.argv[2] || 3000

function Undefined(){}
function StringStripped(value){ return value.replace('$','').replace('&','').replace(';','') }

const acceptableOpts = {
   'background': Undefined,
   'collate': Undefined,
   'copies': Number,
   'default-header': Undefined,
   'disable-external-links': Undefined,
   'disable-forms': Undefined,
   'disable-internal-links': Undefined,
   'disable-javascript': Undefined,
   'disable-smart-shrinking': Undefined,
   'disable-toc-back-links': Undefined,
   'enable-external-links': Undefined,
   'enable-forms': Undefined,
   'enable-internal-links': Undefined,
   'enable-javascript': Undefined,
   'enable-smart-shrinking': Undefined,
   'enable-toc-back-links': Undefined,
   'encoding': StringStripped,
   'exclude-from-outline': Undefined,
   'grayscale': Undefined,
   'image-dpi': Number,
   'image-quality': Number,
   'images': Undefined,
   'include-in-outline': Undefined,
   'javascript-delay': Number,
   'load-error-handling': StringStripped,
   'lowquality': Undefined,
   'margin-bottom': StringStripped,
   'margin-left': StringStripped,
   'margin-right': StringStripped,
   'margin-top': StringStripped,
   'minimum-font-size': Number,
   'no-background': Undefined,
   'no-collate': Undefined,
   'no-images': Undefined,
   'no-outline': Undefined,
   'no-pdf-compression': Undefined,
   'no-print-media-type': Undefined,
   'no-stop-slow-scripts': Undefined,
   'orientation': StringStripped,
   'outline': Undefined,
   'outline-depth': Number,
   'output-format': StringStripped,
   'page-height': StringStripped,
   'page-offset': Number,
   'page-size': StringStripped,
   'page-width': StringStripped,
   'password': StringStripped,
   'print-media-type': Undefined,
   'proxy': StringStripped,
   'stop-slow-scripts': Undefined,
   'title': StringStripped,
   'user-style-sheet': StringStripped,
   'username': StringStripped,
   'zoom': Number
}

const index = require('fs').readFileSync(__dirname+'/index.html').toString().replace('%OPTIONS%', Object.keys(acceptableOpts))

function afterwards (res, wkhtmltopdf) {
   if (!res.finished) {
      wkhtmltopdf.kill('SIGTERM')
      res.end('Unable to load within 30 seconds')
   }
}

function getopts (query) {
   var opts = []
   Object.keys(query).forEach(function (opt) {
      var Type = acceptableOpts[opt]
      if (Type) {
         opts.push('--'+opt)
         if (Type != Undefined) opts.push(Type(query[opt]))
      }
   })

   return opts
}

function snagit (query, res) {
   query.html || (query.html = null)
   query.url  || (query.url  = null)
   query.name || (query.name = 'output')

   var opts = getopts(query)

   if (!query.html && !query.url) {
      res.writeHead(200, { 'Content-Type': 'text/html' })
      res.end(index)
   }
   else {
      res.writeHead(200, {
         'Content-Type': 'application/pdf',
         'Content-Disposition': 'attachment; filename='+query.name+'.pdf'
      })

      var wkhtmltopdf = spawn('wkhtmltopdf',[ (query.html ? '-' : query.url),'-'].concat(opts))
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
         body = qs.parse(body)
         for (var i in body) query[i] = body[i]
         snagit(query, res)
      })
   } else snagit(query, res)

}).listen(port)
