/**
 * Rock, Paper, Scissors Game
 * Category: premium/games
 */

const { formatMessage } = require('../../../lib/connect');
const settings = require('../../../config/settings');
const logger = require('../../../utils/logger');

module.exports = {
    name: 'rps',
    desc: 'Play a game of Rock, Paper, Scissors against the bot.',
    usage: `${settings.bot.prefix}rps <rock|paper|scissors>`,
    category: 'premium',

    execute: async (ctx) => {
        const { sock, from, args, msg, sender } = ctx;

        const choices = ['rock', 'paper', 'scissors'];
        const userChoice = args[0] ? args[0].toLowerCase() : '';

        if (!choices.includes(userChoice)) {
            await sock.sendMessage(from, { text: formatMessage(`❌ Invalid choice. Please use one of the following:\n\n- rock\n- paper\n- scissors`) }, { quoted: msg });
            return;
        }

        const botChoice = choices[Math.floor(Math.random() * choices.length)];

        let result = '';
        if (userChoice === botChoice) {
            result = "It's a tie! 🤝";
        } else if (
            (userChoice === 'rock' && botChoice === 'scissors') ||
            (userChoice === 'paper' && botChoice === 'rock') ||
            (userChoice === 'scissors' && botChoice === 'paper')
        ) {
            result = "You win! 🎉";
        } else {
            result = "I win! 🤖";
        }

        const reply = `*Rock, Paper, Scissors*\n\n*You chose:* ${userChoice}\n*I chose:* ${botChoice}\n\n*Result:* ${result}`;

        await sock.sendMessage(from, { text: formatMessage(reply, false) }, { quoted: msg });
        logger.info(`RPS game played by ${sender}. User: ${userChoice}, Bot: ${botChoice}`);
    }
};
