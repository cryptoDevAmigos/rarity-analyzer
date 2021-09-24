import express from 'express';
import { handleDiscordCommand, DiscordCommandKind } from '@crypto-dev-amigos/common-node';

const app = express();
const PORT = 8080;

//TODO: formalize api url like /api/v1/
app.get('/', (req, res) => res.send('Express + TypeScript Server'));

app.get('/test/discord', async (req, res) => {
    const result = await handleDiscordCommand({command: ((req.params as Record<string,string>)['command'] ?? '') as DiscordCommandKind});
    res.json(result);
});
app.post('/api/v1/discord', async (req, res) => {
    const result = await handleDiscordCommand({command: 'help'});
    res.json(result);
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

