import { logging } from "@src/core/utilities";
import { CommandInteraction, REST, Routes } from "discord.js";

export const event =  {
    name: "interactionCreate",
    async execute(interaction: CommandInteraction) {
        if (!interaction.isChatInputCommand()) return;
        const command = interaction.client.commands.get(interaction.commandName)
        if (!command) {
            const rest = new REST().setToken(process.env.token)
            try {
                // This part deletes any leftover commands in a guild.
                const guildCommands = await interaction.guild.commands.fetch()
                const leftoverCommand = guildCommands.find(cmd => cmd.name == interaction.commandName)
                rest.delete(Routes.applicationGuildCommand(process.env.clientId,interaction.guild.id,leftoverCommand.id))
                    .then(()=> logging(`Deleted leftover command ${interaction.commandName} in guild "${interaction.guild.id}`,"minimal"))
                    .catch(err => logging(`An error occured while deleting left-over command:\n${err}`,"error"))
            } catch (error) {
                logging("An error occured while deleting left-over command:\n" + error,"error")
            }
            interaction.reply({content: "Command is outdated. It cannot be used anymore."})
            return
        }
        if ("allowDms" in command && command.allowDms == false && interaction.inGuild() == false) {
            interaction.reply({ content: "This command is not available in **DMs**.", ephemeral: true})
            return
        }
        if ("allowGuilds" in command && command.allowGuilds == false && interaction.inGuild() == true) {
            interaction.reply({ content: "This command is not available in **Guilds**.", ephemeral: true})
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