// Plugin que muestra el menú

const command = {
    name: 'menu',
    aliases: ['help', 'commands'],
    description: 'Muestra el menú de comandos disponibles.',
    async execute(message, args, platform, client) {
        const recipientId = message.chatId || message.from; // Adjust based on platform
        const menuText = `
╭─「 Menú de Comandos 」
│ ➤ *enviarimagen* - Envía una imagen.
│ ➤ *enviaraudio* - Envía un audio.
│ ➤ *enviarvideo* - Envía un video.
│ ➤ *menu* - Muestra este menú.
│ ➤ *update* - (Solo Owner) Actualiza el bot.
╰────
        `.trim();

        // Placeholder for sending a text message. This will need platform-specific implementation.
        console.log(`[${platform}] Sending menu to ${recipientId}:\n${menuText}`);

        // Example of how you might send a message (actual implementation will vary)
        if (platform === 'whatsapp' && client && typeof client.sendMessage === 'function') {
            // await client.sendMessage(recipientId, { text: menuText });
        } else if (platform === 'telegram' && client && typeof client.telegram.sendMessage === 'function') {
            // await client.telegram.sendMessage(recipientId, menuText);
        }
        // Add other platforms as needed
    }
};

module.exports = command;
