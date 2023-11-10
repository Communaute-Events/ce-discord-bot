import { SlashCommandBuilder } from 'discord.js'

export default {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Sends some help'),
	async execute(interaction) {
		await interaction.reply('Help is coming!');
	},
	guilds: [
		// Put your guild ids here! This is for guild specifics commands. Make sure it is a string!!!!
		""
	]
};