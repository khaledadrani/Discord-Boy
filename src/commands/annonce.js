const { SlashCommandBuilder, PermissionFlagsBits, InteractionContextType, MessageFlags, WebhookClient } = require('discord.js');

let webhook = null;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('annonce')
        .setDescription('Post an announcement through the announcement webhook')
        .addStringOption((o) => o.setName('message').setDescription('What to announce').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .setContexts(InteractionContextType.Guild),
    async execute(interaction, config) {
        if (!config.announceWebhookUrl) {
            return interaction.reply({ content: 'ANNOUNCE_WEBHOOK_URL is not set.', flags: MessageFlags.Ephemeral });
        }
        webhook ??= new WebhookClient({ url: config.announceWebhookUrl });
        await webhook.send(interaction.options.getString('message'));
        await interaction.reply({ content: 'Announced.', flags: MessageFlags.Ephemeral });
    },
};
