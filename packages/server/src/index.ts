import express from 'express';
import { calculateRarity, getProjectMetadata, getTestData, INftProjects, INftRarity } from '@crypto-dev-amigos/common';
import nftProjects from '@crypto-dev-amigos/common/config/nft-projects.json';

const app = express();
const PORT = 8080;
const _nftProjects = [] as INftProjects[];
const _nftProjectsRarities = [];

bootstrapServer();

//TODO: formalize api url like /api/v1/
app.get('/', (req, res) => res.send('Express + TypeScript Server'));
app.get('/testNftRarities/', async (req, res) => {
    console.log('get rarities');

    const data = await getTestData();
    calculateRarity(data).then(
        (nftRarities) => {
            res.status(200).send(nftRarities);
        }
    );    
});

//TODO: Create app.get('/api/v1/projects/:contract') and other query parameters

//NOTE: One quick note for all contestants - think about how to make the tool as widely usable as possible... 
// Think of config options like "Project Logo / Name / Contract Address" etc. -jalil

//TODO: Would like a app.post('/projects/add') that we could have someone upload the contract address (unique id) and apiurl https://intermezzo.tools/projects/add
// Where would we store that data?

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
  console.log(`⚡️[server]: Projects loaded ${_nftProjects.length}`);
});

function bootstrapServer() {    
    loadProjects(nftProjects);
}

function loadProjects(nftProjects: INftProjects[]) {
    //TODO: Keep duplicates out based on contract
    nftProjects.forEach(async (project) => {
        _nftProjects.push(project);

        const data = await getProjectMetadata(project.collectionMetadataFile);
        calculateRarity(data).then(
            (nftRarities) => {
                console.log(`NftRarity added for ${project.name}`)
                _nftProjectsRarities.push(nftRarities);
            }
        );
    });
}