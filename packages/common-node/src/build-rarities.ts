import { calculateRarity, INftMetadata, INftMetadataCollectionDocument, INftProjectMetadataDocument, INftProjectRarityDocument, INftProjectsDocument, MISSING_ATTRIBUTE_VALUE, NftAttributes } from "@crypto-dev-amigos/common";
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

    const ordered = [
        'punkscapes',
        'one-day-punks',
        'artblocks-catblocks',
    ];


    const files = await fs.readdir(dataDirName, { withFileTypes: true });
    const projectFiles = files.filter(x => x.name.endsWith('.project.json'));

    const results = await Promise.all(projectFiles.map(async (f) => await buildProjectRarityFiles({
        dataDirName,
        outDirName,
        projectFileName: f.name,
    })));

    const projectsDocumentContent: INftProjectsDocument = {
        projects: results.filter(x=>x).map(x=>x!).map(x=>({
            projectKey: x.projectKey,
            projectMetadata: x.projectMetadata,
        }))
        .map(x=>({ order: ordered.indexOf(x.projectKey), x}))
        .map(x=>({ order: `${x.order>= 0 ? x.order : ''}`.padStart(10, 'Z'), x:x.x}))
        .sort((a,b)=>a.order.localeCompare(b.order))
        .map(x=>x.x)
    };

    console.log('saving projects.json', {projects: projectsDocumentContent.projects.map(x=>x.projectKey)});

    // List all projects
    const fullProjectFileName = path.join(outDirName, 'projects.json');
    await fs.writeFile(fullProjectFileName, JSON.stringify(projectsDocumentContent));
};

const buildProjectRarityFiles = async ({
    dataDirName,
    outDirName,
    projectFileName,
}:{
    dataDirName:string, 
    outDirName:string,
    projectFileName:string,
}) => {
    try{
        console.log(`# generateRarityFiles: processing ${projectFileName}`);

        const projectKey = projectFileName.replace('.project.json', '');
        const fullProjectFileName = path.join(dataDirName, projectFileName);
        const fullNftListFileName = fullProjectFileName.replace('.project.json', '.json');

        await fs.mkdir(path.join(outDirName, projectKey), { recursive: true });

        const projectFileContent = await fs.readFile(fullProjectFileName, {encoding: 'utf-8' });
        const projectMetadata = JSON.parse(projectFileContent) as INftProjectMetadataDocument;
        
        // Skip if not changed (use size instead of change time)
        const projectInputFileSize = (await fs.stat(fullProjectFileName)).size;
        const tokensInputFileSize = (await fs.stat(fullNftListFileName)).size;

        const changehash = `${projectInputFileSize}:${tokensInputFileSize}`
        const fullLastChangeHashFileName = path.join(outDirName, projectKey, '.lastchangehash');

        try{
            const lastChanged = await fs.readFile(fullLastChangeHashFileName, {encoding:'utf-8'});

            if(lastChanged === changehash){
                console.log(`# generateRarityFiles: skipped (already calculated) ${projectFileName}`);
                return {
                    projectKey,
                    projectMetadata,
                };
            }
        } catch {
            // Ignore if missing
        }


        console.log(`# generateRarityFiles: reading metadata for ${projectFileName}`);
        const nftListFileContent = await fs.readFile(fullNftListFileName, {encoding: 'utf-8' });
        
        console.log(`# generateRarityFiles: parsing metadata json for ${projectFileName}`);
        const nftList = JSON.parse(nftListFileContent) as INftMetadataCollectionDocument;

        console.log(`# generateRarityFiles: calculating rarities for ${projectFileName}`);
        const rarityResult = calculateRarity(nftList, {
            includeTraitCount: projectMetadata.includeTraitCount,
        });

        console.log(`# generateRarityFiles: saving rarities for ${projectFileName}`);

        // Output project json with token index
        const allTraitValueKeys = [...new Set(
            rarityResult
            .flatMap(x=>x.attributeRarities)
            .filter(x=>x.value !== MISSING_ATTRIBUTE_VALUE)
            .map(x=>`${x.trait_type}:::${x.value}`)
        )].sort();
        const projectRarity : INftProjectRarityDocument = {
            project: projectMetadata,
            // tokens: rarityResult.map(x => ({
            //     tokenId: x.nft.id,
            //     rank: x.rank,
            //     attributes: x.attributeRarities
            //         .filter(x=>x.value !== MISSING_ATTRIBUTE_VALUE)
            //         .map(a=>({
            //             trait_type: a.trait_type,
            //             value: a.value,
            //             ratioScore: a.ratioScore
            //         }))
            //         .map(x=>NftAttributes.condense(x))
            // })),
            tokenIdsByRank: rarityResult.map(x=>x.nft.id),
            tokenLookups: allTraitValueKeys.map(x=>{
                const t = x.split(':::');
                return {trait_type: t[0], value: t[1]};
            }).map(x=>({
                trait_type: x.trait_type,
                trait_value: x.value,
                tokenIds: rarityResult
                    .filter(t=>t.attributeRarities.some(a=>a.trait_type===x.trait_type && a.value===x.value))
                    .map(t=>t.nft.id)
                    ,
            }))
        };

        const fullProjectRarityFileName = path.join(outDirName, projectKey, 'project.json');
        // await fs.mkdir(path.dirname(fullProjectRarityFileName), { recursive: true });
        await fs.writeFile(fullProjectRarityFileName, JSON.stringify(projectRarity));

        // Output collection-rarities
        const fullRarityFileName = path.join(outDirName, projectKey, 'collection-rarities.json');
        await fs.writeFile(fullRarityFileName, JSON.stringify(rarityResult));

        // Output individual individual tokenId json files
        let i = 0;
        for(const t of rarityResult){
            if(i % 500 === 0){
                console.log(`${(100 * i/rarityResult.length).toFixed()}%`);
            }

            const tokenRarityFileName = path.join(outDirName, projectKey, `${t.nft.id}.json`);
            // await fs.mkdir(path.dirname(tokenRarityFileName), { recursive: true });
            await fs.writeFile(tokenRarityFileName, JSON.stringify(t));

            i++;
        }

        console.log(`100%`);

        await fs.writeFile(fullLastChangeHashFileName, changehash);
        console.log(`# generateRarityFiles: Done - ${projectFileName}`);

        return {
            projectKey,
            projectMetadata,
        };
    }catch (err){
        console.error(`# generateRarityFiles: ERROR - ${projectFileName}`);
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