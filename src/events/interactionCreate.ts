import { logging } from "@src/core/utilities";
import { CommandInteraction, REST, Routes } from "discord.js";

export const event =  {
    name: "interactionCreate",
    async execute(interaction: CommandInteraction) {
        if (!interaction.isChatInputCommand()) return;
        const command = interaction.client.commands.get(interaction.commandName)
        if (!command) {
            logging(`No Command found with name "${interaction.commandName}"`, "error");
            return
        }

        // Resets commands for the guild if it has leftover slash commands
        if ("guilds" in command && !interaction.client.commands.find(cmd => {
            return cmd.guilds && cmd.guilds.includes(interaction.guild.id)
        })) {
            const rest = new REST().setToken(process.env.token);
            const data = await rest.put(Routes.applicationGuildCommands(process.env.clientId, interaction.guildId), {
                body: []
            })
            interaction.reply({content: "The slash command you just used doesn't exist anymore.", ephemeral: true})
            return
        }

        try {
            await command.execute(interaction)
            logging(`${interaction.user.globalName} executed the command "${interaction.commandName}" in guild "${interaction.guildId}" at "${new Date().toLocaleString()}"`,"minimal",false)
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