// @command
import { SlashCommandBuilder } from 'discord.js'

export default {
	data: new SlashCommandBuilder()
		.setName('test')
		.setDescription('test'),
	async execute(interaction) {
		await interaction.reply('test!');
	},
    guilds: [
        "1149082137123880990"
    ]
};