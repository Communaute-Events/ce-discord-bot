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
import { WebSocket } from "ws"
import fetch from "cross-fetch"
import { MongoClient, ServerApiVersion } from "mongodb"

// Main

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
(async()=>{
    client.commands = await getCommands()
})();
let spin = spinner("Initializing Client", "yellow").start()

const mongoClient = new MongoClient(process.env.MONGO_URI, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

client.once(Events.ClientReady, async (c) => {
    spin.stop()
    logging(`Logged in as %bold%${c.user.tag}%end%%light_green%!%end%`, "success");
    logging(`Started deploying slash commands...`, "info")
    await deployCommands()
    logging(`All slash commands have been deployed.`, "success")
    logging("Starting websocket connection...", "info")

    interface UrlPaths {
        websocket: string
    }
    const res = await fetch("https://raw.githubusercontent.com/Communaute-Events/paths/main/paths.json", {
        method: "GET",
        headers: { "Content-Type": "application/json" }
    })
    const urlPaths: UrlPaths = await res.json() as UrlPaths
    const ws = new WebSocket(urlPaths.websocket)

    ws.on("message", (msg) => {
        try {
            const data = JSON.parse(msg.toString())
            if ("_type" in data && data._type == "event") {
                // Alert event
            }
        } catch (error) {
            console.log(`Error in ws:\n${error}`)
        }
    })

    logging(`Websocket connection is up.`, "success")
    logging(`Checking connection to the MongoDB database...`, "info")
    try {
        await mongoClient.connect()
        await mongoClient.db("admin").command({ ping: 1 })
        logging("Established the connection to the MongoDB database.","success")
    } catch (error) {
        logging(`An error happened while connecting to the the MongoDB database:\n${error}`,"error")
    } finally {
        mongoClient.close()
    }


});

client.on(Events.InteractionCreate, async (interaction: Interaction) => {
    if (interaction.isChatInputCommand()) {
        await execute(client, interaction)
    } else {
        handleInteractionTypes(client, interaction)
    }

})
// Login, needs to be at the bottom
client.login(process.env.BOT_TOKEN);