/**
 * YouTube MP3 Downloader
 * Category: premium/downloads
 */

const ytdl = require('ytdl-core');
const fs = require('fs-extra');
const path = require('path');
const { formatMessage } = require('../../../lib/connect');
const logger = require('../../../utils/logger');
const settings = require('../../../config/settings');

module.exports = {
    name: 'ytmp3',
    desc: 'Downloads audio from a YouTube video.',
    usage: `${settings.bot.prefix}ytmp3 <YouTube_URL>`,
    category: 'premium', // The loader will categorize this under 'premium/downloads'

    execute: async (ctx) => {
        const { sock, from, args, msg } = ctx;

        if (!args[0] || !ytdl.validateURL(args[0])) {
            await sock.sendMessage(from, { text: formatMessage('❌ Please provide a valid YouTube video URL.') }, { quoted: msg });
            return;
        }

        const videoURL = args[0];

        try {
            await sock.sendMessage(from, { text: formatMessage('⬇️ Downloading audio, please wait...') }, { quoted: msg });

            const info = await ytdl.getInfo(videoURL);
            const title = info.videoDetails.title.replace(/[<>:"/\\|?*]+/g, ''); // Sanitize title
            const duration = parseInt(info.videoDetails.lengthSeconds, 10);

            // Optional: Add a duration limit from settings
            // if (duration > (settings.downloads.max_duration || 600)) {
            //     await sock.sendMessage(from, { text: formatMessage(`❌ Video is too long! Max duration is ${(settings.downloads.max_duration || 600) / 60} minutes.`) }, { quoted: msg });
            //     return;
            // }

            const audioFormat = ytdl.chooseFormat(info.formats, { quality: 'highestaudio', filter: 'audioonly' });

            const filePath = path.join(process.cwd(), 'temp', `${title}.mp3`);

            const downloadStream = ytdl(videoURL, { format: audioFormat });
            const writeStream = fs.createWriteStream(filePath);

            downloadStream.pipe(writeStream);

            writeStream.on('finish', async () => {
                logger.info(`Successfully downloaded audio: ${title}`);

                const fileBuffer = await fs.readFile(filePath);

                await sock.sendMessage(from, {
                    audio: fileBuffer,
                    mimetype: 'audio/mpeg',
                    fileName: `${title}.mp3`
                }, { quoted: msg });

                // Clean up the downloaded file
                await fs.unlink(filePath);
            });

            writeStream.on('error', async (err) => {
                logger.error('Error writing audio file:', err);
                await fs.unlink(filePath); // Clean up on error
                await sock.sendMessage(from, { text: formatMessage(`❌ An error occurred during download: ${err.message}`) }, { quoted: msg });
            });

        } catch (error) {
            logger.error('Error in ytmp3 command:', error);
            await sock.sendMessage(from, { text: formatMessage(`❌ An error occurred: ${error.message}`) }, { quoted: msg });
        }
    }
};
