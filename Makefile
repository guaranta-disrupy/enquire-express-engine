build:
	docker run --rm -i -t -v .:/var/www -w /var/www --env-file ${HOME}/config/env/express-engine.env node:20 sh -c "npm i && npm run build"

install_deps:
	docker run --rm -i -t -v .:/var/www -w /var/www --env-file ${HOME}/ssr/env/express-engine.env node:20 sh -c "npm i"

build_dev: install_deps
	docker build -f Dockerfiledev -t express-engine:dev .