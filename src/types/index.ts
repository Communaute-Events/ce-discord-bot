import { ObjectId } from "mongodb"

export interface EventSource {
    name: string,
    guildId: string,
    admins: string[],
    roles: string[],
    description: string,
    emoji: string
}

export interface BotConfig {
    'App Name': string
    Color: `#${string}`
}

export interface DiscordServerInfo {
    _id: ObjectId
    id?: string,
    channel?: string,
    enabled?: boolean,
    sources?: string[],
    roles?: { [id: string]: string}
}