import { SlashCommandBuilder } from 'discord.js'
const config = loadYaml("example.yml")

export default {
	data: new SlashCommandBuilder()
		.setName('configexample')
		.setDescription('This command shows a value in the config!'),
	async execute(interaction) {
		await interaction.reply(config.message);
	}
};