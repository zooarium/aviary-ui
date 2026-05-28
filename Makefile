SHELL := /bin/bash

NVM_SH := ~/.local/bin/nvm.sh
NVM_USE := . $(NVM_SH) && nvm use

.PHONY: help install build build-core build-ui dev-core dev-ui playground lint format clean

help:
	@echo "aviary-ui — Monorepo Commands"
	@echo ""
	@echo "  make install      Install all workspace deps"
	@echo "  make build        Build all packages (core → ui)"
	@echo "  make build-core   Build @aviary-ui/core only"
	@echo "  make build-ui     Build @aviary-ui/ui only"
	@echo "  make dev-core     Watch-build @aviary-ui/core"
	@echo "  make dev-ui       Watch-build @aviary-ui/ui"
	@echo "  make playground   Start component playground (localhost:5173)"
	@echo "  make lint         Run ESLint across all packages"
	@echo "  make format       Format all files with Prettier"
	@echo "  make clean        Remove all dist/ and node_modules"

install:
	$(NVM_USE) && npm install

build: build-core build-ui

build-core:
	$(NVM_USE) && npm run build -w packages/core

build-ui:
	$(NVM_USE) && npm run build -w packages/ui

dev-core:
	$(NVM_USE) && npm run dev -w packages/core

dev-ui:
	$(NVM_USE) && npm run dev -w packages/ui

playground:
	$(NVM_USE) && npm run playground

lint:
	$(NVM_USE) && npm run lint

format:
	$(NVM_USE) && npm run format

clean:
	rm -rf packages/core/dist packages/ui/dist
	rm -rf node_modules packages/core/node_modules packages/ui/node_modules apps/playground/node_modules
	@echo "Cleaned dist and node_modules"
