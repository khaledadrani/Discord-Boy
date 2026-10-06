// Gives a role when someone reacts to the configured message, takes it back when they un-react.

async function resolve(reaction, user, config) {
    const { messageId, roles } = config.reactionRoles;
    if (!messageId || user.bot) return null;
    // Partials: reactions on messages sent before the bot started arrive without their message.
    if (reaction.partial) await reaction.fetch();
    if (reaction.message.id !== messageId || !reaction.message.guild) return null;
    const roleId = roles.get(reaction.emoji.name);
    if (!roleId) return null;
    const member = await reaction.message.guild.members.fetch(user.id);
    return { member, roleId };
}

function register(client, config) {
    client.on('messageReactionAdd', async (reaction, user) => {
        const target = await resolve(reaction, user, config);
        if (target) await target.member.roles.add(target.roleId);
    });
    client.on('messageReactionRemove', async (reaction, user) => {
        const target = await resolve(reaction, user, config);
        if (target) await target.member.roles.remove(target.roleId);
    });
}

module.exports = { register, resolve };
