// Plugin que envía audio
const path = require('path');
const { sendMedia } = require('../utils/sendMedia');

const command = {
    name: 'enviaraudio',
    aliases: ['audio', 'sound'],
    description: 'Envía un audio de prueba.',
    async execute(message, args, platform, client) {
        const recipientId = message.chatId || message.from; // Adjust based on platform
        const audioPath = path.join(__dirname, '..', 'media', 'audio.mp3');
        try {
            await sendMedia(platform, recipientId, audioPath, 'audio', 'Escucha este audio!');
            console.log(`Audio enviado a ${recipientId} en ${platform}`);
        } catch (error) {
            console.error(`Error al enviar audio en ${platform}:`, error);
        }
    }
};

module.exports = command;
