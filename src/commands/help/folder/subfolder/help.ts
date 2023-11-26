// @command
import { SlashCommandBuilder, EmbedBuilder, Embed, AttachmentBuilder } from 'discord.js'
const Theme = loadYaml("bot/info.yml")

export default {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Shows the help menu'),
	async execute(interaction) {
		const embed = new EmbedBuilder()
			.setTitle("Menu d'aide")
			.setColor(Theme.Color)
			.setThumbnail("attachment://question_mark.png")
			.setDescription("Voici une liste des actions proposées par **Event Helper**.")
			.setFields(
				{ name: "Commandes", value: '**/help**: Affiche ce menu\n' }
			)
		await interaction.reply({embeds: [embed], files: [new AttachmentBuilder("src/images/question_mark.png")]});
	}
};