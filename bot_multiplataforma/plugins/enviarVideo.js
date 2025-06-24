// Plugin que envía video
const path = require('path');
const { sendMedia } = require('../utils/sendMedia');

const command = {
    name: 'enviarvideo',
    aliases: ['video', 'vid'],
    description: 'Envía un video de prueba.',
    async execute(message, args, platform, client) {
        const recipientId = message.chatId || message.from; // Adjust based on platform
        const videoPath = path.join(__dirname, '..', 'media', 'video.mp4');
        try {
            await sendMedia(platform, recipientId, videoPath, 'video', 'Mira este video!');
            console.log(`Video enviado a ${recipientId} en ${platform}`);
        } catch (error) {
            console.error(`Error al enviar video en ${platform}:`, error);
        }
    }
};

module.exports = command;
