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