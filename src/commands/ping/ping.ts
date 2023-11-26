// @command
import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js'

export default {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with latency!'),
	async execute(interaction: ChatInputCommandInteraction) {
		await interaction.reply(`Réponse en \`${Math.abs(Date.now() - interaction.createdTimestamp)}ms\`.`);
	}
};