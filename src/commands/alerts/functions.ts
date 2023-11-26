import { logging } from "../../core/utilities";
import { ChatInputCommandInteraction, EmbedBuilder, StringSelectMenuBuilder, ActionRowBuilder, AttachmentBuilder, ComponentType, StringSelectMenuOptionBuilder } from "discord.js";
import { Collection, Db, MongoClient, ServerApiVersion } from "mongodb";
import { BotConfig, DiscordServerInfo } from '@src/types';
import { EventSource } from "@src/types"
import fetch from "cross-fetch";
import emojiRegex from "emoji-regex";
const BotInfo: BotConfig = loadYaml("bot/info.yml")

const mongo = new MongoClient(process.env.mongoUri, {
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
            .setColor(BotInfo.Color)
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
    } finally {
        mongo.close()
    }
    interaction.reply({
        embeds: [new EmbedBuilder()
            .setTitle("Alertes mises-à-jour!")
            .setDescription(`Les alertes d'évents sont maintenant **${state ? 'activées' : 'désactivées'}**.`)
            .setColor(BotInfo.Color)
        ], ephemeral: true
    })
}

export async function pickSource(interaction: ChatInputCommandInteraction) {
    try {
        await mongo.connect()
        const db: Db = mongo.db("discord")

        const collection: Collection = db.collection("servers")
        const savedSources: any[] = (await collection.findOne({ id: interaction.guild.id })).sources || []

        const sources: EventSource[] = await fetch("https://raw.githubusercontent.com/Communaute-Events/paths/main/paths.json", {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        }).then(res => res.json().then(async (res) => {
            return (await fetch(res.sources, { method: "GET", headers: { "Content-Type": "application/json" } })).json()
        })).catch(err => {
            interaction.reply(`An error occured! \`(${interaction.createdTimestamp})\``)
            logging(`An error occured while fetching event sources:\n${err}`, "error")
        })

        const regex = emojiRegex()
        const select = new StringSelectMenuBuilder()
            .setCustomId("sources-pick")
            .setPlaceholder("Séléctionnez vos sources")
            .setMinValues(0)
            .setMaxValues(sources.length)
            .addOptions(sources.map(src => new StringSelectMenuOptionBuilder().setDefault(savedSources.includes(src.guildId)).setDescription(src.description).setLabel(src.name).setEmoji((src.emoji.match(regex) || ['❓'])[0] as string).setValue(src.guildId)))

        const response = await interaction.reply({
            components: [new ActionRowBuilder().addComponents(select) as ActionRowBuilder<StringSelectMenuBuilder>], embeds: [new EmbedBuilder()
                .setTitle("Choissisez vos évents")
                .setColor(BotInfo.Color)
                .setDescription("Séléctionnez des serveurs évent depuis la liste ci-dessous.")
                .setThumbnail("attachment://sources.png")
            ], files: [new AttachmentBuilder("src/images/sources.png")], ephemeral: true
        })

        const collector = response.createMessageComponentCollector({ componentType: ComponentType.StringSelect, time: 3_600_000 })
        collector.on("collect", async i => {
            if (i.customId != "sources-pick") return
            try {
                await mongo.connect()
                const savedSources = i.values
                await collection.updateOne(
                    { id: interaction.guild.id },
                    { $set: { sources: savedSources } },
                    { upsert: true }
                )
                i.reply({
                    content: `Vous serez maintenant notifié des events dans: **${savedSources
                        .map((src) => sources.find((s) => s.guildId === src)?.name)
                        .join("**, **")}**.`, ephemeral: true
                })
            } catch (error) {
                logging(`Error while processing chosen event source:\n${error}`, "error")
            }
        })

    } catch (error) {
        interaction.reply({ content: "An error occured", ephemeral: true })
        logging("MongoDB exception:\n" + error, "error")
    } finally {
        if (mongo) {
            mongo.close()
        }
    }
}

export async function roles(interaction: ChatInputCommandInteraction, operation: boolean) {
    const roleId = interaction.options.getRole("role").id
    try {
        await mongo.connect()
        const db: Db = mongo.db("discord")
        const collection: Collection = db.collection("servers")

        let roles: string[] = (await collection.findOne({ id: interaction.guild.id })).roles || []
        if (operation) {
            roles.push(roleId)
        } else {
            roles = roles.filter(role => role !== roleId)
        }
        await collection.updateOne(
            { id: interaction.guild.id },
            { $set: { roles: [...new Set(roles)] } },
            { upsert: true }
        )
        interaction.reply({content: operation ? `<@&${roleId}> a été **ajouté** à la liste des rôles.` : `<@&${roleId}> a été **retiré** à la liste des rôles.`,ephemeral: true})
    } catch (error) {
        logging(`Error occured while updating guild ping roles:\n${error}`, "error")
    } finally {
        if (mongo) {
            await mongo.close()
        }
    }
}