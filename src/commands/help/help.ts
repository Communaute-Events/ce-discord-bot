// @command
import { SlashCommandBuilder, Interaction, MessageInteraction, CommandInteraction, AttachmentBuilder } from 'discord.js'
import { HelpEmbed } from "../../embeds/HelpEmbed"

export default {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription("Montre le menu d'aide"),
	async execute(interaction: Interaction & MessageInteraction & CommandInteraction) {
		interaction.reply({ embeds: [HelpEmbed.setThumbnail("attachment://question_mark.png")], files: [new AttachmentBuilder("src/img/question_mark.png")]})
	}
};