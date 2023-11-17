// @command
import { SlashCommandBuilder, ChannelType, PermissionFlagsBits, ChatInputCommandInteraction } from 'discord.js'
import { changeState, setChannel, pickSource } from './functions';

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
            case "setchannel": setChannel(interaction); break;
            case "enable": changeState(interaction, true); break;
            case "disable": changeState(interaction, false); break;
            case "pick": pickSource(interaction); break;
        }
    }
};