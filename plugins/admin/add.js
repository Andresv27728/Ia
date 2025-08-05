import config from '../../config.js';

export default {
    name: 'add',
    desc: 'Adds a participant to the group.',
    usage: `${config.prefix}add <number>`,
    isGroup: true,
    isGroupAdmin: true,

    async execute({ sock, from, args, msg }) {
        if (!args[0]) {
            return sock.sendMessage(from, { text: 'Please provide a phone number to add.' }, { quoted: msg });
        }

        const targetUser = args[0].replace(/[@\s-]/g, '');
        if (!/^\d+$/.test(targetUser)) {
            return sock.sendMessage(from, { text: 'Invalid phone number format.' }, { quoted: msg });
        }
        
        const targetJid = `${targetUser}@s.whatsapp.net`;

        try {
            const response = await sock.groupParticipantsUpdate(from, [targetJid], 'add');
            
            // Baileys provides a detailed response for each participant
            const result = response[0];
            if (result.status === '200') {
                await sock.sendMessage(from, { text: `✅ Successfully added @${targetUser}.`, mentions: [targetJid] }, { quoted: msg });
            } else if (result.status === '403') {
                 await sock.sendMessage(from, { text: `❌ Failed to add @${targetUser}. They may have privacy settings that prevent them from being added.`, mentions: [targetJid] }, { quoted: msg });
            } else if (result.status === '409') {
                 await sock.sendMessage(from, { text: `❌ @${targetUser} is already a member of this group.`, mentions: [targetJid] }, { quoted: msg });
            } else {
                 await sock.sendMessage(from, { text: `Failed to add @${targetUser}. Status: ${result.status}` }, { quoted: msg });
            }
        } catch (error) {
            console.error('Error in add command:', error);
            await sock.sendMessage(from, { text: 'An error occurred. I may not have admin privileges or the number is invalid.' }, { quoted: msg });
        }
    }
};
