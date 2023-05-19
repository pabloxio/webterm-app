.PHONY: start deploy build test clean

setup: node_modules/initialized

node_modules/initialized: package.json package-lock.json
	@npm install
	@touch node_modules/initialized

start: setup
	@npm run dev
