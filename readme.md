# pdfsnag

Streaming htmltopdf web service

## Setup

Requires that you have [wkhtmltopdf](http://code.google.com/p/wkhtmltopdf) binary in your PATH.  See below for instructions on how to set that up on Linux server environment.

To start server run:

```
sudo npm install -g pdfsnag
pdfsnag [port]
```

### Installing wkhtmltopdf standalone (w/out X)

```sh
sudo aptitude install openssl build-essential xorg libssl-dev # ubuntu specific
```

For amd64

```sh
wget http://wkhtmltopdf.googlecode.com/files/wkhtmltopdf-0.9.9-static-amd64.tar.bz2
tar xvjf wkhtmltopdf-0.9.9-static-amd64.tar.bz2
mv wkhtmltopdf-amd64 /usr/local/bin/wkhtmltopdf
chmod +x /usr/local/bin/wkhtmltopdf
```

For i386

```sh
wget http://wkhtmltopdf.googlecode.com/files/wkhtmltopdf-0.9.9-static-i386.tar.bz2
tar xvjf wkhtmltopdf-0.9.9-static-i386.tar.bz2
mv wkhtmltopdf-i386 /usr/local/bin/wkhtmltopdf
chmod +x /usr/local/bin/wkhtmltopdf
```

## License

(The MIT License)

Copyright (c) 2012 Applied Data Consultants

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish, distribute,
sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
