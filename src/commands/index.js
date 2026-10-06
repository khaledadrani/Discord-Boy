// Explicit registration, no directory scanning: adding a command means adding a line here.
const help = require('./help');
const kick = require('./kick');
const ban = require('./ban');
const multiply = require('./multiply');
const annonce = require('./annonce');

const commands = [help, kick, ban, multiply, annonce];

module.exports = { commands, byName: new Map(commands.map((c) => [c.data.name, c])) };
