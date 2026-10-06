const test = require('node:test');
const assert = require('node:assert/strict');
const { commands } = require('../src/commands');
const { multiply } = require('../src/commands/multiply');

test('every command has unique valid slash data and an execute function', () => {
    const names = new Set();
    for (const c of commands) {
        const json = c.data.toJSON(); // builders validate name/description/options here
        assert.ok(!names.has(json.name), `duplicate command ${json.name}`);
        names.add(json.name);
        assert.equal(typeof c.execute, 'function');
    }
});

test('multiply multiplies', () => {
    assert.equal(multiply('2 4 10').product, 80);
    assert.equal(multiply(' 5.2   7 ').product, 5.2 * 7);
});

test('multiply rejects too few or non-numeric values', () => {
    assert.match(multiply('3').error, /Not enough/);
    assert.match(multiply('2 abc').error, /abc/);
});
