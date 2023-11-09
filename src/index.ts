// Pre-run scripts
import "@core/start"
import "@core/globals"
import 'dotenv/config'

// File imports
import { ansi, spinner, logging } from "@core/utilities"
import { deployCommands, getCommands } from "@core/deploy-commands"
import { execute } from "@core/execute-commands"

// Imports
import { Client, Events, GatewayIntentBits, Interaction } from "discord.js"
import { handleInteractionTypes } from "./interactions/handle-types"

// Main
const client = new Client({intents: [GatewayIntentBits.Guilds]})
client.commands = getCommands()
let spin = spinner("Initializing Client","yellow").start()

client.once(Events.ClientReady, async(c) => {
    spin.stop()
	logging(`Logged in as %bold%${c.user.tag}%end%%light_green%!%end%`,"success");
    logging(`Started deploying slash commands...`,"info")
    await deployCommands()
    logging(`All slash commands have been deployed. The bot is ready to run!`,"success")
});

client.on(Events.InteractionCreate, async(interaction: Interaction)=>{
    if (interaction.isChatInputCommand()) {
        await execute(client,interaction)
    } else {
        handleInteractionTypes(client,interaction)
    }
    
})
// Login, needs to be at the bottom
client.login(process.env.BOT_TOKEN);