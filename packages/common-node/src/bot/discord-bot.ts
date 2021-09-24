
const discordCommands = [
    {
        command: 'list',
        description: 'List the NFT projects',
    },
    {
        command: 'help',
        description: 'List these commands',
    }
] as const;

export type DiscordCommandKind = typeof discordCommands[number]['command'];

export const handleDiscordCommand = async ({ command }:{ command: DiscordCommandKind }) => {
    console.log('#handleDiscordCommand', { command });


    if( command === 'list' ){

    }

    return {
        message: `${discordCommands.map(x => 
`${x.command}: ${x.description}
`).join('')}
        
        `,
    };
};