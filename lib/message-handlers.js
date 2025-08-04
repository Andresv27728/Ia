/**
 * Message event handlers for special features
 */

const { formatMessage, sendText, sendReaction } = require('./connect');
const { getGroupData } = require('./database');
const logger = require('../utils/logger');

/**
 * Handle anti-link feature
 * @param {Object} sock - The socket connection
 * @param {Object} parsedMsg - The parsed message object
 * @param {Object} metadata - Message metadata
 * @returns {Boolean} True if message contained link and was handled
 */
const handleAntiLink = async (sock, parsedMsg, metadata) => {
    try {
        // Only process group messages
        if (!metadata.isGroup) return false;

        // Get group data
        const groupData = await getGroupData(metadata.from);
        if (!groupData || !groupData.antilink) return false;

        // Skip if user is admin or owner
        if (metadata.isGroupAdmin || metadata.isOwner) return false;

        // Check for links in message
        const linkRegex = /(https?:\/\/[^\s]+|www\.[^\s]+|[^\s]+\.(com|net|org|io|me|co|tv|gg|tk|ml|ga|cf)[^\s]*)/gi;

        if (linkRegex.test(parsedMsg.content)) {
            // Delete the message
            await sock.sendMessage(metadata.from, { delete: metadata.key });

            // Send warning
            await sendText(sock, metadata.from, formatMessage(`🚫 @${metadata.senderNumber}, links are not allowed in this group!`));

            // Log the action
            logger.info(`Anti-link triggered: Deleted message from ${metadata.senderNumber} in ${metadata.from}`);

            return true;
        }

        return false;
    } catch (error) {
        logger.error('Error in anti-link handler:', error);
        return false;
    }
};

/**
 * Handle welcome messages for new group members
 * @param {Object} sock - The socket connection
 * @param {Object} event - Group participant update event
 */
const handleWelcome = async (sock, event) => {
    try {
        const { id, participants, action } = event;

        // Only handle add events
        if (action !== 'add') return;

        // Get group data
        const groupData = await getGroupData(id);
        if (!groupData || !groupData.welcome) return;

        // Get group metadata
        const groupMetadata = await sock.groupMetadata(id);

        for (const participant of participants) {
            const welcomeMessage = groupData.welcomeMessage || 'Welcome @user to @group!\n\nWe now have @count members.\n\n@desc';

            // Replace placeholders
            const formattedMessage = welcomeMessage
                .replace('@user', `@${participant.split('@')[0]}`)
                .replace('@group', groupMetadata.subject)
                .replace('@count', groupMetadata.participants.length.toString())
                .replace('@desc', groupMetadata.desc || 'No description');

            // Send welcome message
            await sendText(sock, id, formatMessage(formattedMessage), {
                mentions: [participant]
            });
        }

        logger.info(`Welcome message sent to ${participants.length} new members in ${groupMetadata.subject}`);

    } catch (error) {
        logger.error('Error in welcome handler:', error);
    }
};

module.exports = {
    handleAntiLink,
    handleWelcome
};