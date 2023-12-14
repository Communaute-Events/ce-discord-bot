// @command

import { HelpCommandConfig } from '@src/types';
import { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder, ChatInputCommandInteraction } from 'discord.js'
const Theme = loadYaml("bot/info.yml")
const HelpConfig: HelpCommandConfig = loadYaml("commands/help.yml")
import { DiscoHook } from '@src/types';

// @command
// here cuz otherwise tsc removes it
export default {
	data: new SlashCommandBuilder()
		.setName('embed')
		.setDescription('Sends the embed from the input')
        .addStringOption(option =>
            option
                .setRequired(true)
                .setName("embed")
                .setDescription("Embed data")),
	async execute(interaction: ChatInputCommandInteraction) {
        try {
		    const data: DiscoHook = JSON.parse(interaction.options.getString("embed"))
            await interaction.channel.send({content: data.content, embeds: data.embeds});
            interaction.reply({content: "Sent.", ephemeral: true})
        } catch (error) {
            await interaction.reply("```" + error + "```")
        }
	},
    guilds: [
        "1171557764703723611"
    ]
};