const test = require('node:test');
const assert = require('node:assert/strict');
const { resolve } = require('../src/features/reactionRoles');

const config = { reactionRoles: { messageId: 'm1', roles: new Map([['👍', 'r1']]) } };
const member = { id: 'u1' };
const reaction = (emoji, messageId = 'm1') => ({
    partial: false,
    emoji: { name: emoji },
    message: { id: messageId, guild: { members: { fetch: async () => member } } },
});
const user = { id: 'u1', bot: false };

test('maps a configured emoji on the watched message to its role', async () => {
    assert.deepEqual(await resolve(reaction('👍'), user, config), { member, roleId: 'r1' });
});

test('ignores other emoji, other messages and bots', async () => {
    assert.equal(await resolve(reaction('👀'), user, config), null);
    assert.equal(await resolve(reaction('👍', 'other'), user, config), null);
    assert.equal(await resolve(reaction('👍'), { ...user, bot: true }, config), null);
});

test('fetches partial reactions before reading the message', async () => {
    const r = reaction('👍');
    r.partial = true;
    let fetched = false;
    r.fetch = async () => { fetched = true; };
    await resolve(r, user, config);
    assert.ok(fetched);
});
