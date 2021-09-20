import { calculateRarity } from "./calculate-rarity";
import { INftMetadata, INftMetadataCollectionDocument, INftProjectMetadataDocument, INftProjectRarityDocument, MISSING_ATTRIBUTE_VALUE, NftAttributes } from "./types";
import { promises as fs } from 'fs';
import path from 'path';

export async function generateRarityFiles({
    dataDirName,
    outDirName,
}:{
    dataDirName:string, 
    outDirName:string,
}): Promise<void> {
    console.log('# generateRarityFiles');

    const files = await fs.readdir(dataDirName, { withFileTypes: true });
    const projectFiles = files.filter(x => x.name.endsWith('.project.json'));
    for(const f of projectFiles){
        try{
            console.log(`# generateRarityFiles: processing ${f.name}`);

            const projectName = f.name.replace('.project.json', '');
            const fullProjectFileName = path.join(dataDirName, f.name);
            const fullNftListFileName = fullProjectFileName.replace('.project.json', '.json');

            await fs.mkdir(path.join(outDirName, projectName), { recursive: true });
            
            // Skip if not changed (use size instead of change time)
            const projectInputFileSize = (await fs.stat(fullProjectFileName)).size;
            const tokensInputFileSize = (await fs.stat(fullNftListFileName)).size;

            const changehash = `${projectInputFileSize}:${tokensInputFileSize}`
            const fullLastChangeHashFileName = path.join(outDirName, projectName, '.lastchangehash');

            try{
                const lastChanged = await fs.readFile(fullLastChangeHashFileName, {encoding:'utf-8'});

                if(lastChanged === changehash){
                    console.log(`# generateRarityFiles: skipped (already calculated) ${f.name}`);
                    continue;
                }
            } catch {
                // Ignore if missing
            }

            const projectFileContent = await fs.readFile(fullProjectFileName, {encoding: 'utf-8' });
            const projectMetadata = JSON.parse(projectFileContent) as INftProjectMetadataDocument;

            const nftListFileContent = await fs.readFile(fullNftListFileName, {encoding: 'utf-8' });
            const nftList = JSON.parse(nftListFileContent) as INftMetadataCollectionDocument;
            const rarityResult = calculateRarity(nftList);

            console.log(`# generateRarityFiles: saving rarities for ${f.name}`);

            // Output project json with token index
            const projectRarity : INftProjectRarityDocument = {
                project: projectMetadata,
                tokens: rarityResult.map(x => ({
                    tokenId: x.nft.id,
                    rank: x.rank,
                    attributes: x.attributeRarities
                        .filter(x=>x.value !== MISSING_ATTRIBUTE_VALUE)
                        .map(a=>({
                            trait_type: a.trait_type,
                            value: a.value,
                            ratioScore: a.ratioScore
                        }))
                        .map(x=>NftAttributes.condense(x))
                })),
            };

            const fullProjectRarityFileName = path.join(outDirName, projectName, 'project.json');
            // await fs.mkdir(path.dirname(fullProjectRarityFileName), { recursive: true });
            await fs.writeFile(fullProjectRarityFileName, JSON.stringify(projectRarity, null, 2));

            // Output collection-rarities
            const fullRarityFileName = path.join(outDirName, projectName, 'collection-rarities.json');
            await fs.writeFile(fullRarityFileName, JSON.stringify(rarityResult, null, 2));

            // Output individual individual tokenId json files
            let i = 0;
            for(const t of rarityResult){
                if(i % 500 === 0){
                    console.log(`${(100 * i/rarityResult.length).toFixed()}%`);
                }

                const tokenRarityFileName = path.join(outDirName, projectName, `${t.nft.id}.json`);
                // await fs.mkdir(path.dirname(tokenRarityFileName), { recursive: true });
                await fs.writeFile(tokenRarityFileName, JSON.stringify(t, null, 2));

                i++;
            }

            console.log(`100%`);

            await fs.writeFile(fullLastChangeHashFileName, changehash);
            console.log(`# generateRarityFiles: Done - ${f.name}`);
        }catch (err){
            console.error(`# generateRarityFiles: ERROR - ${f.name}`);
        }
    }
};

const run = async () => {
    try{
        await generateRarityFiles({
            dataDirName:'../../data/',
            // For debug output to react folder
            // outDirName:'../../packages/client/build/data/',
            outDirName:'../../web/data/',
        });
    }catch(err){
        console.error(err);
    }
};
run();