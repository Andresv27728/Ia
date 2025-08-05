import path from 'path';
import fs from 'fs';
import config from '../config.js';

const { Fg } = config;

/**
 * Loads all command plugins from the specified directories.
 * @returns {Map<string, object>} A map where keys are command names and values are the command modules.
 */
export function loadCommands() {
    const commands = new Map();
    const pluginsDir = path.join(config.root, 'plugins');
    const categories = fs.readdirSync(pluginsDir);

    console.log(Fg('blue')('Loading commands...'));

    for (const category of categories) {
        const categoryPath = path.join(pluginsDir, category);
        if (!fs.statSync(categoryPath).isDirectory()) continue;

        const commandFiles = fs.readdirSync(categoryPath).filter(file => file.endsWith('.js'));
        
        for (const file of commandFiles) {
            const filePath = path.join(categoryPath, file);
            try {
                // Use dynamic import for ES Modules
                import(`file://${filePath}`).then(module => {
                    const command = module.default;
                    if (command && command.name) {
                        // Add category to the command object for later use
                        command.category = category;
                        commands.set(command.name, command);
                        console.log(Fg('green')(`  - Loaded '${command.name}' from ${category}`));
                    } else {
                        console.log(Fg('yellow')(`[WARNING] Command in ${file} is missing 'name' or default export.`));
                    }
                }).catch(err => {
                    console.error(Fg('red')(`[ERROR] Failed to load command from ${file}:`), err);
                });
            } catch (err) {
                console.error(Fg('red')(`[ERROR] Synchronous error loading command from ${file}:`), err);
            }
        }
    }
    
    // Note: Due to the async nature of dynamic imports, the map might not be fully populated
    // right after this function returns. We will handle this in the main file.
    // A better approach would be to use Promise.all to wait for all imports.
    
    return commands;
}

/**
 * An improved version of loadCommands that waits for all dynamic imports to complete.
 * @returns {Promise<Map<string, object>>} A promise that resolves with the command map.
 */
export async function loadCommandsAsync() {
    const commands = new Map();
    const pluginsDir = path.join(config.root, 'plugins');
    const categories = fs.readdirSync(pluginsDir);
    const importPromises = [];

    console.log(Fg('blue')('Asynchronously loading commands...'));

    for (const category of categories) {
        const categoryPath = path.join(pluginsDir, category);
        if (!fs.statSync(categoryPath).isDirectory()) continue;
        
        const commandFiles = fs.readdirSync(categoryPath).filter(file => file.endsWith('.js'));

        for (const file of commandFiles) {
            const filePath = path.join(categoryPath, file);
            const promise = import(`file://${filePath}`).then(module => {
                const command = module.default;
                if (command && command.name) {
                    command.category = category;
                    commands.set(command.name, command);
                } else {
                     console.log(Fg('yellow')(`[WARNING] Command in ${file} is missing 'name' or default export.`));
                }
            }).catch(err => {
                console.error(Fg('red')(`[ERROR] Failed to load command from ${file}:`), err);
            });
            importPromises.push(promise);
        }
    }

    await Promise.all(importPromises);
    console.log(Fg('green')(`Successfully loaded ${commands.size} commands.`));
    return commands;
}
