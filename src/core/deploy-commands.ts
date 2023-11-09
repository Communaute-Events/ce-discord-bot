import * as fs from 'fs';
import path from 'path';
import * as ts from 'ts-node';
import importSync from 'import-sync';
import { SlashCommandBuilder, REST, Routes, Collection, Snowflake } from 'discord.js';
import { ansi, logging, spinner } from './utilities';

const loggingConfig = loadYaml("logging.yml")

ts.register();

interface Command {
    data: SlashCommandBuilder,
    execute: Function,
    guilds?: string[]
}

function scanCommands(directory: string, log = true): Command[] {
    const results: Command[] = [];

    function scanDirectory(dir: string) {
        const files = fs.readdirSync(dir);

        for (const file of files) {
            const filePath = path.join(dir, file);
            const stats = fs.statSync(filePath);

            if (stats.isDirectory()) {
                // Recursively scan subdirectories
                scanDirectory(filePath);
            } else if (stats.isFile() && filePath.endsWith('.ts')) {
                try {
                    // Load the TypeScript file using ts-node
                    const module = importSync(filePath)
                    if (module.default && module.default.data && module.default.execute) {
                        results.push(module.default);
                    } else {
                        if (loggingConfig.unstructuredCommandWarning && log) {
                            logging(`The command at %bold%${filePath}%end%%yellow% doesn't have a %underline%'data' or 'execute'%end%%yellow% property. It will not be loaded.`, "warn")
                        }
                    }
                } catch (error) {
                    // Handle potential errors when loading TypeScript files
                    console.log(ansi(`%light_red%%bold%✗ Error processing file: ${filePath}%end%`));
                    console.log(error);
                }
            }
        }
    }

    scanDirectory(directory);
    return results;
}

function getCommandObjects(logging?: boolean) {
    const commandsPath = path.join(path.dirname(__dirname), 'commands');
    const commandFiles = scanCommands(commandsPath, logging)
    return commandFiles
}

export function getCommands() {
    const commands = new Collection()
    getCommandObjects(false).map((cmd) => {
        commands.set(cmd.data.name, cmd)
    })
    return commands
}

export async function deployCommands() {
    const rest = new REST().setToken(process.env.BOT_TOKEN);
    let spin = spinner("Clearing global commands cache...", "blue")
    try {
        await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
            body: []
        })
        spin.stop()
        logging("Cleared global commands cache!", "success")
    } catch (error) {
        spin.stop()
        logging("An error occured when trying to clear the global commands cache\n" + error, "error")
    }

    const commands = getCommandObjects()
    const guildCommands = new Collection()
    const globalCommands = []
    // Save guild commands in a collection, and global commands in an array
    for (const command of commands) {
        if ("guilds" in command) {
            let didError = false
            let errorMessage: string;
            for (const guild of command.guilds) {
                let currentGuildCommands = []
                if (guild in guildCommands) {
                    currentGuildCommands = guildCommands.get(guild) as any
                }
                try {
                    currentGuildCommands.push(command.data.toJSON())
                } catch (error) {
                    errorMessage = error
                }
                guildCommands.set(guild, currentGuildCommands)
            }
            if (didError) {
                logging(`(/) Exception occured while loading "${command.data.name}":\n${errorMessage}`, "error")
            }
        } else {
            try {
                globalCommands.push(command.data.toJSON())
            } catch (error) {
                logging(`(/) Exception occured while loading "${command.data.name}":\n${error}`, "error")
            }
        }
    }
    // Reload guild commands
    spin = spinner(`(/) Reloading commands for ${guildCommands.size} guilds...`,"yellow")
    guildCommands.forEach(async (guildCmd, guildId: string) => {
        try {
            const data = await rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, "" + guildId), {
                body: guildCmd
            })

        } catch (error) {
            spin.clear()
            logging(`(/) Exception occured while refreshing commands for "${guildId}":\n${error}`, "error")
            spin.render()
        }
    })
    spin.stop()
    logging(`(/) Reloaded guild-specific commands for ${guildCommands.size} guilds.`,"success")

    // Reload global commands
    spin = spinner(`(/) Reloading ${globalCommands.length} global commands`, "yellow")
    try {
        const data = await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
            body: globalCommands
        })
        spin.stop()
        logging(`(/) Reloaded ${globalCommands.length} global commands`, "success")
    } catch (error) {
        spin.stop()
        logging(`(/) Exception occured while reloading the global commands:\n${error}`, "error")
    }
}