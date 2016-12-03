run=docker run -it --rm -v "$(CURDIR)":/usr/src/app -w /usr/src/app node:6

all: build/js/main.js

.PHONY: clean
clean:
	$(run) rm -rf build
	$(run) rm -rf node_modules

node_modules: package.json
	$(run) npm install

sources=$(wildcard js/*) $(wildcard js/*/*) $(wildcard css/*/*)  $(wildcard css/*)

.PHONY: prod
prod: node_modules $(sources)
	$(run) node_modules/.bin/gulp prod

build/js/main.js: prod

.PHONY: build
build: prod

.PHONY: watch
watch: node_modules
	# run inside `sh` to have proper interrupt handling
	$(run) sh -c 'node node_modules/.bin/gulp watch'
