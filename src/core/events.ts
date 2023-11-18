import path from "path"
import fs from "fs"
import { logging } from "./utilities";
import { Client } from "discord.js";

export async function initEvents(client: Client) {
    // takenm from @create-discord-bot
    const eventsPath = path.join(path.dirname(__dirname), "events");
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