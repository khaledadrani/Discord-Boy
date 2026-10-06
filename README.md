# Discord Boy

A personal Discord bot. It started in 2019 as the chat bot for the ENICarthage Press club server and was revived in 2026 on discord.js v14. See [History](#history).

**Status (2026-10-06):** phase 1 of the [roadmap](#roadmap). The 2020 commands are ported to v14 as slash commands. The bot has not been run against a real server yet and has no hosting.

## What it does

| Thing | How |
|---|---|
| `/help` | lists commands (only you see the reply) |
| `/multiply numbers:2 4 10` | multiplies numbers |
| `/kick member [reason]` | needs Kick Members |
| `/ban user [reason]` | needs Ban Members; works on users who already left |
| `/annonce message` | posts through a webhook; needs Manage Server and `ANNOUNCE_WEBHOOK_URL` |
| reaction roles | react to one message to get a role, un-react to lose it (`REACTION_ROLES*`) |
| `hello` | the bot answers `hello friend`, as it has since 2019 |

Bot status: playing `( ͡° ͜ʖ ͡°)`.

## Quick start

Requires Node 22.9+.

1. Go to <https://discord.com/developers/applications>, then New Application, then **Bot**:
   - **Reset Token** and copy it.
   - Enable **Message Content Intent** (used only by the `hello` easter egg).
2. Invite the bot. OAuth2 → URL Generator → scopes `bot` and `applications.commands`. Permissions: Send Messages, Kick Members, Ban Members, Manage Roles. Open the URL.
3. Configure and run:

```sh
cp .env.example .env     # fill in DISCORD_TOKEN, DISCORD_CLIENT_ID, DISCORD_GUILD_ID
make install
make deploy-commands     # once, and again whenever a command's options change
make run                 # or: make dev (auto-restart)
```

For reaction roles, the bot's role must sit above the roles it hands out (Server Settings → Roles).

## Development

```sh
make check   # syntax check + unit tests; the bar for "done"
```

Layout, conventions and working rules are in [CLAUDE.md](CLAUDE.md).

## Roadmap

1. **Nostalgia revival:** port the 2020 bot to v14. *(current)*
2. **Personal hub:** a channel per active project. The bot posts commits, CI and tickets, and slash commands query the projects.
3. **Agent chat front-end:** talk to a local agent (agentnet / Ollama) from Discord.
4. **Public community:** moderation and onboarding for outside users.

## History

- **2019-12-15:** created through the GitHub web UI as the bot for the ENICarthage Press Discord server. Node + discord.js v11/12, with a `!` prefix and `hello` → `hello friend`.
- **2020-05-29:** "vision and plans": *Why not implement some AI? or make it a smart chat bot?*
- **2020-10-29:** rewritten in one night. Added `!help`, `!kick`, `!ban`, `!multiply`, `!annonce` (webhook) and a reaction-roles stub, then deployed to Heroku.
- **2020-11-08:** *"I'm still experimenting with a python notebook. I'm still novice in NLP and Keras."*
- **2020-11-30:** an NLP intents file was committed (greeting, goodbye, "I can guide you through the ENICarthage Press Discord Server") and moved off master 9 minutes later.
- **2021–2024:** dormant, apart from Dependabot bumps.
- **2026-10-06:** revived on discord.js v14 with slash commands. The 2020 reaction roles never worked: they matched `':thumbsup:'` instead of `👍` and called `member.role` instead of `member.roles`. They work now.

> The git history before 2020-10-29 contains real bot and webhook tokens. They must be considered compromised and revoked. Never commit `.env`.
