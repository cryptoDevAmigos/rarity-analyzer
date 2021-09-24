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
        description: 'Get a project by projectKey',
    },
    {
        command: 'nft',
        description: 'Get an nft by projectKey & tokenId',
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
    tokenId?: string;
};

export const handleDiscordCommand = async ({ config, command }:{ config: DiscordCommandConfig, command: DiscordCommand }) => {
    console.log('#handleDiscordCommand', { command });

    const baseDataUrl = config.baseDataUrl.replace(/\/?$/,'');

    const {kind, projectKey, tokenId} = command;

    if( kind === 'list' ){
        const result = await fetch(`${baseDataUrl}/projects.json`)
        const json = await result.json() as INftProjectsDocument;
        return {
            kind,
            projects: json,
        };
    }
    if( kind === 'project' ){
        if(!projectKey){
            return {
                kind,
                error: `You must enter a projectKey`,
                _raw: command,
            };
        }

        try{
            const result = await fetch(`${baseDataUrl}/${projectKey}/project.json`)
            const json = await result.json() as INftProjectsDocument;
            return {
                kind,
                projects: json,
            };
        }catch{
            return {
                kind,
                error: `Could not find project: ${projectKey}`,
                _raw: command,
            };
        }
    }
    if( kind === 'nft' ){
        if(!projectKey){
            return {
                kind,
                error: `You must enter a projectKey`,
                _raw: command,
            };
        }
        if(!tokenId){
            return {
                kind,
                error: `You must enter a tokenId`,
                _raw: command,
            };
        }

        try{
            const result = await fetch(`${baseDataUrl}/${projectKey}/${tokenId}.json`)
            const json = await result.json() as INftProjectsDocument;
            return {
                kind,
                projects: json,
            };
        }catch{
            return {
                kind,
                error: `Could not find nft: ${projectKey}/${tokenId}`,
                _raw: command,
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