import { DiscordCommandConfig } from "./discord-bot";
import nacl from 'tweetnacl';

export type DiscordRequestConfig = DiscordCommandConfig & {
    discordPublicKey: string
};

export type DiscordRequestBody = {
    type: number,
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


    return {
        
    };
};
