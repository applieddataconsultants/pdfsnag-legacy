project=pdfsnag
instance=\033[36;01m${project}\033[m

watch:
	@if ! which supervisor > /dev/null; then echo "supervisor required, installing..."; sudo npm install -g supervisor; fi
	@supervisor -e html,js -n exit pdfsnag.js

tmux_setup:
	@tmux new-session   -s ${project} -d -n workspace
	@tmux split-window  -t ${project} -h
	@tmux split-window  -t ${project} -v
	@tmux select-pane   -t ${project}:1.0
	@tmux select-pane   -t ${project}:1.1
	@tmux resize-pane   -t ${project} -D 2
	@tmux select-layout -t ${project} main-vertical
	@tmux send-keys     -t ${project}:1.0 'vim' C-m
	@tmux send-keys     -t ${project}:1.2 'make' C-m
	@tmux select-pane   -t ${project}:1.0
	@tmux resize-pane   -t ${project} -R 40

tmux:
	@if ! tmux has-session -t ${project}; then exec make tmux_setup; fi
	@tmux attach -t ${project}

# sample deployment script (assumes upstart as daemon)
deploy_live: serverA = sawyer@172.25.20.111
deploy_live: serverB = sawyer@172.25.20.120
deploy_live:
	@ssh ${serverA} "sudo npm install -g ${project}"
	@ssh ${serverB} "sudo npm install -g ${project}"
	@echo -e " ${instance} | updated ${project} on ${serverA} and ${serverB}"
	@ssh ${serverA} "sudo restart ${project}"
	@ssh ${serverB} "sudo restart ${project}"
	@echo -e " ${instance} | restarting app on ${serverA} and ${serverB}"

