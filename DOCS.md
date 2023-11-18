# Discord Dev Env Docs

Here lies every cool features you can use

## Logging

You can log things to the console with different symbols (check marks, cross, etc...) and colors using the **logging** function in `@src/core/utilities`
```ts
import { logging } from "@src/core/utilities"

logging("Client is logged in!","success")
// > ✓ Client is logged in! (green color)

logging("Be careful!!","warn")
// > [WARN] Be careful!! (yellow color)

logging("An error has occured","error")
// > ✖ An error has occured (red color)

logging("Here's some tips:","info")
> // ℹ Here's some tips: (blue color)
```

All output made using **logging** is saved into a log file located in the `logs` folder. This folder is created at runtime.

## Slash Commands

To register a slash command, create a file in `@src/commands` with this format:
```ts
// @command
import { SlashCommandBuilder } from 'discord.js'

export default {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(interaction) {
		await interaction.reply('Pong!');
	}
};
```
You can see that there is a "**// @command**" at the top of the file. This indicates that the file should be treated as a slash command.
You also need a data and execute property (see [discordjs.guide](https://discordjs.guide/slash-commands/advanced-creation.html#adding-options)).

## Events

Events are used to react to certain things (a new message is received, etc...). To create an event, you must create a file in `@src/events` like this:
```ts
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
```
This file will listen for interactions, and execute some logic. The **name** property of the file must be sent to the event name, and the code must be placed in the **async execute** function.

## Ansi formatting

You can use the **ansi** function in the `@src/core/utilities.ts` file to make your strings colorful!
```ts
import { ansi } from "@src/core/utilities"

console.log(ansi("%yellow%%bold%This string is yellow and bold!%end%"))
```
Here are all the colors:
```ts
const colors = {
  black: "\x1b[0;30m",
  red: "\x1b[0;31m",
  green: "\x1b[0;32m",
  brown: "\x1b[0;33m",
  blue: "\x1b[0;34m",
  purple: "\x1b[0;35m",
  cyan: "\x1b[0;36m",
  light_gray: "\x1b[0;37m",
  dark_gray: "\x1b[1;30m",
  light_red: "\x1b[1;31m",
  light_green: "\x1b[1;32m",
  yellow: "\x1b[0;33m",
  light_yellow: "\x1b[1;33m",
  light_blue: "\x1b[1;34m",
  light_purple: "\x1b[1;35m",
  light_cyan: "\x1b[1;36m",
  light_white: "\x1b[1;37m",
  bold: "\x1b[1m",
  faint: "\x1b[2m",
  italic: "\x1b[3m",
  underline: "\x1b[4m",
  blink: "\x1b[5m",
  negative: "\x1b[7m",
  crossed: "\x1b[9m",
  end: "\x1b[0m",
  bg_gray: "\x1b[100m"
};
```