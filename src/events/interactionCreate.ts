import { logging } from "@src/core/utilities";
import { CommandInteraction } from "discord.js";

export const event =  {
    name: "interactionCreate",
    async execute(interaction: CommandInteraction) {
        if (!interaction.isChatInputCommand()) return;

        const command = interaction.client.commands.get(interaction.commandName)

        if (!command) {
            logging(`No Command found with name "${interaction.commandName}"`, "error");
            return
        }

        try {
            await command.execute(interaction)
            logging(`${interaction.user.globalName} executed the command "${interaction.commandName}" in guild "${interaction.guildId} at ${new Date().toLocaleString()}`,"minimal",false)
        } catch (error) {
            logging(`There was an error executing "${interaction.commandName}":\n${error}`,"error")
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
            } else {
                await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
            }
        }
    }
}