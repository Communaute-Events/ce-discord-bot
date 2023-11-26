// Pre-run scripts
import "@core/globals"
import 'dotenv/config'

// File imports
import { ansi, spinner, logging } from "@core/utilities"
import { deployCommands, getCommands } from "@core/deploy-commands"
import { initEvents } from "./core/events"
import { alert } from "./alerts/hander"

// Imports
import { Client, Events, GatewayIntentBits } from "discord.js"
import { WebSocket } from "ws"
import fetch from "cross-fetch"

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
    logging(`All slash commands have been deployed.`,"success")
    logging(`Connecting to the Event Websocket`,"info")
    await fetch("https://raw.githubusercontent.com/Communaute-Events/paths/main/paths.json",{
        method: "GET",
        headers: { "Content-Type": "application/json" }
    }).then(res => res.json().then(res => {
        const ws = new WebSocket(res.websocket)
        ws.on("message",msg => {
            try {
                const data = JSON.parse(msg.toString())
                if ("_type" in data && data._type == "event") {
                    alert(data, client)
                }
            } catch (error) {
                console.log(`Error in ws:\n${error}`)
            }
        })
    }))
    logging(`Connection to the websocket has been established. The bot is ready to run!`,"success")
});

// Login, needs to be at the bottom
client.login(process.env.token);