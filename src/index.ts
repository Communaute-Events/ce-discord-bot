// Pre-run scripts
import "@core/globals"
import "@core/globals"
import 'dotenv/config'

// File imports
import { ansi, spinner } from "@core/utilities"
import { deployCommands, getCommands } from "@src/core/deploy-commands"

// Imports
import { Client, Collection, Events, GatewayIntentBits } from "discord.js"

// Main
const client = new Client({intents: [GatewayIntentBits.Guilds]})
client.commands = getCommands()
let spin = spinner("Initializing Client","yellow").start()

client.once(Events.ClientReady, async(c) => {
    spin.stop()
	console.log(ansi(`%light_green%✓ Logged in as %bold%${c.user.tag}%end%%light_green%!%end%`));
    console.log(ansi(`%light_blue%[!] Started deploying slash commands...%end%`))
    await deployCommands()
});

// Login, needs to be at the bottom
client.login(process.env.BOT_TOKEN);