import { BotConfig } from "@src/types";
import { Message } from "discord.js";
import { closeWebsockets, wsConnect } from "..";
const BotInfo: BotConfig = loadYaml("bot/info.yml")

export const event =  {
    name: "messageCreate",
    async execute(message: Message) {
        if (message.content == "!ws reload" && BotInfo.Admins.includes(message.author.id)) {
            message.reply("Closing websockets...")
            closeWebsockets()
            message.reply("Closed websockets. Re-starting...")
            await wsConnect()
            message.reply("Restarted. See")
        }
    }
}