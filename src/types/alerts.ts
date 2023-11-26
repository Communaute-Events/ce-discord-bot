export interface EventAlert {
    _type:       string;
    eventSource: EventSource;
    message:     Message;
    author:      Author;
    guild:       Guild;
    timeStamp:   Date;
}

export interface Author {
    name: string;
    id:   string;
}

export interface EventSource {
    name:        string;
    description: string;
    emoji:       string;
    guildId:     string;
    admins:      string[];
    roles:       string[];
}

export interface Guild {
    name:    string;
    id:      string;
    iconUrl: string;
}

export interface Message {
    data: Data;
    url:  string;
}

export interface Data {
    channelId:                  string;
    guildId:                    string;
    id:                         string;
    createdTimestamp:           number;
    type:                       string;
    system:                     boolean;
    content:                    string;
    authorId:                   string;
    pinned:                     boolean;
    tts:                        boolean;
    nonce:                      string;
    embeds:                     any[];
    components:                 any[];
    attachments:                any[];
    stickers:                   any[];
    mentions:                   Mentions;
    flags:                      number;
    cleanContent:               string;
}

export interface Mentions {
    everyone:            boolean;
    users:               any[];
    roles:               any[];
    crosspostedChannels: any[];
    members:             any[];
    channels:            any[];
}
