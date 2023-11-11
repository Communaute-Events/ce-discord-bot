import { logging } from "../../core/utilities";
import { CommandInteractionOptionResolver, ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { Db, MongoClient, ServerApiVersion } from "mongodb";
import { ThemeConfig } from '../../@types/config';
const Theme: ThemeConfig = loadYaml("theme.yml")

const mongo = new MongoClient(process.env.MONGO_URI, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

export async function setChannel(interaction: ChatInputCommandInteraction) {
    try {
        await mongo.connect()

    const db: Db = mongo.db("discord")

    const collection = db.collection("servers")
    await collection.updateOne(
        { id: interaction.guild.id },
        { $set: { channel: interaction.options.getChannel("channel").id}},
        { upsert: true}
    )
    } catch (error) {
        logging("MongoDB exception:\n" + error, "error")
        mongo.close()
    } finally {
        mongo.close()
    }
    interaction.reply({embeds: [new EmbedBuilder()
        .setTitle("Salon mis-à-jour!")
        .setDescription(`Les alertes d'évents seront maintenant envoyées dans <#${interaction.options.getChannel("channel").id}>!`)
        .setColor(Theme.mainColor)
        ],ephemeral: true})
}