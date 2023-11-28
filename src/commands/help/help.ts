import { HelpCommandConfig } from '@src/types';
import { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } from 'discord.js'
const Theme = loadYaml("bot/info.yml")
const HelpConfig: HelpCommandConfig = loadYaml("commands/help.yml")

// @command
// here cuz otherwise tsc removes it
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
				{ name: "Commandes", value: HelpConfig.Commands.map(cmd => `** **\n**${cmd.name}**\n${cmd.category ? cmd.subcommands.map(sub => "`/" + cmd.command + sub.command + "` : " + sub.description + "\n").join('') + "\n" : "`/" + cmd.command + "` : " + cmd.description + "\n"}`).join('')},
				{ name: "Commandes Admins", value: HelpConfig['Admin Commands'].map(cmd => `** **\n**${cmd.name}**\n${cmd.category ? cmd.subcommands.map(sub => "`/" + cmd.command + sub.command + "` : " + sub.description + "\n").join('') + "\n" : "`/" + cmd.command + "` : " + cmd.description + "\n"}`).join('')},
			)
		await interaction.reply({embeds: [embed], files: [new AttachmentBuilder("src/images/question_mark.png")]});
	}
};