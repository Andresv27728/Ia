import fs from 'fs/promises';
import path from 'path';
import config from '../config.js';

const { Fg } = config;
const dbPath = path.join(config.root, 'database', 'vips.json');

let vipData = new Map();

/**
 * Loads the VIP database from the JSON file into memory.
 */
async function loadVipDatabase() {
    try {
        const data = await fs.readFile(dbPath, 'utf-8');
        const json = JSON.parse(data);
        vipData = new Map(Object.entries(json));
        console.log(Fg('green')('VIP database loaded successfully.'));
    } catch (error) {
        if (error.code === 'ENOENT') {
            console.log(Fg('yellow')('vips.json not found, creating a new one.'));
            await saveVipDatabase();
        } else {
            console.error(Fg('red')('[ERROR] Failed to load VIP database:'), error);
        }
    }
}

/**
 * Saves the current in-memory VIP data to the JSON file.
 */
async function saveVipDatabase() {
    try {
        const obj = Object.fromEntries(vipData);
        await fs.writeFile(dbPath, JSON.stringify(obj, null, 2));
    } catch (error) {
        console.error(Fg('red')('[ERROR] Failed to save VIP database:'), error);
    }
}

/**
 * Adds or updates a user's VIP status.
 * @param {string} userId - The user's ID (e.g., '1234567890').
 * @param {number} days - The number of days to grant VIP access.
 */
export async function addVip(userId, days) {
    const expiration = Date.now() + (days * 24 * 60 * 60 * 1000);
    vipData.set(userId, { expires: expiration });
    await saveVipDatabase();
    console.log(`VIP status for ${userId} set to expire in ${days} days.`);
}

/**
 * Checks if a user is currently a VIP.
 * @param {string} userId - The user's ID.
 * @returns {boolean} True if the user is a VIP, false otherwise.
 */
export function isVip(userId) {
    if (!vipData.has(userId)) {
        return false;
    }
    const { expires } = vipData.get(userId);
    return Date.now() < expires;
}

/**
 * Periodically checks for and handles expired VIPs.
 * @param {object} sock - The Baileys socket instance.
 */
export async function checkVipExpirations(sock) {
    console.log(Fg('blue')('Checking for expired VIPs...'));
    const now = Date.now();
    let changed = false;

    for (const [userId, data] of vipData.entries()) {
        if (now >= data.expires) {
            vipData.delete(userId);
            changed = true;
            console.log(Fg('yellow')(`VIP expired for ${userId}, removing.`));
            try {
                const userJid = `${userId}@s.whatsapp.net`;
                await sock.sendMessage(userJid, { text: '😔 Your VIP subscription has expired. Please contact the owner to renew.' });
            } catch (e) {
                console.error(Fg('red')(`[ERROR] Failed to send expiration message to ${userId}:`), e);
            }
        }
    }

    if (changed) {
        await saveVipDatabase();
    }
}

// Initial load of the database
loadVipDatabase();
