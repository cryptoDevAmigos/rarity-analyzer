export const enum DiscordApplicationCommandType {
	/** has options */
    ChatInput = 1,
    /** no options */
    User,
    /** in context menu, no options, includes message as context */
    Message, 
}
export enum DiscordApplicationCommandOptionType {
	Subcommand = 1,
	SubcommandGroup,
	String,
	Integer,
	Boolean,
	User,
	Channel,
	Role,
	Mentionable,
	Number,
}

export type DiscordChatCommandOption = {
    /** Like a parameter name */
    name: string,
    description: string,
    type: DiscordApplicationCommandOptionType,
    required: boolean,
    choices?: {
        name: string,
        value:string,
    }[],
};

export type DiscordApplicationCommand = {
    command: string,
    description: string,
    options?: DiscordChatCommandOption[],
    /** Added */
    example: string,
};


export const discordRootCommand = {
    name: 'openrarity',
    description: `Explorer NFT attribute rarity`,
};
export const discordCommands = [
    // {
    //     command: 'help' as const,
    //     description: 'List these commands',
    //     example: '/openrarity help',
    // },
    {
        command: 'projects' as const,
        description: 'List the NFT projects',
        example: '/openrarity projects',
    },
    {
        command: 'project' as const,
        description: 'Get a project by projectKey',
        example: '/openrarity project example',
        options: [
            {
                name: 'project-key',
                type: DiscordApplicationCommandOptionType.String,
                description: 'The projectKey of a project (listed by the list command)',
                required: true,
            },
        ],
    },
    {
        command: 'nft' as const,
        description: 'Get an nft by tokenId (will use the default projectKey if not previded)',
        example: `/openrarity nft 42\n/openrarity nft example 42`,
        options: [
            {
                name: 'project-key',
                type: DiscordApplicationCommandOptionType.String,
                description: 'The projectKey of a project (listed by the list command)',
                required: true,
            },
            {
                name: 'token-id',
                type: DiscordApplicationCommandOptionType.String,
                description: 'The tokenId of the nft',
                required: true,
            },
        ],
    }
];
const _check : DiscordApplicationCommand[] = discordCommands;
export type DiscordCommandKind = typeof discordCommands[number]['command'];

export type DiscordRequestBody = {
    type: number,
    data?: {
        name: 'openrarity',
        options: [{
            name: DiscordCommandKind,
            options: ({
                name: 'project-key',
                value: string,
            }|{
                name: 'token-id',
                value: string,
            })[],
        }],
    },
};