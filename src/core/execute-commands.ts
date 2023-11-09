import { SlashCommandBuilder, Client, Interaction, MessageInteraction, CommandInteraction } from "discord.js"
import { logging } from "@core/utilities"
import { Command } from "./types"

export const execute = async(client: Client,interaction: Interaction & MessageInteraction & CommandInteraction) => {
    const command: Command = client.commands.get(interaction.commandName)

    if (!command) {
        logging(`No Command found with name "${interaction.commandName}"`,"error")
    }

    try {
        await command.execute(interaction,client)
    } catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
}