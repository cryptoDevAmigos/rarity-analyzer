import { calculateRarity } from "./calculate-rarity";
import { INftMetadata } from "./types";
import { promises as fs } from 'fs';
import path from 'path';

export async function generateRarityFiles(dataDirName:string): Promise<void> {
    const files = await fs.readdir(dataDirName, { withFileTypes: true });
    const projectFiles = files.filter(x => x.name.endsWith('.project.json'));
    for(const f of projectFiles){
        const fullProjectFileName = path.join(dataDirName, f.name);
        const fullNftListFileName = fullProjectFileName.replace('.project.json', '.json');

        const nftListFileContent = await fs.readFile(fullNftListFileName, {encoding: 'utf-8' });
        const nftList = JSON.parse(nftListFileContent) as INftMetadata[];
        const rarityResult = calculateRarity(nftList);

        console.log();

        const fullRarityFileName = fullProjectFileName.replace('.project.json', '.rarities.json');
        await fs.writeFile(fullRarityFileName, JSON.stringify(rarityResult, null, 2));
    }
};

const run = async () => {
    const data = await generateRarityFiles('../../data/');
};
run();