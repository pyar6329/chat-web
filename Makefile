MAKEFILE_DIR:=$(dir $(abspath $(lastword $(MAKEFILE_LIST))))

# To apply self documented help command,
# make target with following two sharp '##' enable to show the help message.
# If you wish not to display the help message, create taget with no comment or single sharp to comment.
.PHONY:	help
help: ## show this help message.
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

.PHONY: install
install: ## run npm install
	@$(MAKEFILE_DIR)/script/startup.sh

.PHONY: up
up: ## run elm-reload
	@if ! [ -e $(MAKEFILE_DIR)/node_modules ]; then make install; fi
	@npm run start

.PHONY: clean
clean: ## remove build files
	@rm -rf elm-stuff dist/main.js node_modules
