## Installing wkhtmltopdf standalone (w/out X)

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
