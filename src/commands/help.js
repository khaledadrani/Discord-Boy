const { SlashCommandBuilder, MessageFlags } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder().setName('help').setDescription('List what I can do'),
    async execute(interaction) {
        // Required lazily: commands/index.js requires this file, so a top-level require would be circular.
        const { commands } = require('./index');
        const lines = commands.map((c) => `\`/${c.data.name}\`: ${c.data.description}`);
        await interaction.reply({ content: lines.join('\n'), flags: MessageFlags.Ephemeral });
    },
};
