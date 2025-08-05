import { Boom } from '@hapi/boom';
import makeWASocket, {
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion
} from '@whiskeysockets/baileys';
import pino from 'pino';
import qrcode from 'qrcode-terminal';
import chalk from 'chalk';
import figlet from 'figlet';
import fs from 'fs';
import { loadCommandsAsync } from './lib/loader.js';
import { handleMessage } from './lib/handler.js';
import { checkVipExpirations } from './lib/database.js';

// --- LOGGER SETUP ---
const logger = pino({
    level: 'info',
    transport: {
        target: 'pino-pretty',
        options: {
            colorize: true,
            ignore: 'pid,hostname',
            translateTime: 'SYS:standard'
        }
    }
});

// --- BANNER ---
console.log(chalk.green(figlet.textSync('YuruYuri-MD', {
    font: 'Standard',
    horizontalLayout: 'full'
})));
console.log(chalk.yellow('      - A WhatsApp Bot by Im-Ado & Jules -'));


// --- MAIN CONNECTION FUNCTION ---
async function connectToWhatsApp() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');
    const { version, isLatest } = await fetchLatestBaileysVersion();
    logger.info(`Using WA v${version.join('.')}, isLatest: ${isLatest}`);

    const sock = makeWASocket({
        version,
        auth: state,
        printQRInTerminal: true,
        logger: pino({ level: 'silent' }), // Use 'info' for verbose logging
        browser: ['YuruYuri-MD', 'Chrome', '1.0.0'],
    });

    // --- CONNECTION EVENTS ---
    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr } = update;

        if (qr) {
            logger.info('QR code received, scan with your phone.');
            qrcode.generate(qr, { small: true });
        }

        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect.error instanceof Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
            logger.warn(`Connection closed due to: ${lastDisconnect.error}, reconnecting: ${shouldReconnect}`);

            if (shouldReconnect) {
                connectToWhatsApp();
            } else {
                logger.error('Connection closed. You have been logged out. Please delete the auth_info_baileys folder and restart.');
            }
        } else if (connection === 'open') {
            logger.info('Connection opened successfully!');
            logger.info(`Logged in as: ${sock.user.name || sock.user.id}`);

            // Periodically check for VIP expirations (e.g., every 5 minutes)
            setInterval(() => {
                checkVipExpirations(sock);
            }, 5 * 60 * 1000);
        }
    });

    const commands = await loadCommandsAsync();

    // --- MESSAGE HANDLING ---
    sock.ev.on('messages.upsert', (m) => {
        handleMessage(sock, m, commands);
    });

    return sock;
}

// --- START THE BOT ---
connectToWhatsApp().catch(err => {
    logger.fatal('Failed to start the bot:', err);
});

// --- HANDLE UNCAUGHT EXCEPTIONS ---
process.on('uncaughtException', (err) => {
    logger.fatal('Uncaught Exception:', err);
    // Optional: Graceful shutdown logic
});
