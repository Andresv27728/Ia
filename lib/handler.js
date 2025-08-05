import { Boom } from '@hapi/boom';
import config from '../config.js';
import { isVip } from './database.js';

const { prefix, owner, Fg } = config;

/**
 * Handles incoming messages and executes commands if applicable.
 * @param {object} sock - The Baileys socket instance.
 * @param {object} m - The message object from Baileys.
 * @param {Map<string, object>} commands - The map of loaded commands.
 */
export async function handleMessage(sock, m, commands) {
    if (!m.messages) return;
    const msg = m.messages[0];
    if (!msg.message) return;
    if (msg.key && msg.key.remoteJid === 'status@broadcast') return;

    // --- Message Parsing ---
    const messageType = Object.keys(msg.message)[0];
    const from = msg.key.remoteJid;
    const isGroup = from.endsWith('@g.us');
    const sender = isGroup ? msg.key.participant : from;
    const senderNumber = sender.split('@')[0];

    let body = (messageType === 'conversation') ? msg.message.conversation :
               (messageType === 'extendedTextMessage') ? msg.message.extendedTextMessage.text :
               (messageType === 'imageMessage') ? msg.message.imageMessage.caption :
               (messageType === 'videoMessage') ? msg.message.videoMessage.caption : '';

    if (!body || !body.startsWith(prefix)) return;

    const args = body.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    const command = commands.get(commandName);

    if (!command) return;

    // --- Permission Checks ---
    const isOwner = owner.includes(senderNumber);
    const isPremium = isVip(senderNumber);

    if (command.isOwner && !isOwner) {
        return sock.sendMessage(from, { text: '🔒 This command is for the bot owner only.' }, { quoted: msg });
    }

    if (command.category === 'premium' && !isPremium && !isOwner) {
        return sock.sendMessage(from, { text: '👑 This is a premium command. Contact the owner to get access.' }, { quoted: msg });
    }

    // --- Group Specific Checks ---
    let groupMetadata, isGroupAdmin, isBotAdmin;
    if (isGroup) {
        groupMetadata = await sock.groupMetadata(from);
        const admins = groupMetadata.participants.filter(p => p.admin).map(p => p.id);
        isGroupAdmin = admins.includes(sender);
        isBotAdmin = admins.includes(sock.user.id);
    }

    if (command.isGroup && !isGroup) {
        return sock.sendMessage(from, { text: 'This command can only be used in groups.' }, { quoted: msg });
    }

    if (command.isGroupAdmin && !isGroupAdmin) {
        return sock.sendMessage(from, { text: 'You must be a group admin to use this command.' }, { quoted: msg });
    }

    // --- Command Execution ---
    try {
        console.log(Fg('cyan')(`Executing command '${command.name}' for ${senderNumber}`));
        await command.execute({
            sock,
            msg,
            from,
            args,
            isGroup,
            sender,
            senderNumber,
            isOwner,
            isPremium,
            isGroupAdmin,
            isBotAdmin,
            groupMetadata
        });
    } catch (e) {
        console.error(Fg('red')(`[ERROR] Error executing command ${command.name}:`), e);
        const errorMessage = e instanceof Boom ? e.output.payload.message : 'An unexpected error occurred.';
        await sock.sendMessage(from, { text: `❌ Error: ${errorMessage}` }, { quoted: msg });
    }
}
