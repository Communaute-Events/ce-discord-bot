import * as fs from 'fs';
import path from 'path';
import * as ts from 'ts-node';
import importSync from 'import-sync';
import { SlashCommandBuilder, REST, Routes, Collection } from 'discord.js';
import { ansi, logging, spinner } from './utilities';

const loggingConfig = loadYaml("logging.yml")

ts.register();

interface Command {
    data: SlashCommandBuilder,
    execute: Function,
    guilds?: string[]
}

function scanCommands(directory: string, log=true): Command[] {
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
                    console.error(ansi(`%light_red%%bold%✗ Error processing file: ${filePath}%end%`));
                    console.error(error);
                }
            }
        }
    }

    scanDirectory(directory);
    return results;
}

function getCommandObjects(logging?: boolean) {
    const commandsPath = path.join(path.dirname(__dirname), 'commands');
    const commandFiles = scanCommands(commandsPath,logging)
    return commandFiles
}

export function getCommands() {
    const commands = new Collection()
    getCommandObjects(false).map((cmd)=>{
        commands.set(cmd.data.name, cmd)
    })
    return commands
}

export async function deployCommands() {
    const rest = new REST().setToken(process.env.BOT_TOKEN);
    let spin = spinner("Clearing global commands cache...","blue")
    try {
        await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
            body: []
        })
        spin.stop()
        logging("Cleared global commands cache!","success")
    } catch (error) {
        spin.stop()
        logging("An error occured when trying to clear the global commands cache\n"+ error,"error")
    }

    const commands = getCommandObjects()
    for (const command of commands) {
        if ("guilds" in command) {
            let spin = spinner(ansi(`(/) Started reloading the "${command.data.name}" command for %underline%${command.guilds.length}%end% guild(s)%end%`), "yellow").start()
            for (const guild of command.guilds) {
                try {
                    const data = await rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, guild), {
                        body: [command.data.toJSON()]
                    })
                } catch (error) {
                    spin.stop()
                    console.log(logging(`(/) Exception occured while loading "${command.data.name}":\n${error}`, "error"))
                }
            }
            spin.stop()
            logging(`(/) Reloaded the "${command.data.name}" command for %underline%${command.guilds.length}%end%%light_green% guild(s)%end%`,"success")
        } else {
            let spin = spinner(ansi(`(/) Started reloading the "${command.data.name}" global command%end%`), "yellow").start()
            try {
                const data = await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
                    body: [command.data.toJSON()]
                })
            } catch (error) {
                spin.stop()
                console.log(logging(`(/) Exception occured while loading "${command.data.name}":\n${error}`, "error"))
            }
            spin.stop()
            logging(`(/) Reloaded the "${command.data.name}" global command.%end%`,"success")
        }
    }
}