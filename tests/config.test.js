const test = require('node:test');
const assert = require('node:assert/strict');
const { loadConfig, parseReactionRoles } = require('../src/config');

const base = { DISCORD_TOKEN: 't', DISCORD_CLIENT_ID: '1', DISCORD_GUILD_ID: '2' };

test('loadConfig fails fast naming the missing var', () => {
    assert.throws(() => loadConfig({ ...base, DISCORD_TOKEN: '' }), /DISCORD_TOKEN/);
});

test('optional features are off when unset', () => {
    const config = loadConfig(base);
    assert.equal(config.announceWebhookUrl, null);
    assert.equal(config.reactionRoles.messageId, null);
    assert.equal(config.reactionRoles.roles.size, 0);
});

test('parseReactionRoles maps unicode emoji to role ids', () => {
    const roles = parseReactionRoles('👍=771176207219687466, 😋=771176180124614667,');
    assert.equal(roles.get('👍'), '771176207219687466');
    assert.equal(roles.get('😋'), '771176180124614667');
    assert.equal(roles.size, 2);
});

test('parseReactionRoles rejects malformed entries', () => {
    assert.throws(() => parseReactionRoles('👍'), /emoji=roleId/);
    assert.throws(() => parseReactionRoles('👍=notanid'), /Bad role id/);
});
