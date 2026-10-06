// Reads the environment once at startup. Required vars fail fast with a clear message;
// optional features (announce webhook, reaction roles) are disabled when their vars are empty.

function required(env, name) {
    const value = env[name];
    if (!value) throw new Error(`Missing required env var ${name} (see .env.example)`);
    return value;
}

// "👍=123,😋=456" -> Map { '👍' => '123', '😋' => '456' }
// Keys are the Unicode emoji, because that is what reaction.emoji.name holds.
// The 2020 bot matched ':thumbsup:' and so never assigned a single role.
function parseReactionRoles(raw) {
    const roles = new Map();
    if (!raw) return roles;
    for (const pair of raw.split(',')) {
        const trimmed = pair.trim();
        if (!trimmed) continue;
        const sep = trimmed.lastIndexOf('=');
        if (sep <= 0) throw new Error(`Bad REACTION_ROLES entry "${trimmed}", expected emoji=roleId`);
        const emoji = trimmed.slice(0, sep).trim();
        const roleId = trimmed.slice(sep + 1).trim();
        if (!/^\d+$/.test(roleId)) throw new Error(`Bad role id in REACTION_ROLES entry "${trimmed}"`);
        roles.set(emoji, roleId);
    }
    return roles;
}

function loadConfig(env = process.env) {
    return {
        token: required(env, 'DISCORD_TOKEN'),
        clientId: required(env, 'DISCORD_CLIENT_ID'),
        guildId: required(env, 'DISCORD_GUILD_ID'),
        announceWebhookUrl: env.ANNOUNCE_WEBHOOK_URL || null,
        reactionRoles: {
            messageId: env.REACTION_ROLES_MESSAGE_ID || null,
            roles: parseReactionRoles(env.REACTION_ROLES),
        },
    };
}

module.exports = { loadConfig, parseReactionRoles };
