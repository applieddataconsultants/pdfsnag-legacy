.PHONY: watch deploy_live
project=pdfsnag
path=/var/www/pdfsnag
instance=\033[32;01m${project}\033[m

all: watch

watch:
	@always app.js

deploy_live: serverA = sawyer@172.25.20.111
deploy_live: serverB = sawyer@172.25.20.120
deploy_live:
	@rsync -az --exclude=".git" --delete * ${serverA}:${path}
	@rsync -az --exclude=".git" --delete * ${serverB}:${path}
	@echo -e " ${instance} | copied files to ${serverA} and ${serverB}"
	@ssh ${serverA} "sudo restart ${project}"
	@ssh ${serverB} "sudo restart ${project}"
	@echo -e " ${instance} | restarting app on ${serverA} and ${serverB}"
