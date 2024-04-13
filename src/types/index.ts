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

// export interface RolesConfig {
//     'Roles': {
//         name: string
//         emoji: string,
//         id: string
//     }[]
//     'Event Roles': {
//         name: string
//         emoji: string,
//         id: string
//     }[]
// }

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

// DiscoHooks
export interface DiscoHook {
    content:     string;
    embeds:      Embed[];
    attachments: any[];
}

export interface Embed {
    title:       string;
    description: string;
    color:       number;
    fields?:     Field[];
}

export interface Field {
    name:  string;
    value: string;
}