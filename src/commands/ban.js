const { SlashCommandBuilder, PermissionFlagsBits, InteractionContextType, MessageFlags } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Ban a user')
        .addUserOption((o) => o.setName('user').setDescription('Who to ban').setRequired(true))
        .addStringOption((o) => o.setName('reason').setDescription('Why'))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .setContexts(InteractionContextType.Guild),
    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const member = interaction.options.getMember('user');
        const reason = interaction.options.getString('reason') ?? undefined;
        // A user who already left has no member object and can still be banned by id.
        if (member && !member.bannable) {
            return interaction.reply({ content: 'I do not have the permission to ban this person.', flags: MessageFlags.Ephemeral });
        }
        await interaction.guild.members.ban(user, { reason });
        await interaction.reply(`${user.tag} was banned.`);
    },
};
