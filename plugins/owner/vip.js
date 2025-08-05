import { addVip } from '../../lib/database.js';
import config from '../../config.js';

export default {
    name: 'vip',
    desc: 'Grants VIP access to a user.',
    usage: `${config.prefix}vip <number> <days>`,
    isOwner: true,

    async execute({ sock, from, args, msg }) {
        if (args.length < 2) {
            return sock.sendMessage(from, { text: `Invalid usage.\n\n*Usage:* ${this.usage}` }, { quoted: msg });
        }

        const targetUser = args[0].replace(/[@\s-]/g, '');
        const days = parseInt(args[1], 10);

        if (!/^\d+$/.test(targetUser)) {
            return sock.sendMessage(from, { text: 'Invalid phone number format.' }, { quoted: msg });
        }

        if (isNaN(days) || days <= 0) {
            return sock.sendMessage(from, { text: 'The number of days must be a positive number.' }, { quoted: msg });
        }

        try {
            await addVip(targetUser, days);

            const confirmationText = `✅ *VIP Status Granted*\n\n*User:* ${targetUser}\n*Duration:* ${days} days`;
            await sock.sendMessage(from, { text: confirmationText }, { quoted: msg });

            const userJid = `${targetUser}@s.whatsapp.net`;
            const userNotification = `🎉 *Congratulations! You are now a VIP User!*\n\n*Duration:* ${days} days.\nEnjoy your premium features!`;
            await sock.sendMessage(userJid, { text: userNotification });

        } catch (error) {
            console.error('Error in VIP command:', error);
            await sock.sendMessage(from, { text: `An error occurred while granting VIP status: ${error.message}` }, { quoted: msg });
        }
    }
};
