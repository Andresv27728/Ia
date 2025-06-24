// Main bot file
require('dotenv').config();
const fs = require('fs');
const path = require('path');

const { connectWhatsApp } = require('./whatsapp');
const { connectTelegram } = require('./telegram');
const { connectFacebook } = require('./facebook');
const { connectInstagram } = require('./instagram');

console.log("Bot starting...");

// Initialize commands
const commands = new Map();
const pluginsPath = path.join(__dirname, 'plugins');
const pluginFiles = fs.readdirSync(pluginsPath).filter(file => file.endsWith('.js'));

for (const file of pluginFiles) {
    try {
        const command = require(path.join(pluginsPath, file));
        if (command.name) {
            commands.set(command.name.toLowerCase(), command);
            if (command.aliases && Array.isArray(command.aliases)) {
                command.aliases.forEach(alias => commands.set(alias.toLowerCase(), command));
            }
            console.log(`Loaded command: ${command.name}`);
        } else {
            console.warn(`The command at ${path.join(pluginsPath, file)} is missing a "name" property.`);
        }
    } catch (error) {
        console.error(`Error loading command from ${file}:`, error);
    }
}

// --- Placeholder for a generic message object structure ---
// This will vary greatly between platforms.
// We'll need adapters for each platform to normalize it.
/*
const exampleMessage = {
    platform: 'whatsapp', // 'telegram', 'facebook', 'instagram'
    chatId: 'group_or_user_id', // ID of the chat/user
    senderId: 'user_id_who_sent_message', // ID of the user who sent the message
    text: '!menu', // Full text of the message
    command: 'menu', // Extracted command
    args: [], // Arguments after the command
    timestamp: 1678886400, // Unix timestamp
    // Platform specific original message object can be attached if needed
    // originalMessage: { ... }
};
*/

// --- Basic command handler (conceptual) ---
// This function would be called by each platform's message event handler
async function handleMessage(platform, messageContext, platformClient) {
    // 1. Normalize the incoming message object (platform-specific)
    // For now, we assume messageContext is somewhat normalized or we extract directly
    let text = '';
    let prefix = '';
    let chatId = ''; // This needs to be set by the platform connector
    let senderId = ''; // This needs to be set by the platform connector

    if (platform === 'whatsapp') {
        // Example for Baileys (this is highly dependent on your Baileys setup)
        // text = messageContext.message?.conversation || messageContext.message?.extendedTextMessage?.text || '';
        // chatId = messageContext.key?.remoteJid;
        // senderId = messageContext.key?.participant || messageContext.key?.remoteJid;
        prefix = process.env.WHATSAPP_PREFIX || '!'; // Get prefix from .env or default
    } else if (platform === 'telegram') {
        // Example for Telegraf/Grammy
        // text = messageContext.message?.text || '';
        // chatId = messageContext.chat?.id;
        // senderId = messageContext.from?.id;
        prefix = '/'; // Common prefix for Telegram
    }
    // Add similar blocks for facebook and instagram

    if (!text.startsWith(prefix)) return; // Not a command for this bot

    const args = text.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = commands.get(commandName);

    if (!command) {
        console.log(`[${platform}] Unknown command: ${commandName} from ${senderId} in ${chatId}`);
        return;
    }

    // Construct a simplified message object for the command
    const simplifiedMessage = {
        chatId: String(chatId), // Ensure it's a string
        senderId: String(senderId), // Ensure it's a string
        text: text,
        command: commandName,
        args: args,
        // You might add a reply function here that abstracts platform-specific replies
        // reply: async (text) => { /* platform-specific reply logic */ }
    };

    try {
        console.log(`[${platform}] Executing command: ${commandName} for ${senderId} in ${chatId}`);
        // Pass the platform-specific client if the command needs it
        await command.execute(simplifiedMessage, args, platform, platformClient);
    } catch (error) {
        console.error(`Error executing command ${commandName} on ${platform}:`, error);
        // Optionally, send an error message back to the user
        // await simplifiedMessage.reply("Lo siento, hubo un error al ejecutar ese comando.");
    }
}


async function main() {
    console.log("Initializing platform connections...");

    // Connect to WhatsApp (example, will be further developed in whatsapp.js)
    // const waClient = await connectWhatsApp(handleMessage);
    // if (waClient) console.log("WhatsApp connection initiated.");

    // Connect to Telegram (example, will be further developed in telegram.js)
    // const tgBot = await connectTelegram(handleMessage);
    // if (tgBot) console.log("Telegram connection initiated.");

    // Connect to Facebook (example)
    // await connectFacebook(handleMessage);
    // console.log("Facebook connection initiated (placeholder).");

    // Connect to Instagram (example)
    // await connectInstagram(handleMessage);
    // console.log("Instagram connection initiated (placeholder).");

    console.log("Bot is ready and listening for commands (conceptual).");
    console.log("To make it truly functional, implement connection and message handling in:");
    console.log("- whatsapp.js (e.g., using Baileys)");
    console.log("- telegram.js (e.g., using Telegraf or Grammy)");
    console.log("- facebook.js (e.g., using Facebook Graph API for Messenger)");
    console.log("- instagram.js (e.g., using a library or simulating, be mindful of API terms)");

    console.log("\nLoaded commands:");
    commands.forEach(cmd => {
        console.log(`- ${cmd.name} (${cmd.aliases ? cmd.aliases.join(', ') : 'no aliases'})`);
    });
    console.log(`\nOwner ID: ${process.env.OWNER_ID || 'Not Set'}`);
}

main().catch(console.error);

// Placeholder: In a real scenario, each platform connector (whatsapp.js, telegram.js, etc.)
// would call `handleMessage` when a new message arrives.
// For example, in your Baileys 'messages.upsert' event:
// sock.ev.on('messages.upsert', async m => {
//     const msg = m.messages[0];
//     if (!msg.key.fromMe && m.type === 'notify') {
//         // Create a messageContext object from `msg` that handleMessage understands
//         // For now, we'll just log, as handleMessage needs more specific input
//         // console.log('[WhatsApp] Received raw message:', JSON.stringify(msg, undefined, 2));
//         // handleMessage('whatsapp', msg, sock); // Pass the Baileys socket as platformClient
//     }
// });

// For Telegraf:
// bot.on('text', (ctx) => {
//    // console.log('[Telegram] Received raw message:', JSON.stringify(ctx.message, undefined, 2));
//    // handleMessage('telegram', ctx, bot); // Pass the Telegraf bot instance as platformClient
// });
