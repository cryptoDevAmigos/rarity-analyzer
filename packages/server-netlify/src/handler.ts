import type { HandlerEvent, HandlerContext } from "@netlify/functions";
import { DiscordCommandConfig, DiscordRegisterCommandsConfig, DiscordRequestConfig, DiscordRequestError, handleDiscordCommand, handleDiscordRequest } from '@crypto-dev-amigos/common-node';

const config: DiscordRequestConfig & DiscordCommandConfig & DiscordRegisterCommandsConfig = {
    baseDataUrl: 'https://openrarity.xyz/data/',
    baseWebUrl: 'https://openrarity.xyz/',
    applicationId: process.env.DISCORD_APPLICATION_ID as string,
    discordPublicKey: process.env.DISCORD_PUBLIC_KEY as string,
    botToken: process.env.DISCORD_BOT_TOKEN as string,
};

export const handleDiscordRoute = async (event:HandlerEvent, context:HandlerContext) => {

    try{
        const result = await handleDiscordRequest({
            config, 
            body: JSON.parse(event.body ?? ''), 
            rawBody: event.body ?? '', 
            getHeader: (name) => event.headers[name]
        });
        return {
            statusCode: 200,
            body: JSON.stringify(result),
        };
    } catch(err) {
        try{
            const error = err as DiscordRequestError;
            if(error.data){
                if(error.data.textResponse){
                    return {
                        statusCode: error.data.statusCode,
                        body: error.data.textResponse,
                    };
                }
                if(error.data.jsonResponse){
                    return {
                        statusCode: error.data.statusCode,
                        body: JSON.stringify(error.data.jsonResponse),
                    };
                }

                return {
                    statusCode: error.data.statusCode,
                    body: 'Error',
                };
            }
        } catch {
            // Ignore
        }

        return {
            statusCode: 500,
            body: 'Oops! Something broke!',
        };
    }
};
