// Pre-run scripts
import "@core/globals"
import 'dotenv/config'

// File imports
import { ansi, logging } from "@core/utilities"
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

function checkWs(ws: WebSocket) {
    if (ws.readyState != WebSocket.OPEN) {
        logging(`WebSocket connection has been established. The bot is operational.`,"success")
    } else {
        setTimeout(checkWs,500)
    }
}

let isReconnecting;

async function wsConnect() {
    function wsError(error) {
        if (isReconnecting) return
        isReconnecting = true
        logging(`WebSocket error, retrying to connect in 10 seconds.\n${error}: ${error.message}`, "error");
        // Retry after 10 seconds
        setTimeout(wsConnect, 10000);
    }

    isReconnecting = false
    try {
        const response = await fetch("https://raw.githubusercontent.com/Communaute-Events/paths/main/paths.json", {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        });

        const res = await response.json();
        const ws = new WebSocket(res.websocket)

        checkWs(ws)

        ws.on("message", msg => {
            try {
                const data = JSON.parse(msg.toString());
                if ("_type" in data && data._type === "event") {
                    alert(data, client);
                }
            } catch (error) {
                logging(`Error in ws:\n${error}`,"error");
            }
        });

        ws.on("close", (code, reason) => {
            wsError({message: reason})
        });

        ws.on("error", error => {
            wsError(error)
        });
    } catch (error) {
        wsError({message: error})
    }
}

client.once(Events.ClientReady, async(c) => {
    logging("Init. Client...","info")
	logging(ansi(`Logged in as %bold%${c.user.tag}%end%%light_green%!%end%`),"success");
    logging(`Initalizing Events...`,"info")
    await initEvents(c)
    logging(`Started deploying slash commands...`,"info")
    await deployCommands()
    logging(`All slash commands have been deployed.`,"success")
    logging(`Connecting to the Event Websocket`,"info")
    wsConnect()
});

// Login, needs to be at the bottom
client.login(process.env.token);