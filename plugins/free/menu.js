import config from '../../config.js';

export default {
    name: 'menu',
    desc: 'Displays the list of available commands.',
    usage: `${config.prefix}menu`,

    async execute({ sock, from, msg, commands, isOwner, isPremium }) {
        const { botName, prefix, owner } = config;

        let menuText = `*${botName}* 🤖\n\n`;
        menuText += `Hello! I am a WhatsApp bot created to assist you.\n\n`;
        menuText += `*Prefix:* ${prefix}\n`;
        menuText += `*Owner:* wa.me/${owner[0]}\n`;
        menuText += `*Status:* ${isPremium ? '👑 Premium User' : '👤 Free User'}\n\n`;
        menuText += `Here are the available commands:\n`;

        const categories = {};

        // Group commands by category
        for (const [name, command] of commands.entries()) {
            if (!categories[command.category]) {
                categories[command.category] = [];
            }
            categories[command.category].push(command);
        }

        // --- FREE COMMANDS ---
        if (categories.free) {
            menuText += `\n*─「 👤 FREE 」─*\n`;
            categories.free.forEach(cmd => {
                menuText += `• ${prefix}${cmd.name}\n`;
            });
        }

        // --- ADMIN COMMANDS ---
        if (categories.admin) {
            menuText += `\n*─「 👮‍♂️ ADMIN 」─*\n`;
            categories.admin.forEach(cmd => {
                menuText += `• ${prefix}${cmd.name}\n`;
            });
        }

        // --- PREMIUM & OWNER COMMANDS (Conditional) ---
        if (isPremium || isOwner) {
            if (categories.premium) {
                menuText += `\n*─「 👑 PREMIUM 」─*\n`;
                categories.premium.forEach(cmd => {
                    menuText += `• ${prefix}${cmd.name}\n`;
                });
            }
        }

        if (isOwner) {
             if (categories.owner) {
                menuText += `\n*─「 🔑 OWNER 」─*\n`;
                categories.owner.forEach(cmd => {
                    menuText += `• ${prefix}${cmd.name}\n`;
                });
            }
        }

        if (!isPremium && !isOwner) {
            menuText += `\n_Upgrade to Premium to access more commands!_`;
        }

        await sock.sendMessage(from, { text: menuText }, { quoted: msg });
    }
};
