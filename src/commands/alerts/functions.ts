import { logging } from "../../core/utilities";
import { ChatInputCommandInteraction, EmbedBuilder, StringSelectMenuBuilder, ActionRowBuilder, AttachmentBuilder } from "discord.js";
import { Collection, Db, MongoClient, ServerApiVersion } from "mongodb";
import { ThemeConfig } from '../../@types/config';
import { EventSource } from "../../@types/sources"
import fetch from "cross-fetch";
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
            { $set: { channel: interaction.options.getChannel("channel").id } },
            { upsert: true }
        )
    } catch (error) {
        logging("MongoDB exception:\n" + error, "error")
        mongo.close()
    } finally {
        mongo.close()
    }
    interaction.reply({
        embeds: [new EmbedBuilder()
            .setTitle("Salon mis-à-jour!")
            .setDescription(`Les alertes d'évents seront maintenant envoyées dans <#${interaction.options.getChannel("channel").id}>!`)
            .setColor(Theme.mainColor)
        ], ephemeral: true
    })
}

export async function changeState(interaction: ChatInputCommandInteraction, state: boolean) {
    try {
        await mongo.connect()

        const db: Db = mongo.db("discord")

        const collection = db.collection("servers")
        await collection.updateOne(
            { id: interaction.guild.id },
            { $set: { enabled: state } },
            { upsert: true }
        )
    } catch (error) {
        logging("MongoDB exception:\n" + error, "error")
        mongo.close()
    } finally {
        mongo.close()
    }
    interaction.reply({
        embeds: [new EmbedBuilder()
            .setTitle("Alertes mises-à-jour!")
            .setDescription(`Les alertes d'évents sont maintenant **${state ? 'activées' : 'désactivées'}**.`)
            .setColor(Theme.mainColor)
        ], ephemeral: true
    })
}

export async function pickSource(interaction: ChatInputCommandInteraction) {
    try {
        await mongo.connect()

        const db: Db = mongo.db("discord")

        const collection: Collection = db.collection("servers")
        const data: any = await collection.findOne({ id: interaction.guild.id })|| {}
        if (!("sources" in data)) {
            data.sources = {}
        }
        const select = new StringSelectMenuBuilder()
            .setCustomId("sources-pick")
            .setPlaceholder("Séléctionnez vos sources")
            .setMinValues(0)

        let sources: EventSource[] = []
        await fetch("https://raw.githubusercontent.com/Communaute-Events/paths/main/paths.json", {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        }).then(res => res.json().then(async (res) => {
            const req2 = await fetch(res.sources, { method: "GET", headers: { "Content-Type": "application/json" } })
            sources = await req2.json()
        }))

        const sourcesArray = []
        sources.forEach(source => {
            sourcesArray.push({
                label: source.name,
                description: source.name
            })
        })

        select.addOptions(sourcesArray)

        interaction.reply({

            components: [new ActionRowBuilder().addComponents(select) as ActionRowBuilder<StringSelectMenuBuilder>], embeds: [new EmbedBuilder()
                .setTitle("Choissisez vos évents")
                .setColor(Theme.mainColor)
                .setDescription("Séléctionnez des serveurs évent depuis la liste ci-dessous.")
                .setThumbnail("attachment://sources.png")
            ], files: [new AttachmentBuilder("../../img/sources.png")]
        })
    } catch (error) {
        interaction.reply("An error occured")
        logging("MongoDB exception:\n" + error, "error")
        mongo.close()
    } finally {
        mongo.close()
    }
}