#!/usr/bin/env node

var spawn = require('child_process').spawn
var http = require('http')
var url = require('url')
var qs = require('querystring')
var port = process.argv[2] || 3000
var util = require('util')

function Undefined() {}
function StringStripped(value) { return value.replace('$','\\$').replace('&','\\&').replace(';','\\;') }

var acceptableOpts = {
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
  'zoom': Number,
}

var index = require('fs').readFileSync(__dirname + '/index.html').toString().replace('%OPTIONS%', Object.keys(acceptableOpts))
var forkme = require('fs').readFileSync(__dirname + '/forkme.png')

function afterwards(res, wkhtmltopdf) {
  if (!res.finished) {
    util.log('error - wkhtmltopdf did not complete in a timely manner, killing')
    wkhtmltopdf.stdout.destroy()
    wkhtmltopdf.stderr.destroy()
    wkhtmltopdf.kill('SIGKILL')
  }
}

function getopts(query) {
  var opts = []
  Object.keys(query).forEach(function(opt) {
    var Type = acceptableOpts[opt]
    if (Type) {
      opts.push('--' + opt)
      if (Type != Undefined) opts.push(Type(query[opt]))
    }
  })

  return opts
}

function snagit(query, res) {
  query.html || (query.html = '')
  query.url || (query.url = null)
  query.name || (query.name = 'output')

  var opts = getopts(query)

  res.writeHead(200, {
    'Content-Type': 'application/pdf',
    'Content-Disposition': 'attachment; filename=' + query.name + '.pdf',
  })

  var wkhtmltopdf = spawn('/bin/sh', ['-c', 'wkhtmltopdf ' + opts.join(' ') + ' ' + (query.html ? '-' : '"' + StringStripped(encodeURI(decodeURI(query.url))) + '"') + ' - | cat'])
  if (query.html) wkhtmltopdf.stdin.end(query.html)
  wkhtmltopdf.stdout.pipe(res)
  util.log('info - ' + query.name + ' ' + (query.url || '"' + query.html.substr(25, 50).replace(/\n|\r/g,'') + '"') + ' ' + JSON.stringify(opts))
  setTimeout(afterwards, 30000, res, wkhtmltopdf)
}

http.createServer(function(req, res) {
  var query = url.parse(req.url, true).query

  if (req.method === 'POST') {
    req.setEncoding('utf-8')
    var body = ''
    req.on('data', function(chunk) {
      body += chunk
    })
    req.on('end', function() {
      body = qs.parse(body)
      for (var i in body) query[i] = body[i]
      snagit(query, res)
    })
  } else if (!query.html && !query.url) {
    if (req.url == '/forkme.png') {
      res.writeHead(200, {'Content-Type': 'image/png'})
      res.end(forkme)
    }
    else {
      res.writeHead(200, {'Content-Type': 'text/html'})
      res.end(index)
    }
  }
  else snagit(query, res)

}).listen(port)
