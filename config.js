import chalk from 'chalk';
import { fileURLToPath } from 'url';
import path from 'path';

// --- GET ROOT PATH ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.join(__dirname, '..'); // Assuming config.js is in a subdirectory

// --- BOT SETTINGS ---
const botName = 'YuruYuri-MD';
const owner = ['5219999999999']; // Replace with your number
const prefix = '!';
const channel = 'https://github.com/Im-Ado/Yuru-Yuri';

// --- STICKER METADATA ---
const packname = 'YuruYuri-MD';
const author = 'Jules';

// --- LOGGING & CONSOLE ---
const Fg = (color) => chalk.bold.fg(color);
const Bg = (color) => chalk.bold.bg(color);

// --- EXPORT CONFIGURATION ---
export default {
    botName,
    owner,
    prefix,
    channel,
    packname,
    author,
    root,
    Fg,
    Bg,
    // Add other settings as needed
    api: {
        lolhuman: 'YOUR_API_KEY', // Example for API keys
    },
    database: {
        path: path.join(root, 'database', 'database.json')
    }
};
