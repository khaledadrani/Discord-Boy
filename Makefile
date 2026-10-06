.PHONY: install check test run dev deploy-commands

install:          ## install dependencies
	npm install

check:            ## syntax check + tests; the bar for "done"
	npm run check

test:
	npm test

run:              ## run the bot (reads .env)
	npm start

dev:              ## run with auto-restart on file changes
	npm run dev

deploy-commands:  ## register slash commands in DISCORD_GUILD_ID
	npm run deploy-commands
