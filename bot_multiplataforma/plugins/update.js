// Comando de actualización (solo owner)
const { isOwner } = require('../utils/checkOwner');
const { exec } = require('child_process');

const command = {
    name: 'update',
    aliases: ['actualizar'],
    description: 'Actualiza el bot desde el repositorio Git (solo owner).',
    async execute(message, args, platform, client) {
        const userId = message.senderId || message.from.id; // Adjust based on platform
        const recipientId = message.chatId || message.from;

        if (!isOwner(String(userId))) {
            const replyText = "Este comando solo puede ser ejecutado por el Owner.";
            console.log(`[${platform}] Unauthorized update attempt by ${userId}. Replying to ${recipientId}: ${replyText}`);
            // Placeholder for sending reply: e.g., message.reply(replyText);
            return;
        }

        const replyText = "Actualizando el bot...";
        console.log(`[${platform}] Sending to ${recipientId}: ${replyText}`);
        // Placeholder for sending reply: e.g., message.reply(replyText);

        exec('git pull', (error, stdout, stderr) => {
            if (error) {
                console.error(`Error en git pull: ${error.message}`);
                const errorReply = `Error al actualizar: ${error.message}`;
                // Placeholder for sending reply: e.g., message.reply(errorReply);
                return;
            }
            if (stderr) {
                console.warn(`Stderr en git pull: ${stderr}`);
                // Potentially send stderr as a message if it's relevant
            }
            const successReply = `Actualización completada:\n\`\`\`${stdout}\`\`\`\nReinicia el bot para aplicar los cambios.`;
            console.log(`[${platform}] Sending to ${recipientId}: ${successReply}`);
            // Placeholder for sending reply: e.g., message.reply(successReply);
        });
    }
};

module.exports = command;
