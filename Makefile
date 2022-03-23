update:
	ssh -t second@165.227.87.89 -p 2222 "cd /home/second/projects/tazkoor.io/backend/ && git pull && npm i -f && pm2 restart ecosystem.config.js"

connect:
	ssh -o IdentitiesOnly=true second@165.227.87.89 -p 2222

push:
	git commit -am 'update' && git push origin main