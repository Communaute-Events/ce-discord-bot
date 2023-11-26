import { MongoClient, ServerApiVersion, Db } from "mongodb"
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Channel, ChannelType, Client, EmbedBuilder } from "discord.js";
import { BotConfig, DiscordServerInfo } from "@src/types";
import { EventAlert } from "@src/types/alerts";
const BotInfo: BotConfig = loadYaml("bot/info.yml")

const mongo = new MongoClient(process.env.mongoUri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

export async function alert(data: EventAlert, client: Client) {
    await mongo.connect()
    const db: Db = mongo.db("discord")
    const collection = db.collection("servers")

    const servers: DiscordServerInfo[] = await collection.find({ enabled: true}).toArray()
    // Sends in each server
    servers.forEach(async server => {
        if (!server.sources.includes(data.guild.id)) return
        const channel = await client.channels.fetch(server.channel)
        if (!channel.isTextBased()) return
        const embed = new EmbedBuilder()
            .setTitle(`Nouvel Event - ${data.eventSource.name}`)
            .setDescription(`Un event a été détecté sur le serveur discord "${data.eventSource.name}". Pour plus d'informations, rendez-vous ci-dessous.`)
            .setFields({name: "Contenu du message", value: data.message.data.content})
            .setColor(BotInfo.Color)
            .setThumbnail(data.guild.iconUrl)
            .setTimestamp()
            .setFooter({text: "By Communauté Events - https://github.com/communaute-events"})
        const button = new ButtonBuilder()
            .setStyle(ButtonStyle.Link)
            .setURL(data.message.url)
            .setLabel("Aller à l'annonce")
        const row = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(button)
        channel.send({content: server.roles.map(role => `<@&${role}>`).join(" "),embeds: [embed], components: [row]})
    })
}