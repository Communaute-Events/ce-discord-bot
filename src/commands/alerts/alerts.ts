// @command
import { SlashCommandBuilder, ChannelType, PermissionFlagsBits, ChatInputCommandInteraction, AutocompleteInteraction } from 'discord.js'
import { changeState, setChannel, pickSource, info, getSources, bind } from './functions';
import { EventSource } from '@src/types';

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
        // .addSubcommand(subcommand =>
        //     subcommand
        //         .setName("panel")
        //         .setDescription("Envoie le panel de séléction de rôles")
        // )
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
        )
        .addSubcommandGroup(subcommand =>
            subcommand
                .setName("roles")
                .setDescription("Séléctionne les rôles à ping lors d'un event.")
                .addSubcommand(subcommand =>
                    subcommand
                        .setName("unbind")
                        .setDescription("Retire un rôle à ping pour un certain event.")
                        .addRoleOption(option =>
                            option
                                .setName("role")
                                .setDescription("Le rôle à détacher")
                                .setRequired(true)
                        )
                )
                .addSubcommand(subcommand =>
                    subcommand
                        .setName("bind")
                        .setDescription("Défini un rôle à ping pour un certain event.")
                        .addRoleOption(option =>
                            option
                                .setName("role")
                                .setDescription("Le rôle à attacher")
                                .setRequired(true)
                        )
                        .addStringOption(option =>
                            option
                                .setName("event")
                                .setDescription("La source de l'event")
                                .setAutocomplete(true)
                                .setRequired(true)
                        )
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("info")
                .setDescription("Montre les paramètres des alertes.")
        ),
    async execute(interaction: ChatInputCommandInteraction) {
        switch (interaction.options.getSubcommandGroup()) {
            default: switch (interaction.options.getSubcommand()) {
                case "setchannel": setChannel(interaction); break;
                case "enable": changeState(interaction, true); break;
                case "disable": changeState(interaction, false); break;
                case "pick": pickSource(interaction); break;
                case "info": info(interaction); break;
            }
            case "roles": switch (interaction.options.getSubcommand()) {
                // case "add": roles(interaction,true); break;
                // case "remove": roles(interaction,false); break;
                case "bind": bind(interaction, true); break;
                case "unbind": bind(interaction, false); break;
            }
        }

    },
    async autocomplete(interaction: AutocompleteInteraction) {
        const focusedOption = interaction.options.getFocused(true)
        const choices = (await getSources()).map(src => ({ name: src.name, value: src.guildId }))
        const filtered = choices.filter(choice => choice.name.toLowerCase().startsWith(focusedOption.value.toLowerCase()));
        await interaction.respond(filtered)
    }
};