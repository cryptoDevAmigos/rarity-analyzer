import express, {Request} from 'express';
import { handleDiscordCommand, DiscordCommandKind, DiscordCommandConfig, DiscordRegisterCommandsConfig, handleDiscordRequest, DiscordRequestError, DiscordRequestConfig, registerDiscordSlashCommands } from '@crypto-dev-amigos/common-node';
import process from 'process';
import dotenv from 'dotenv';

// Load .env file
dotenv.config();

const config: DiscordRequestConfig & DiscordCommandConfig & DiscordRegisterCommandsConfig = {
    baseDataUrl: 'http://localhost:3000/data/',
    baseWebUrl: 'https://openrarity.xyz/',

    /** 
     * Set this in .env file 
     * 
     * https://discord.com/developers/applications/890947995426771015/information
     * */
    applicationId: process.env.DISCORD_APPLICATION_ID as string,
    discordPublicKey: process.env.DISCORD_PUBLIC_KEY as string,
    botToken: process.env.DISCORD_BOT_TOKEN as string,
};

['DISCORD_APPLICATION_ID', 'DISCORD_PUBLIC_KEY', 'DISCORD_BOT_TOKEN'].forEach(x=>{
    if(!!process.env[x]){ return; }

    console.error(`
❗❗❗
~~~ You need to setup .env file with: ${x}=___ ~~~
❗❗❗
`);
});


type ReqWithRawBody = Request & {rawBody:Buffer};

const PORT = 8080;

const app = express();
app.use(express.json({
    verify: (req, res, buf) => {
      (req as ReqWithRawBody).rawBody = buf;
    }
  }));



const logRequest = (endpoint: string, req: Request) => {
    console.log(`\n\n\n# REQUEST '${endpoint}''`, {
        path: req.path,
        params: req.params,
        query: req.query,
        body: req.body,
        cookies: req.cookies,
        headers: req.headers,
    });
};
const logError = (message: string, req: Request, error: unknown) => {
    console.error(`\n\n\n # ERROR '${message}''`, {
        path: req.path,
        error,
    });
};


app.get('/', (req, res) => {
    logRequest('/', req);

    return res.send('Express + TypeScript Server');
});

app.get('/test/register-discord-commands', async (req, res) => {
    logRequest('/test/discord', req);

    try{
        const result = await registerDiscordSlashCommands({config});
        // const result = await registerDiscordSlashCommands({config, guild: {
        //     guildId: '890940593340047371',
        //     defaultProjectKey: 'one-day-punks',
        // }});
        return res.json(result);
    } catch(err) {
        logError('/test/discord',req, err);
        return res.status(500).json({
            message: 'Oops! Something broke!'
        });
    }
});

app.get('/test/discord', async (req, res) => {
    logRequest('/test/discord', req);

    try{
        const result = await handleDiscordCommand({config, command: {
            kind: (req.query['command'] ?? '') as DiscordCommandKind,
            projectKey: req.query['projectKey'] as string,
            tokenId: req.query['tokenId'] as string,
        }});
        return res.json(result);
    } catch(err) {
        logError('/test/discord',req, err);
        return res.status(500).json({
            message: 'Oops! Something broke!'
        });
    }
});

app.post('/api/v1/discord', async (req, res) => {
    logRequest('/api/v1/discord', req);

    try{
        const result = await handleDiscordRequest({config, body: req.body, rawBody: (req as ReqWithRawBody).rawBody.toString('utf-8'), getHeader: (name) => req.header(name)});
        return res.json(result);
    } catch(err) {
        try{
            const error = err as DiscordRequestError;
            if(error.data){
                if(error.data.textResponse){
                    logError('DiscordRequestError: textResponse',req, err);
                    return res.status(error.data.statusCode).end(error.data.textResponse);
                }
                if(error.data.jsonResponse){
                    logError('DiscordRequestError: jsonResponse',req, err);
                    return res.status(error.data.statusCode).json(error.data.jsonResponse);
                }

                logError('DiscordRequestError: unknownResponse',req, err);
                return res.status(error.data.statusCode).end();
            }
        } catch {
            // Ignore
        }

        logError('/api/v1/discord',req, err);
        return res.status(500).json({
            message: 'Oops! Something broke!',
        });
    }
});



// app.get('/data/:projects', async (req, res) => {
//     console.log('get rarities');

//     const data = await getTestData();
//     calculateRarity(data).then(
//         (nftRarities) => {
//             res.status(200).send(nftRarities);
//         }
//     );    
// });

//TODO: Create app.get('/api/v1/projects/:contract') and other query parameters

//NOTE: One quick note for all contestants - think about how to make the tool as widely usable as possible... 
// Think of config options like "Project Logo / Name / Contract Address" etc. -jalil

//TODO: Would like a app.post('/projects/add') that we could have someone upload the contract address (unique id) and apiurl https://intermezzo.tools/projects/add
// Where would we store that data?

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});

