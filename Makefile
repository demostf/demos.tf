all: leveloverview class_portraits build

.PHONY: leveloverview
leveloverview:
	$(MAKE) -C src/images/leveloverview

.PHONY: class_portraits
class_portraits:
	$(MAKE) -C src/images/class_portraits

.PHONY: clean
clean:
	rm -rf dist
	rm -rf node_modules

node_modules: package.json
	npm install

sources=$(wildcard js/*) $(wildcard js/*/*) $(wildcard css/*/*)  $(wildcard css/*)

.PHONY: build
build: node_modules $(sources)
	node node_modules/.bin/webpack --config webpack.prod.config.js

build/js/main.js: build

.PHONY: watch
watch: node_modules
	node node_modules/.bin/webpack --config webpack.prod.config.js --watch

.PHONY: analyse
analyse: build/js/main.js
	node_modules/.bin/webpack-bundle-analyzer build/stats.json

.PHONY: beta
beta:
	scp -r build demos@demos.tf:demos_beta

.PHONY: staging
staging:
	-ssh demos@demos.tf "rm -r demos_staging"
	scp -r build demos@demos.tf:demos_staging

.PHONY: prod
prod:
	ssh demos@demos.tf "rm -r demos_prod_old; mv demos_prod demos_prod_old; mv demos_staging demos_prod"

.PHONY: docker
docker:
	docker build -t demostf/demos.tf .
