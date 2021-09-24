import { INftProjectsDocument } from '@crypto-dev-amigos/common';
import fetch from 'node-fetch';
import { DiscordApplicationCommandOptionType, DiscordApplicationCommand } from './discord-types';




//     {
//         "name": "animal",
//         "description": "The type of animal",
//         "type": 3,
//         "required": true,
//         "choices": [
//             {
//                 "name": "Dog",
//                 "value": "animal_dog"
//             },
//             {
//                 "name": "Cat",
//                 "value": "animal_cat"
//             },
//             {
//                 "name": "Penguin",
//                 "value": "animal_penguin"
//             }
//         ]
//     },
//     {
//         "name": "only_smol",
//         "description": "Whether to show only baby animals",
//         "type": 5,
//         "required": false
//     }
// ]
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
                name: 'token-id',
                type: DiscordApplicationCommandOptionType.Number,
                description: 'The tokenId of the nft',
                required: true,
            },
            {
                name: 'project-key',
                type: DiscordApplicationCommandOptionType.String,
                description: 'The projectKey of a project (listed by the list command)',
                required: false,
            },
        ],
    }
];
const _check : DiscordApplicationCommand[] = discordCommands;
export type DiscordCommandKind = typeof discordCommands[number]['command'];

export type DiscordCommandConfig = {
    /** https://www.openrarity.xyz/data/ */
    baseDataUrl: string,
};
export type DiscordCommand = {
    kind: DiscordCommandKind;
    projectKey?: string;
    tokenId?: string;
};

export const handleDiscordCommand = async ({ config, command }:{ config: DiscordCommandConfig, command: DiscordCommand }) => {
    console.log('#handleDiscordCommand', { command });

    const baseDataUrl = config.baseDataUrl.replace(/\/?$/,'');

    const {kind, projectKey, tokenId} = command;

    if( kind === 'projects' ){
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