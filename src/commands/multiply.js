const { SlashCommandBuilder, MessageFlags } = require('discord.js');

// Pure so it can be unit tested without a Discord connection.
function multiply(input) {
    const parts = input.trim().split(/\s+/).filter(Boolean);
    if (parts.length < 2) return { error: 'Not enough values to multiply. Try `2 4 10` or `5.2 7`.' };
    const numbers = parts.map(Number);
    const bad = parts.filter((_, i) => Number.isNaN(numbers[i]));
    if (bad.length) return { error: `Not a number: ${bad.join(', ')}` };
    return { product: numbers.reduce((a, b) => a * b, 1), numbers };
}

module.exports = {
    multiply,
    data: new SlashCommandBuilder()
        .setName('multiply')
        .setDescription('Multiply numbers together')
        .addStringOption((o) => o.setName('numbers').setDescription('Space-separated, e.g. 2 4 10').setRequired(true)),
    async execute(interaction) {
        const result = multiply(interaction.options.getString('numbers'));
        if (result.error) return interaction.reply({ content: result.error, flags: MessageFlags.Ephemeral });
        await interaction.reply(`The product of ${result.numbers.join(', ')} multiplied together is: ${result.product}`);
    },
};
