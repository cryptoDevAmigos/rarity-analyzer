import { INftProjectMetadata, INftProjectRarityDocument, INftProjectsDocument, INftRarityDocument } from '@crypto-dev-amigos/common';
import fetch from 'node-fetch';
import { DiscordApplicationCommandOptionType, DiscordApplicationCommand, DiscordCommandKind, discordCommands } from './discord-types';

export type DiscordCommandConfig = {
    /** https://www.openrarity.xyz/data/ */
    baseDataUrl: string,
    /** https://www.openrarity.xyz/ */
    baseWebUrl: string;
};
export type DiscordCommand = {
    kind: DiscordCommandKind;
    projectKey?: string;
    tokenId?: string;
};

const getProjectSummary = ({baseWebUrl, projectKey, projectMetadata}:{baseWebUrl:string, projectKey:string, projectMetadata: INftProjectMetadata}) => {
return `${projectKey}:
${baseWebUrl}/${projectKey}/
${projectMetadata.description}
`
};
const getNftSummary = ({baseWebUrl, projectKey, tokenId, nft}:{baseWebUrl:string, projectKey:string, tokenId:string, nft: INftRarityDocument}) => {
return `${projectKey}: #${nft.nft.id}
${baseWebUrl}/${projectKey}/${tokenId}/

- Rank: ${nft.rank}
- Score: ${nft.rarityScore.toFixed(2)}

### Attributes

\`\`\`
Commonality
${nft.attributeRarities.map(x => `- [${
    [...new Array(Math.floor(x.ratio*10))].map(x=>'%').join('').padStart(10,'.')
}]${
    (100*x.ratio).toFixed(1).padStart(5,' ')
}% - ${x.trait_type}:${x.value}` ).join('\n')}
\`\`\`

### Description

${nft.nft.description}
`
};

export const handleDiscordCommand = async ({ config, command }:{ config: DiscordCommandConfig, command: DiscordCommand }) => {
    console.log('#handleDiscordCommand', { command });

    const baseDataUrl = config.baseDataUrl.replace(/\/?$/,'');
    const baseWebUrl = config.baseWebUrl.replace(/\/?$/,'');

    const {kind, projectKey, tokenId} = command;

    if( kind === 'projects' ){
        const result = await fetch(`${baseDataUrl}/projects.json`)
        const projects = await result.json() as INftProjectsDocument;
        return {
            kind,
            message: `OpenRarity\n${baseWebUrl}\n\n` + projects.projects.map(x => getProjectSummary({baseWebUrl,...x})).join('\n\n'),
            // link: `${baseWebUrl}/`,
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
            const project = await result.json() as INftProjectRarityDocument;
            return {
                kind,
                message: `${getProjectSummary({baseWebUrl, projectKey, projectMetadata: project.project})}`,
                // link: `${baseWebUrl}/${projectKey}/`,
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
            const nft = await result.json() as INftRarityDocument;
            return {
                kind,
                message: `${getNftSummary({baseWebUrl, projectKey, tokenId, nft})}`,
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