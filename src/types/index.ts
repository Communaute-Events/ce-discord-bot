import { ObjectId } from "mongodb"

export interface EventSource {
    name: string,
    guildId: string,
    admins: string[],
    roles: string[],
    description: string,
    emoji: string
}

// Config

export interface BotConfig {
    'App Name': string
    Color: `#${string}`,
    Admins: string[]
}

export interface HelpCommandCategory {
    name: string,
    command: string,
    category: boolean,
    description: string,
    subcommands?: {
        command: string,
        description: string
    }[]
}
export interface HelpCommandConfig {
    Commands: HelpCommandCategory[],
    'Admin Commands': HelpCommandCategory[]
}

// Mongo
export interface DiscordServerInfo {
    _id: ObjectId
    id?: string,
    channel?: string,
    enabled?: boolean,
    sources?: string[],
    roles?: { [id: string]: string }
}