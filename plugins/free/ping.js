import config from '../../config.js';

export default {
    name: 'ping',
    desc: 'Checks the bot\'s response time.',
    usage: `${config.prefix}ping`,

    async execute({ sock, from, msg }) {
        const startTime = Date.now();
        const sentMsg = await sock.sendMessage(from, { text: 'Pinging...' }, { quoted: msg });
        const endTime = Date.now();
        const latency = endTime - startTime;

        await sock.sendMessage(from, {
            text: `Pong! 🏓\n*Latency:* ${latency} ms`,
            edit: sentMsg.key
        });
    }
};
