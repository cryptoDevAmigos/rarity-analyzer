import { DiscordCommandConfig, handleDiscordCommand } from "./discord-bot";
import nacl from 'tweetnacl';
import { DiscordRequestBody } from "./discord-types";

export type DiscordRequestConfig = DiscordCommandConfig & {
    discordPublicKey: string
};

export class DiscordRequestError extends Error {
    constructor(public data: {statusCode:number, textResponse?: string, jsonResponse?:unknown} ){
        super();
    }
};

export const authenticateDiscordRequest = async ({ config, rawBody, getHeader }:{ config: DiscordRequestConfig, rawBody:string, getHeader:(name:string)=>undefined|string }) =>{

    // Your public key can be found on your application in the Developer Portal
    const PUBLIC_KEY = config.discordPublicKey;

    const signature = getHeader('x-signature-ed25519');
    const timestamp = getHeader('x-signature-timestamp');

    if( !signature || !timestamp){
        console.error('Discord Auth FAILURE - missing headers');
        throw new DiscordRequestError({
            statusCode: 401,
            textResponse: 'invalid request signature',
        });
    }

    console.log(`authenticateDiscordRequest`, {signature, timestamp, rawBody});
    const isVerified = nacl.sign.detached.verify(
        Buffer.from(timestamp + rawBody),
        Buffer.from(signature, 'hex'),
        Buffer.from(PUBLIC_KEY, 'hex')
    );

    if (!isVerified) {
        console.error('Discord Auth FAILURE');
        throw new DiscordRequestError({
            statusCode: 401,
            textResponse: 'invalid request signature',
        });
    }

    console.log('Discord Auth Success');
}

export const handleDiscordRequest = async ({ config, body, rawBody, getHeader }:{ config: DiscordRequestConfig, body: DiscordRequestBody, rawBody:string, getHeader:(name:string)=>undefined|string }) => {
    console.log('\n\n\n# handleDiscordRequest: Start', { body, rawBody });

    // Authenticate
    // https://discord.com/developers/docs/interactions/receiving-and-responding#security-and-authorization
    await authenticateDiscordRequest({config, rawBody, getHeader});


    // Handle Requests
    // https://discord.com/developers/docs/interactions/receiving-and-responding#receiving-an-interaction

    // Handle Ping
    if( body.type === 1){
        console.log('handleDiscordRequest: PING-PONG');
        return {
            type: 1,
        };
    }

    const command = body.data?.options?.[0];
    if(command){

        const kind = command.name;
        const projectKey = command.options?.find(x => x.name === 'project-key')?.value;
        const tokenId = command.options?.find(x => x.name === 'token-id')?.value;

        console.log('command', {kind, projectKey, tokenId, command});
        const result = await handleDiscordCommand({config, command:{kind, projectKey, tokenId}});
        const response = {
            type: 4,
            data: {
                tts: false,
                content: result.message,
                //content: result.message + (result.link ? `\n\n${result.link}`:''),
                // embeds: result.link ? [{
                //     url: result.link,
                // }]:[],
                // allowed_mentions: { parse: [] },
            }
        };
        console.log('command response', {data:response.data});
        return response;
    }
    console.error('handleDiscordRequest: UNKNOWN', {data: body.data});

    return {
        
    };
};
