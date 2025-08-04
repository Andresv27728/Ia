/**
 * Core functions for processing messages and commands
 */

const fs = require('fs-extra');
const path = require('path');
const util = require('util');
const { parseMessage, getMessageMetadata, downloadMedia, sendText, sendReaction, formatMessage } = require('./connect');
const { getUserData, getGroupData, setPremium, isPremium } = require('./database');
const settings = require('../config/settings');
const logger = require('../utils/logger');

/**
 * Check command permission level
 * @param {Object} plugin - The plugin object
 * @param {Object} metadata - The message metadata
 * @returns {{hasPermission: boolean, message: string}} - Permission status and message
 */
const checkPermission = (plugin, metadata) => {
    // Owner has access to everything
    if (metadata.isOwner) {
        return { hasPermission: true };
    }

    // Check for owner-only commands
    if (plugin.isOwner) {
        return { hasPermission: false, message: 'This command can only be used by the bot owner.' };
    }

    // Check for premium commands
    if (plugin.category.startsWith('premium')) {
        if (!isPremium(metadata.senderNumber)) {
            return { hasPermission: false, message: 'This is a premium command. Please upgrade to use it.' };
        }
    }

    // Check for group-only commands
    if (plugin.isGroup && !metadata.isGroup) {
        return { hasPermission: false, message: 'This command can only be used in a group.' };
    }

    // Check for admin commands in groups
    if (plugin.isGroupAdmin && metadata.isGroup) {
        if (!metadata.isGroupAdmin) {
            return { hasPermission: false, message: 'You must be a group admin to use this command.' };
        }
        if (!metadata.isBotAdmin) {
            return { hasPermission: false, message: 'I must be a group admin to execute this command.' };
        }
    }

    return { hasPermission: true };
};

/**
 * Process incoming messages
 * @param {Object} sock - The socket connection
 * @param {Object} msg - Incoming message
 * @param {Object} plugins - Loaded plugins
 */
const processMessage = async (sock, msg, plugins) => {
    try {
        // Skip status broadcasts and messages without content
        if (msg.key.remoteJid === 'status@broadcast' || !msg.message) return;
        
        // Parse message content
        const { content, type } = parseMessage(msg);
        if (!content) return;
        
        // Get message metadata
        const metadata = getMessageMetadata(msg);
        
        // Get user data
        const userData = await getUserData(metadata.senderNumber);
        userData.isOwner = metadata.isOwner;
        
        // Set user as admin if in a group and is admin
        if (metadata.isGroup) {
            const groupData = await getGroupData(metadata.from);
            const groupAdmins = groupData.admins || [];
            userData.isAdmin = groupAdmins.includes(metadata.sender);
        }
        
        // Check if message is a command
        const prefix = settings.bot.prefix;
        if (!content.startsWith(prefix)) return;
        
        // Parse command and arguments
        const [cmd, ...args] = content.slice(prefix.length).trim().split(' ');
        const command = cmd.toLowerCase();
        
        const plugin = plugins[command];
        // Check if command exists
        if (!plugin) {
            // Optional: Add a message for unknown commands
            // await sendText(sock, metadata.from, formatMessage(`Unknown command: ${command}`));
            return;
        }
        
        // Check permission
        const permission = checkPermission(plugin, metadata);
        if (!permission.hasPermission) {
            await sock.sendMessage(metadata.from, { text: formatMessage(`🔒 ${permission.message}`, false) }, { quoted: msg });
            return;
        }
        
        // Show typing indicator
        if (settings.message.auto_typing) {
            await sock.presenceSubscribe(metadata.from);
            await sock.sendPresenceUpdate('composing', metadata.from);
        }
        
        // Mark message as read
        if (settings.message.read_messages) {
            await sock.readMessages([msg.key]);
        }
        
        // Execute command
        logger.info(`Executing command: ${command} by ${metadata.senderNumber}`);
        await sendReaction(sock, metadata.from, msg.key, '⏳');
        
        try {
            // Create context object
            const ctx = {
                sock,
                message: msg,
                args,
                metadata,
                userData,
                downloadMedia: () => downloadMedia(sock, msg)
            };
            
            // Execute the plugin
            await plugins[command].execute(ctx);
            await sendReaction(sock, metadata.from, msg.key, '✅');
        } catch (error) {
            logger.error(`Error executing command ${command}: ${error.stack}`);
            await sendReaction(sock, metadata.from, msg.key, '❌');
            await sendText(sock, metadata.from, formatMessage(`Error executing command: ${error.message}`));
        }
        
    } catch (error) {
        logger.error(`Error processing message: ${error.stack}`);
    }
};

/**
 * Get human-readable file size
 * @param {Number} bytes - File size in bytes
 * @returns {String} - Human-readable file size
 */
const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;
};

/**
 * Format time duration
 * @param {Number} seconds - Duration in seconds
 * @returns {String} - Formatted duration
 */
const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    return [
        hours > 0 ? `${hours}h` : '',
        minutes > 0 ? `${minutes}m` : '',
        `${secs}s`
    ].filter(Boolean).join(' ');
};

module.exports = {
    checkPermission,
    processMessage,
    formatFileSize,
    formatDuration
};