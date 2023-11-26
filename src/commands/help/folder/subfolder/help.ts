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
				{ name: "Commandes", value:
				`**/help**: Affiche ce menu
				**/ping**: Répond avec la latence (en ms) du bot` },
				{ name: "Commandes Admin", value: 
				`**/alerts enable**: Active les alertes
				**/alerts disable**: Désactive les alertes
				**/alerts setchannel**: Défini le channel dans lequel envoyer les alertes
				**/alerts pick**: Menu pour choisir quels serveurs d'events doivent être annoncé
				**/alerts roles add**: Ajoute un rôle à ping
				**/alerts roles remove**: Retire un rôle à ping` }
			)
		await interaction.reply({embeds: [embed], files: [new AttachmentBuilder("src/images/question_mark.png")]});
	}
};