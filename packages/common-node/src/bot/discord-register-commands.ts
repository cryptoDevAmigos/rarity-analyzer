import fetch, { Headers } from 'node-fetch';
import { DiscordApplicationCommandOptionType, DiscordApplicationCommandType, discordCommands, discordRootCommand } from './discord-types';

export type DiscordRegisterCommandsConfig = {
    applicationId: string,
    botToken: string,
};

type DiscordRegisterGuildOptions = {
    guildId: string;
    defaultProjectKey: string;
};

export const registerDiscordSlashCommands = async ({ config, guild }:{ config: DiscordRegisterCommandsConfig, guild?: DiscordRegisterGuildOptions }) => {

    const globalDiscordUrl = `https://discord.com/api/v8/applications/${config.applicationId}/commands`;
    const guildDiscordUrl = `https://discord.com/api/v8/applications/${config.applicationId}/guilds/${guild?.guildId}/commands`;

    const registrationUrl = guild ? guildDiscordUrl : globalDiscordUrl;

    const data = {
        ...discordRootCommand,
        options: discordCommands.map(c => ({
            type: DiscordApplicationCommandOptionType.Subcommand,
            name: c.command,
            description: c.description,
            options: c.options,
        })),
    };

    const body = JSON.stringify(data);
    const headers = new Headers();
    headers.set('Authorization',`Bot ${config.botToken}`);
    headers.set('Content-Type','application/json');

    const result = await fetch(registrationUrl, { 
        body: body, 
        method:'POST',
        headers,
    });

    const resultJson =  await result.json();

    console.log('registerDiscordSlashCommands', { 
        status: result.status, 
        body: JSON.stringify(resultJson, null, 2), 
        guild, 
        data, 
        result });




    return {
        message: guild ? `Registered in ${guild.guildId} with ${guild.defaultProjectKey}`
            : 'Registered Globally'
        //message: `Registered in ${guild.guildId} with ${guild.defaultProjectKey}`
    };
};

// url = "https://discord.com/api/v8/applications/<my_application_id>/commands"
// # This is an example CHAT_INPUT or Slash Command, with a type of 1
// const json = {
//     "name": "blep",
//     "type": 1,
//     "description": "Send a random adorable animal photo",
//     "options": [
//         {
//             "name": "animal",
//             "description": "The type of animal",
//             "type": 3,
//             "required": True,
//             "choices": [
//                 {
//                     "name": "Dog",
//                     "value": "animal_dog"
//                 },
//                 {
//                     "name": "Cat",
//                     "value": "animal_cat"
//                 },
//                 {
//                     "name": "Penguin",
//                     "value": "animal_penguin"
//                 }
//             ]
//         },
//         {
//             "name": "only_smol",
//             "description": "Whether to show only baby animals",
//             "type": 5,
//             "required": False
//         }
//     ]
// }