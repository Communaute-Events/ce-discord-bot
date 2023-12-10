import { BotConfig } from "@src/types";
import { Message } from "discord.js";
import { reconnectWebsocket } from "..";
const BotInfo: BotConfig = loadYaml("bot/info.yml")

export const event =  {
    name: "messageCreate",
    async execute(message: Message) {
        if (message.content == "!ws reload" && BotInfo.Admins.includes(message.author.id)) {
            message.reply("Restarting websockets.")
            await reconnectWebsocket()
            message.reply("Websocket should be up. See the console.")
        }
    }
}