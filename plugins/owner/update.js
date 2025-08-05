import { exec } from 'child_process';
import util from 'util';
import config from '../../config.js';

const execAsync = util.promisify(exec);

export default {
    name: 'update',
    desc: 'Updates the bot from its Git repository.',
    usage: `${config.prefix}update`,
    isOwner: true,

    async execute({ sock, from, msg }) {
        try {
            await sock.sendMessage(from, { text: '🔄 Checking for updates...' }, { quoted: msg });

            // Fetch remote changes to see if an update is needed
            const fetchResult = await execAsync('git fetch origin');
            const statusResult = await execAsync('git status -uno');

            if (statusResult.stdout.includes('Your branch is up to date')) {
                return sock.sendMessage(from, { text: '✅ Bot is already up to date.' }, { quoted: msg });
            }

            await sock.sendMessage(from, { text: '⬇️ Pulling updates from repository...' }, { quoted: msg });

            const pullResult = await execAsync('git pull origin main');
            
            let response = `*Update successful!* ✅\n\n\`\`\`${pullResult.stdout}\`\`\`\n\n`;

            // Check if dependencies were updated
            if (pullResult.stdout.includes('package.json')) {
                response += '📦 Dependencies updated. Running `npm install`...\n';
                await sock.sendMessage(from, { text: response }, { quoted: msg });
                
                const installResult = await execAsync('npm install');
                response += `\n\`\`\`${installResult.stdout}\`\`\`\n`;
            }

            response += '\nPlease restart the bot to apply all changes.';
            await sock.sendMessage(from, { text: response }, { quoted: msg });

        } catch (error) {
            console.error('Error in update command:', error);
            await sock.sendMessage(from, { text: `❌ Update failed:\n\n\`\`\`${error.stderr || error.message}\`\`\`` }, { quoted: msg });
        }
    }
};
