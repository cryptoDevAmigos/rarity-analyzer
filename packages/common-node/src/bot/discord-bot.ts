import { INftProjectsDocument } from '@crypto-dev-amigos/common';
import fetch from 'node-fetch';

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

export type DiscordCommandConfig = {
    /** https://www.openrarity.xyz/data/ */
    baseDataUrl: string,
};
export type DiscordCommandKind = typeof discordCommands[number]['command'];

export const handleDiscordCommand = async ({ config, command }:{ config: DiscordCommandConfig, command: DiscordCommandKind }) => {
    console.log('#handleDiscordCommand', { command });

    const baseDataUrl = config.baseDataUrl.replace(/\/?$/,'');

    if( command === 'list' ){
        const result = await fetch(`${baseDataUrl}/projects.json`)
        const json = await result.json() as INftProjectsDocument;
        return {
            kind: command,
            projects: json,
        };
    }

    return {
        kind: 'help',
        message: `${discordCommands.map(x => 
`${x.command}: ${x.description}
`).join('')}
        
        `,
    };
};