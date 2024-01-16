// @command

import { HelpCommandConfig } from '@src/types';
import { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder, ChatInputCommandInteraction, PermissionFlagsBits, Embed } from 'discord.js'
const Theme = loadYaml("bot/info.yml")
const HelpConfig: HelpCommandConfig = loadYaml("commands/help.yml")
import { DiscoHook } from '@src/types';

// @command
// here cuz otherwise tsc removes it
export default {
	data: new SlashCommandBuilder()
		.setName('premadembed')
		.setDescription('Sends the premade embed')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption(option =>
            option
                .setRequired(true)
                .setName("embed")
                .setDescription("Embed name")),
	async execute(interaction: ChatInputCommandInteraction) {
        let embeds: EmbedBuilder[];
        try {
		    switch (interaction.options.getString("embed")) {
                case "roles":

            }
        } catch (error) {
            await interaction.reply("```" + error + "```")
        }
	},
    guilds: [
        "1171557764703723611"
    ]
};