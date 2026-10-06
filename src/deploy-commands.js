// Registers slash commands with Discord. Run after adding or changing a command's `data`;
// not needed when only `execute` changes.
const { REST, Routes } = require('discord.js');
const { loadConfig } = require('./config');
const { commands } = require('./commands');

async function main() {
    const config = loadConfig();
    const rest = new REST().setToken(config.token);
    const body = commands.map((c) => c.data.toJSON());
    const result = await rest.put(Routes.applicationGuildCommands(config.clientId, config.guildId), { body });
    console.log(`Registered ${result.length} commands in guild ${config.guildId}`);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
