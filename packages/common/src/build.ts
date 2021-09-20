import { calculateRarity } from "./calculate-rarity";
import { INftMetadata } from "./types";
import { promises as fs } from 'fs';
import path from 'path';

export async function generateRarityFiles({
    dataDirName,
    outDirName,
}:{
    dataDirName:string, 
    outDirName:string,
}): Promise<void> {
    const files = await fs.readdir(dataDirName, { withFileTypes: true });
    const projectFiles = files.filter(x => x.name.endsWith('.project.json'));
    for(const f of projectFiles){
        const projectName = f.name.replace('.project.json', '');
        const fullProjectFileName = path.join(dataDirName, f.name);
        const fullNftListFileName = fullProjectFileName.replace('.project.json', '.json');

        const nftListFileContent = await fs.readFile(fullNftListFileName, {encoding: 'utf-8' });
        const nftList = JSON.parse(nftListFileContent) as INftMetadata[];
        const rarityResult = calculateRarity(nftList);

        console.log();

        const fullRarityFileName = fullProjectFileName.replace('.project.json', '.rarities.json');
        await fs.writeFile(fullRarityFileName, JSON.stringify(rarityResult, null, 2));

        // Break apart the output into individual json files
        for(const t of rarityResult){
            const tokenRarityFileName = path.join(outDirName, projectName, `${t.nft.id}.json`);
            await fs.mkdir(path.dirname(tokenRarityFileName), { recursive: true });
            await fs.writeFile(tokenRarityFileName, JSON.stringify(t, null, 2));
        }
    }
};

const run = async () => {
    const data = await generateRarityFiles({
        dataDirName:'../../data/',
        // For debug output to react folder
        outDirName:'../../packages/client/build/data/',
        // outDirName:'../../web/data/',
    });
};
run();