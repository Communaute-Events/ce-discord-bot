// @command
import { SlashCommandBuilder, ChannelType, PermissionFlagsBits, Embed, EmbedBuilder, ChatInputCommandInteraction, CommandInteractionOptionResolver } from 'discord.js'
import { setChannel } from './functions';

export default {
    data: new SlashCommandBuilder()
        .setName('alerts')
        .setDescription("Configure les alertes d'évents")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand(subcommand =>
            subcommand
                .setName("setchannel")
                .setDescription("Défini le salon dans lequel les alerts seront envoyées")
                .addChannelOption(option =>
                    option.setName("channel")
                        .setDescription("Le salon dans lequel les alertes seront envoyées")
                        .addChannelTypes(ChannelType.GuildText)
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName("enable")
                .setDescription("Active les alertes")
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("disable")
                .setDescription("Désactive les alertes")
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("pick")
                .setDescription("Affiche un menu pour choisir quel events annoncer.")
        ),
    async execute(interaction: ChatInputCommandInteraction) {
        switch (interaction.options.getSubcommand()) {
            case "setchannel": setChannel(interaction)
        }
    }
};