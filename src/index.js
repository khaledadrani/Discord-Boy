const { Client, Events, GatewayIntentBits, Partials, MessageFlags } = require('discord.js');
const { loadConfig } = require('./config');
const { byName } = require('./commands');
const reactionRoles = require('./features/reactionRoles');

const config = loadConfig();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        // Privileged: enable "Message Content Intent" in the Developer Portal, or login fails.
        // Only the "hello" easter egg needs it.
        GatewayIntentBits.MessageContent,
    ],
    partials: [Partials.Message, Partials.Channel, Partials.Reaction, Partials.User],
});

client.once(Events.ClientReady, (c) => {
    console.log(`Logged in as ${c.user.tag}`);
    c.user.setActivity('( ͡° ͜ʖ ͡°)');
    console.log('Servers:');
    c.guilds.cache.forEach((guild) => console.log(` - ${guild.name}`));
});

// Kept from the very first version of the bot (2019).
client.on(Events.MessageCreate, async (message) => {
    if (message.author.bot) return;
    if (message.content.toLowerCase() === 'hello') await message.channel.send('hello friend');
});

client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    const command = byName.get(interaction.commandName);
    if (!command) return;
    try {
        await command.execute(interaction, config);
    } catch (err) {
        console.error(`/${interaction.commandName} failed:`, err);
        const reply = { content: 'Something went wrong running that command.', flags: MessageFlags.Ephemeral };
        if (interaction.replied || interaction.deferred) await interaction.followUp(reply);
        else await interaction.reply(reply);
    }
});

reactionRoles.register(client, config);

client.login(config.token);
