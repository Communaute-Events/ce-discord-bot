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

let doingAlert = false;
export async function alert(data: EventAlert, client: Client) {
    if (doingAlert) return
    doingAlert = true
    await mongo.connect()
    const db: Db = mongo.db("discord")
    const collection = db.collection("servers")

    const servers: DiscordServerInfo[] = await collection.find({ enabled: true }).toArray()
    // Sends in each server
    servers.forEach(async server => {
        if (!server.sources) return
        if (!server.sources.includes(data.guild.id)) return
        if (!server.channel) return
        let channel: Channel;
        try {
            channel = await client.channels.fetch(server.channel)
        } catch (err) {
            // Bot doesn't have access to the channel
            return
        }
        if (!channel.isTextBased()) return
        const embed = new EmbedBuilder()
            .setTitle(`Nouvel Event -    ${data.eventSource.name}`)
            .setDescription(`Un event a été détecté sur le serveur discord __"${data.eventSource.name}"__. Pour plus d'informations, rendez-vous ci-dessous.\n\n`)
            .setFields({ name: "Contenu du message", value: data.message.data.content })
            .setColor(BotInfo.Color)
            .setThumbnail(data.guild.iconUrl)
            .setTimestamp()
        const button = new ButtonBuilder()
            .setStyle(ButtonStyle.Link)
            .setURL(data.message.url)
            .setLabel("Aller à l'annonce")
        const row = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(button)
        try {
            const formattedString: string = `<@&${server.roles[data.eventSource.guildId]}>`
            // const formattedStrings: string[] = Object.values(server.roles).map((roleId) => `<@&${roleId}>`);
            // const formattedString: string = formattedStrings.join(', ');
            channel.send({ content: server.roles ? formattedString : "@here", embeds: [embed], components: [row] })
        } catch (err) {
            // Missing permissions in channel
        }
    })
    doingAlert = false
}