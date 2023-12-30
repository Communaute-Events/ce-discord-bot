// @command
import { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder, time } from 'discord.js'
import { botInfo } from '@src/index';
import { getSources } from '../alerts/functions';
const Theme = loadYaml("bot/info.yml")

// @command
// here cuz otherwise tsc removes it
export default {
	data: new SlashCommandBuilder()
		.setName('info')
		.setDescription('Montre des informations à propos du bot'),
	async execute(interaction) {
        const desc = `
        **Events Helper** par  <:ce:1184928871984926781>  Communauté Events
        
        __WebSocket__
        Status de la connection au WebSocket: ${botInfo.websocket ? '✅' : '❌'}
        Dernière connection: ${time(new Date())}

        __Sources__
        ${(await getSources()).map(src => `${src.emoji} - **${src.name}**\n`)}
        __Autres__
        Version du bot: \`${process.env.npm_package_version? process.env.npm_package_version : '? Inconnu'}\`
        Serveur du support: https://commu.events/discord
        `

		const embed = new EmbedBuilder()
			.setTitle("Informations sur le bot")
			.setColor(Theme.Color)
			.setThumbnail("attachment://question_mark.png")
			.setDescription(desc)
		await interaction.reply({embeds: [embed], files: [new AttachmentBuilder("src/images/question_mark.png")]});
	}
};