import * as fs from 'fs';
import path from 'path';
import { SlashCommandBuilder, REST, Routes, Collection, Snowflake } from 'discord.js';
import { ansi, logging, spinner } from './utilities';
const loggingConfig = loadYaml("bot/logging.yml")

interface Command {
    data: SlashCommandBuilder,
    execute: Function,
    guilds?: string[]
}

async function scanCommands(directory: string, log = true): Promise<Command[]> {
    if (log) {
        logging(`Scanning commands in "${directory}"`,"info")
    }

    const results: Command[] = [];

    async function scanDirectory(dir: string) {
        const files = fs.readdirSync(dir);

        for (const file of files) {
            const filePath = path.join(dir, file);
            const stats = fs.statSync(filePath);
            
            if (stats.isDirectory()) {
                // Recursively scan subdirectories
                scanDirectory(filePath);
            } else if (stats.isFile() && (filePath.endsWith('.js') || filePath.endsWith('.ts')) && (fs.readFileSync(filePath,"utf-8").includes("// @command") || fs.readFileSync(filePath,"utf-8").includes("//@command"))) {
                try {
                    // Load the TypeScript file using import
                    const module = await import(filePath)
                    if (module.default && module.default.data && module.default.execute) {
                        results.push(module.default);
                    } else {
                        if (loggingConfig.unstructuredCommandWarning && log) {
                            logging(ansi(`The command at %bold%${filePath}%end%%yellow% doesn't have a %underline%'data' or 'execute'%end%%yellow% property. It will not be loaded.`), "warn")
                        }
                    }
                } catch (error) {
                    logging(`Error processing file: ${filePath}\n${error}`,"error")
                }
            }
        }
    }

    await scanDirectory(directory);
    return results;
}

async function getCommandObjects(logging?: boolean) {
    const commandsPath = path.join(path.dirname(__dirname), 'commands');
    const commandFiles = await scanCommands(commandsPath, logging)
    return commandFiles
}

export async function getCommands() {
    const commands = new Collection()
    await getCommandObjects(false).then(obj => obj.map((cmd) => {
        commands.set(cmd.data.name, cmd)
    }))
    return commands
}

export async function deployCommands() {
    const rest = new REST().setToken(process.env.token);
    let spin = spinner("Clearing global commands cache...", "blue")
    try {
        await rest.put(Routes.applicationCommands(process.env.clientId), {
            body: []
        })
        spin.stop()
        logging("Cleared global commands cache!", "success")
    } catch (error) {
        spin.stop()
        logging("An error occured when trying to clear the global commands cache\n" + error, "error")
    }

    const commands = await getCommandObjects()
    const guildCommands = new Collection()
    const globalCommands = []
    // Save guild commands in a collection, and global commands in an array
    for (const command of commands) {
        if ("guilds" in command) {
            for (const guild of command.guilds) {
                let currentGuildCommands = []
                if (guild in guildCommands) {
                    currentGuildCommands = (guildCommands.get(guild) as any[]).filter(cmd => commands.some(storedCmd => storedCmd.data.name == cmd.name))
                }
                try {
                    if (!currentGuildCommands.find(cmd => cmd.name == command.data.name))
                    currentGuildCommands.push(command.data.toJSON())
                } catch (error) {
                    logging(`(/) Exception occured while loading "${command.data.name}":\n${error}`, "error")
                }
                guildCommands.set(guild, currentGuildCommands)
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
            console.log(guildCmd)
            const data = await rest.put(Routes.applicationGuildCommands(process.env.clientId, "" + guildId), {
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
        const data = await rest.put(Routes.applicationCommands(process.env.clientId), {
            body: globalCommands
        })
        spin.stop()
        logging(`(/) Reloaded ${globalCommands.length} global commands`, "success")
    } catch (error) {
        spin.stop()
        logging(`(/) Exception occured while reloading the global commands:\n${error}`, "error")
    }
}