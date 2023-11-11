import { EmbedBuilder } from "discord.js";
import { ThemeConfig } from "@src/@types/config";
const Theme: ThemeConfig = loadYaml("theme.yml")

export const HelpEmbed = new EmbedBuilder()
    .setTitle("Menu d'aide")
    .setColor(Theme.mainColor)
    .setDescription("Voici un menu d'aide pour Communauté Events.")
    .addFields(
        { name: "Commandes", value: "- /help: Montre ce message"}
    )