// @command
import { SlashCommandBuilder } from 'discord.js'

export default {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Sends some help'),
	async execute(interaction) {
		await interaction.reply('Help is coming!');
	},
	guilds: [
		// Here put your guild ids as STRINGS ("<guildId>"). Otherwise it will not work.
	]
};