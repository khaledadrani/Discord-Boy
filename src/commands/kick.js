const { SlashCommandBuilder, PermissionFlagsBits, InteractionContextType, MessageFlags } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Kick a member')
        .addUserOption((o) => o.setName('member').setDescription('Who to kick').setRequired(true))
        .addStringOption((o) => o.setName('reason').setDescription('Why'))
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
        .setContexts(InteractionContextType.Guild),
    async execute(interaction) {
        const member = interaction.options.getMember('member');
        const reason = interaction.options.getString('reason') ?? undefined;
        if (!member) {
            return interaction.reply({ content: 'That member was not found.', flags: MessageFlags.Ephemeral });
        }
        // kickable covers role hierarchy and the bot's own permissions, which the 2020 bot only found out by failing.
        if (!member.kickable) {
            return interaction.reply({ content: 'I do not have the permission to kick this person.', flags: MessageFlags.Ephemeral });
        }
        await member.kick(reason);
        await interaction.reply(`${member.user.tag} was kicked...`);
    },
};
