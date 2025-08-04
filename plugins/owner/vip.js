/**
 * VIP command to grant premium access.
 * Category: owner
 */

const { setPremium, getPremiumInfo } = require('../../lib/database');
const { formatMessage } = require('../../lib/connect');
const settings = require('../../config/settings');
const logger = require('../../utils/logger');

module.exports = {
    name: 'vip',
    desc: 'Grants premium access to a user for a specified number of days.',
    usage: `${settings.bot.prefix}vip <number> <days>\nExample: ${settings.bot.prefix}vip 5511987654321 30`,
    isOwner: true, // This flag will be used by the command handler

    /**
     * Execute command
     * @param {Object} ctx - Command context
     */
    execute: async (ctx) => {
        const { sock, args, from, sender, metadata } = ctx;

        if (args.length < 2) {
            const usageText = `❌ Invalid usage.\n\n*Usage:* ${module.exports.usage}`;
            await sock.sendMessage(from, { text: formatMessage(usageText, false) });
            return;
        }

        let targetUser = args[0];
        const days = parseInt(args[1], 10);

        // --- Input Validation ---
        if (isNaN(days)) {
            await sock.sendMessage(from, { text: formatMessage('❌ The number of days must be a valid number.', false) });
            return;
        }

        if (days < settings.premium.min_days || days > settings.premium.max_days) {
            await sock.sendMessage(from, {
                text: formatMessage(`❌ Days must be between ${settings.premium.min_days} and ${settings.premium.max_days}.`, false)
            });
            return;
        }

        // --- Target User Validation ---
        // Remove any special characters from the number
        targetUser = targetUser.replace(/[@\s-]/g, '');
        if (!/^\d+$/.test(targetUser)) {
             await sock.sendMessage(from, { text: formatMessage('❌ Invalid phone number format.', false) });
            return;
        }

        const targetJid = `${targetUser}@s.whatsapp.net`;

        // Check if the user exists on WhatsApp
        const [userExists] = await sock.onWhatsApp(targetJid);
        if (!userExists || !userExists.exists) {
            await sock.sendMessage(from, { text: formatMessage(`❌ The number ${targetUser} is not registered on WhatsApp.`, false) });
            return;
        }

        try {
            // --- Grant Premium ---
            await setPremium(targetUser, days);
            const premiumInfo = getPremiumInfo(targetUser);

            logger.info(`User ${targetUser} has been granted VIP status for ${days} days by owner ${sender}.`);

            // --- Confirmation Messages ---
            // 1. To the owner
            const ownerConfirmation = `✅ *VIP Status Granted*\n\n*User:* ${targetUser}\n*Duration:* ${days} days\n*Expires on:* ${new Date(premiumInfo.expiration * 1000).toLocaleDateString()}`;
            await sock.sendMessage(from, { text: formatMessage(ownerConfirmation, true) });

            // 2. To the new VIP user
            const userNotification = `🎉 *Congratulations! You are now a VIP User!*\n\n*Duration:* ${days} days\n*Benefits:* Full access to all commands, including downloads, games, and more.\n\nEnjoy your premium features!`;
            await sock.sendMessage(targetJid, { text: formatMessage(userNotification, true) });

        } catch (error) {
            logger.error('Error in VIP command:', error);
            await sock.sendMessage(from, { text: formatMessage(`An error occurred while granting VIP status: ${error.message}`, false) });
        }
    }
};
