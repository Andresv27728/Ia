// Plugin que envía imagen
const path = require('path');
const { sendMedia } = require('../utils/sendMedia');

const command = {
    name: 'enviarimagen',
    aliases: ['img', 'image'],
    description: 'Envía una imagen de prueba.',
    async execute(message, args, platform, client) {
        // client is the platform-specific client instance (e.g., Baileys sock, Telegraf bot)
        const recipientId = message.chatId || message.from; // Adjust based on platform
        const imagePath = path.join(__dirname, '..', 'media', 'gawr_gura.jpg');
        try {
            await sendMedia(platform, recipientId, imagePath, 'image', 'Aquí tienes una imagen!');
            console.log(`Imagen enviada a ${recipientId} en ${platform}`);
        } catch (error) {
            console.error(`Error al enviar imagen en ${platform}:`, error);
            // Inform user about the error if possible, e.g., message.reply("No se pudo enviar la imagen.")
        }
    }
};

module.exports = command;
