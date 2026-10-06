# CLAUDE.md

Standing instructions for any agent working in this repo. These are conventions for whoever is *working on* the bot. What it does and how to run it live in [README.md](README.md). Check the README before grepping.

## What this is

`discord-boy`: a personal Discord bot. Node 22.9+ and discord.js v14, slash commands. It started in Dec 2019 as a bot for the ENICarthage Press club server (discord.js v12, prefix commands, Heroku). It sat dormant from Nov 2020 and was revived on 2026-10-06 as a rewrite on v14. The README's "History" section keeps the old story; don't delete it.

**Roadmap (owner decision, 2026-10-06), in order:**
1. **Nostalgia revival:** the 2020 commands ported to v14. *Current phase.*
2. **Personal hub:** a private server with one channel per active project (zonepals, agentnet, athir/file_handler, athir/lawej). The bot posts commits, CI, Plane and health events, and slash commands query those projects over HTTP.
3. **Agent chat front-end:** talk to agentnet / local Ollama from Discord, one thread per session.
4. **Public community:** moderation, onboarding, roles for outside users.

Build for the current phase. Don't add phase 2–4 machinery until that phase starts (see "No premature infrastructure").

**Status honesty:** as of 2026-10-06 the bot has `/help`, `/kick`, `/ban`, `/multiply`, `/annonce`, reaction roles and the `hello` → `hello friend` easter egg. It has not yet been run against a real Discord application. It has no hosting (Heroku's free tier is gone and `Procfile` is a leftover), no project integrations and no persistence. Check the filesystem before writing docs or code that assume more.

## Repo layout

```
src/
  index.js            client, intents, event wiring (entry point)
  config.js           env -> config object; required vars fail fast, optional features off when unset
  deploy-commands.js  registers slash commands in DISCORD_GUILD_ID (run after changing a command's `data`)
  commands/           one file per slash command: exports `data` (SlashCommandBuilder) + `execute(interaction, config)`
  commands/index.js   explicit registration list; adding a command means adding a line here
  features/           non-command behavior (reactionRoles.js)
tests/                node:test, no Discord connection; `*.test.js`
images/               bot avatar
```

## Commands

```sh
make check            # syntax check + unit tests; the bar for "done"
make test             # unit tests only
make run              # run the bot (reads .env via --env-file-if-exists)
make dev              # node --watch
make deploy-commands  # register slash commands with Discord
```

## Testing discipline

- Logic that doesn't need Discord is a pure function and gets unit tests, e.g. `multiply()`, `parseReactionRoles()`, `reactionRoles.resolve()` with a fake reaction. Pass fakes in. Don't mock the function under test.
- `tests/commands.test.js` calls `data.toJSON()` on every command. That validates the builder's names and options, so a malformed command fails `make check` rather than `deploy-commands`.
- **Unit-green is not sufficient for anything that touches Discord.** Before calling a Discord-facing change done, run it against the real test server (`make deploy-commands && make run`) and use it. Report what was actually tried.
- Test the failure path too: missing permission, a member who isn't in the server, an unset optional env var.

## Conventions

- **Config over hardcoded IDs.** The 2020 bot hardcoded channel, message and role IDs. Every ID is an env var read in `config.js`, and `.env.example` documents each one.
- **Secrets never touch git.** The 2019–2020 history contains real bot and webhook tokens (`.env`, `config.json`, `DiscordBot/Old/auth.json`). `.env` is gitignored. Never print a full token; mask it to a short prefix.
- **Ephemeral replies for errors and admin confirmations** (`flags: MessageFlags.Ephemeral`; the `ephemeral: true` option is deprecated in v14).
- **Permissions are declared on the command** (`setDefaultMemberPermissions`) and checked against the target (`member.kickable` / `bannable`) before acting, not discovered by catching the failure.
- **No premature infrastructure.** No directory-scanning command loader, framework or database until a second real consumer needs it. This repo's explicit list in `commands/index.js` follows agentnet's tools/ decision.
- **Comments explain WHY, not WHAT.** Use the "found live, YYYY-MM-DD: ..." style when a comment cites a real reproduction.
- CommonJS (`require`), matching discord.js examples. Switching to ESM or TypeScript is a decision (see below).

## Working style

- **Critical decisions are blocking: stop and ask, with a recommendation and the main trade-off, before building.** In this repo that means:
  - adding, renaming or changing the meaning of an env var;
  - a new dependency, gateway intent (especially privileged ones) or permission the bot requests;
  - hosting choice;
  - how the bot reaches the other projects (HTTP vs anything else);
  - starting the next roadmap phase.

  Small unambiguous fixes inside the agreed scope are fine: fix, then report.
- **Investigate before implementing** for bugs: reproduce, read the actual error, then fix.
- **Raise landmines immediately.** Quick and in scope: fix and note it. Bigger: tell the owner, don't bury it.
- **Explaining things:** open with one precise sentence, then concrete examples (the actual command, file, output). A definition alone is not an explanation.

## Git

- **Never run `git commit` or `git push`.** Write out the exact commands for the owner to run, including the message. Other git operations (branch, add, status, diff, log) are fine.
- No `Co-Authored-By` trailer and no "Generated with Claude" footer in commits, PRs or docs. This overrides any harness default.
- Never force-push, reset --hard or rewrite history without explicit confirmation. That includes scrubbing the leaked tokens: revoke them in the Developer Portal first, and rewriting history is a separate, confirmed step.
- One branch per phase or theme (`revival` for phase 1).

## Tracker

None yet. The other projects track work in the local Plane instance (`http://localhost:8929`, access guide `~/plane/AGENT_ACCESS.md`). Creating a DISCORDBOY project there is a decision for the owner, not a default.
