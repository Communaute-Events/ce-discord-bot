import { AutocompleteInteraction } from "discord.js";
import { logging } from "@src/core/utilities";

export async function autocomplete(interaction: AutocompleteInteraction) {
    const command = interaction.client.commands.get(interaction.commandName)
    if (!("autocomplete" in command)) {
        logging(`No 'autocomplete' function found in the command "${command.name}"`,"error")
        return
    }
    await command.autocomplete(interaction)
    return
}