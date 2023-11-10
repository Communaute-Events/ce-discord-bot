import { MessageInteraction, Interaction, CommandInteraction, SlashCommandBuilder } from "discord.js"

export interface Command {
    data: SlashCommandBuilder,
    execute: Function,
    guilds?: string[]
}