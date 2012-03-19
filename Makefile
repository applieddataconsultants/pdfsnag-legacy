.PHONY: watch deploy_live
project=pdfsnag
path=/var/www/pdfsnag
instance=\033[32;01m${project}\033[m

all: watch

watch:
	@always app.js

deploy_live: server = sawyer@172.25.20.120
deploy_live:
	@rsync -az --exclude=".git" --delete * ${server}:${path}
	@echo -e " ${instance} | copied files to ${server}"
	@ssh ${server} "sudo restart ${project}"
	@echo -e " ${instance} | restarting app on ${server}"
