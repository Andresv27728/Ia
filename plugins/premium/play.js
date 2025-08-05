import { youtubeSearch, youtubedl } from '@bochilteam/scraper';
import config from '../../config.js';

export default {
    name: 'play',
    desc: 'Downloads and sends the audio of a YouTube video.',
    usage: `${config.prefix}play <song name or YouTube URL>`,
    category: 'premium',

    async execute({ sock, from, args, msg }) {
        const query = args.join(' ');
        if (!query) {
            return sock.sendMessage(from, { text: 'Please provide a song name or YouTube URL.' }, { quoted: msg });
        }

        try {
            await sock.sendMessage(from, { text: `Searching for "${query}"... ⏳` }, { quoted: msg });

            const searchResults = await youtubeSearch(query);
            if (!searchResults || searchResults.length === 0) {
                return sock.sendMessage(from, { text: `No results found for "${query}".` }, { quoted: msg });
            }

            const video = searchResults[0];

            const audio = await youtubedl(video.url);
            if (!audio || !audio.audio || !audio.audio['128kbps']) {
                 return sock.sendMessage(from, { text: 'Could not retrieve audio for the requested video.' }, { quoted: msg });
            }

            const audioUrl = await audio.audio['128kbps'].download();

            await sock.sendMessage(from, {
                image: { url: video.thumbnail },
                caption: `*Title:* ${video.title}\n*Duration:* ${video.durationH}\n*Channel:* ${video.channel}\n\n_Sending audio, please wait..._`
            }, { quoted: msg });

            await sock.sendMessage(from, {
                audio: { url: audioUrl },
                mimetype: 'audio/mpeg'
            }, { quoted: msg });

        } catch (error) {
            console.error('Error in play command:', error);
            await sock.sendMessage(from, { text: `An error occurred: ${error.message}` }, { quoted: msg });
        }
    }
};
