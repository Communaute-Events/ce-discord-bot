// Pre-run scripts
import "@core/start"
import "@core/globals"
import 'dotenv/config'

// File imports
import { ansi, spinner, logging } from "@core/utilities"
import { deployCommands, getCommands } from "@core/deploy-commands"

// Imports
import { Client, Events, GatewayIntentBits, Interaction } from "discord.js"
import { handleInteractionTypes } from "./interactions/handle-types"
import path from "path"
import fs from "fs"

// Main
const client = new Client({intents: [GatewayIntentBits.Guilds]});
(async()=>{
    client.commands = await getCommands()
})()
let spin = spinner("Initializing Client","yellow").start()

async function initEvents() {
    // takenm from @create-discord-bot
    const eventsPath = path.join(__dirname, "events");
    const eventFiles = fs.readdirSync(eventsPath);
    const eventFilesFiltered = eventFiles.filter((file) => file.endsWith(".js") || file.endsWith(".ts"));

    const length = eventFilesFiltered.length;
    for (let i = 0; i < length; i++) {
        const filePath = path.join(eventsPath, eventFilesFiltered[i]);
        const { event } = await import(filePath);
        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args));
        } else {
            client.on(event.name, (...args) => event.execute(...args));
        }
    }
    logging(`Events have been loaded! [${eventFilesFiltered.toString()}]`,"success")
}

client.once(Events.ClientReady, async(c) => {
    spin.stop()
	logging(`Logged in as %bold%${c.user.tag}%end%%light_green%!%end%`,"success");
    logging(`Initalizing Events...`,"info")
    await initEvents()
    logging(`Started deploying slash commands...`,"info")
    await deployCommands()
    logging(`All slash commands have been deployed. The bot is ready to run!`,"success")
});

// Login, needs to be at the bottom
client.login(process.env.BOT_TOKEN);