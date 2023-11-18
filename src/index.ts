// Pre-run scripts
import "@core/globals"
import 'dotenv/config'

// File imports
import { ansi, spinner, logging } from "@core/utilities"
import { deployCommands, getCommands } from "@core/deploy-commands"
import { initEvents } from "./core/events"

// Imports
import { Client, Events, GatewayIntentBits } from "discord.js"

// Main
const client = new Client({intents: [GatewayIntentBits.Guilds]});
(async()=>{
    client.commands = await getCommands()
})()
let spin = spinner("Initializing Client","yellow").start()

client.once(Events.ClientReady, async(c) => {
    spin.stop()
	logging(ansi(`Logged in as %bold%${c.user.tag}%end%%light_green%!%end%`),"success");
    logging(`Initalizing Events...`,"info")
    await initEvents(c)
    logging(`Started deploying slash commands...`,"info")
    await deployCommands()
    logging(`All slash commands have been deployed. The bot is ready to run!`,"success")
});

// Login, needs to be at the bottom
client.login(process.env.token);