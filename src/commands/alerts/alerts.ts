// @command
import { SlashCommandBuilder, ChannelType, PermissionFlagsBits, ChatInputCommandInteraction } from 'discord.js'
import { changeState, setChannel, pickSource, roles } from './functions';

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
        )
        .addSubcommandGroup(subcommand =>
            subcommand
                .setName("roles")
                .setDescription("Séléctionne les rôles à ping lors d'un event.")
                .addSubcommand(subcommand =>
                    subcommand
                        .setName("add")
                        .setDescription("Ajoute le rôle séléctionné")
                        .addRoleOption(option =>
                            option
                                .setRequired(true)
                                .setName("role")
                                .setDescription("Le rôle à ajouter")
                        )
                )
                .addSubcommand(subcommand =>
                    subcommand
                        .setName("remove")
                        .setDescription("Retire le rôle séléctionné.")
                        .addRoleOption(option =>
                            option
                                .setRequired(true)
                                .setName("role")
                                .setDescription("Le rôle à supprimer")
                        )
                )
        ),
    async execute(interaction: ChatInputCommandInteraction) {
        switch (interaction.options.getSubcommandGroup()) {
            default: switch (interaction.options.getSubcommand()) {
                case "setchannel": setChannel(interaction); break;
                case "enable": changeState(interaction, true); break;
                case "disable": changeState(interaction, false); break;
                case "pick": pickSource(interaction); break;
            }
            case "roles": switch (interaction.options.getSubcommand()) {
                case "add": roles(interaction,true); break;
                case "remove": roles(interaction,false); break;
            }
        }

    }
};