import { SlashCommandBuilder } from 'discord.js'

export default {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Sends some help'),
	async execute(interaction) {
		await interaction.reply('Help is coming!');
	},
	guilds: [
		"1171557764703723611"
	]
};