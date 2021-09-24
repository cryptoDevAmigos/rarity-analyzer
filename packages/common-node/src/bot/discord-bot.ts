import { INftProjectsDocument } from '@crypto-dev-amigos/common';
import fetch from 'node-fetch';

const discordCommands = [
    {
        command: 'help',
        description: 'List these commands',
    },
    {
        command: 'list',
        description: 'List the NFT projects',
    },
    {
        command: 'project',
        description: 'Get a project by project key',
    }
] as const;

export type DiscordCommandConfig = {
    /** https://www.openrarity.xyz/data/ */
    baseDataUrl: string,
};
export type DiscordCommandKind = typeof discordCommands[number]['command'];
export type DiscordCommand = {
    kind: DiscordCommandKind;
    projectKey?: string;
};

export const handleDiscordCommand = async ({ config, command }:{ config: DiscordCommandConfig, command: DiscordCommand }) => {
    console.log('#handleDiscordCommand', { command });

    const baseDataUrl = config.baseDataUrl.replace(/\/?$/,'');

    if( command.kind === 'list' ){
        const result = await fetch(`${baseDataUrl}/projects.json`)
        const json = await result.json() as INftProjectsDocument;
        return {
            kind: command,
            projects: json,
        };
    }
    if( command.kind === 'project' ){
        const { projectKey } = command;
        if(!projectKey){
            return {
                kind: command,
                error: `You must enter a projectKey`,
            };
        }

        try{
            const result = await fetch(`${baseDataUrl}/${projectKey}/project.json`)
            const json = await result.json() as INftProjectsDocument;
            return {
                kind: command,
                projects: json,
            };
        }catch{
            return {
                kind: command,
                error: `Could not find project: ${projectKey}`,
            };
        }
    }

    return {
        kind: 'help',
        message: `${discordCommands.map(x => 
`${x.command}: ${x.description}
`).join('')}
        
        `,
    };
};