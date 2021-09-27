import { INftMetadata, INftProjectMetadataDocument } from '@crypto-dev-amigos/common';
import fetch from 'node-fetch';
import {promises as fs} from 'fs';
import path from 'path';
import { delay } from '../utils/delay';
import { openSeaRequest_getContractNfts, openSeaRequest_getContract, openSeaRequest_getNft, openSeaRequest_getCollectionNfts } from './open-sea-api-types';

const fetchTyped = async <T extends {url:string, params: Record<string,string>, __exampleResponse:unknown}>(
    request: T,
    params: T['params']
) : Promise<{notFound:true} | {tooManyRequests: true} | T['__exampleResponse']> => {
    let url = request.url;
    Object.entries(params).forEach(([key,value])=>{
        url = url.replace(request.params[key],value);
    });
    const response = await fetch(url);

    if( !response.ok ){
        if( response.status === 404){
            return {notFound: true};
        }
        if( response.status === 429){
            return {tooManyRequests: true};
        }

        console.error('fetchTyped', {url, result: response.json(), response});
        throw new Error(`Request Failed: ${response.status}`);
    }

    const result = await response.json() as T['__exampleResponse']; 
    console.log('fetchTyped', {url, result, response});
    return result;
};

/** This will likely only partially succeed, so this is made to be called multiple times over a period */
export const downloadContractMetadata = async ({
    contractAddress,
    destDir,
}:{
    contractAddress: string,
    destDir: string,
}) => {

    console.log(`# downloadContractMetadata`, { contractAddress, destDir });
    
    const contractResult = await fetchTyped(openSeaRequest_getContract, {contractAddress});
    if( 'notFound' in contractResult ){ 
        console.log(`contract not found`, { contractAddress, destDir });
        return;
    }
    if( 'tooManyRequests' in contractResult ){ 
        console.log(`contract already too many requests`, { contractAddress, destDir });
        return;
    }

    const projectKey = contractResult.collection.slug;
    const projectMetadata : INftProjectMetadataDocument = {
        contract: contractAddress,
        name: contractResult.collection.name,
        description: contractResult.collection.description,
        image: contractResult.collection.image_url,
        external_link: contractResult.collection.external_url,
        symbol: contractResult.symbol,
    };

    console.log(`saving ${projectKey}/${projectKey}.project.json`);
    
    await fs.mkdir(path.join(destDir, projectKey), {recursive: true});
    await fs.writeFile(path.join(destDir, projectKey, `${projectKey}.project.json`), JSON.stringify(projectMetadata));

    const totalSupply = contractResult.total_supply ?? 0;
    await downloadNfts({
        destDir,
        projectKey,
        totalSupply,
    });

    // Combine and copy files
    console.log(`creating project files ${projectKey}`);

    await fs.copyFile(path.join(destDir, projectKey, `${projectKey}.project.json`), path.join(destDir, `${projectKey}.project.json`));
    const nftsMetadata = [] as INftMetadata[];
    for( const f of await fs.readdir(path.join(destDir, projectKey))){
        if( !f.endsWith('.nft.json')){continue;}

        try{
            const nftData = JSON.parse(await fs.readFile(path.join(destDir, projectKey, f), {encoding:'utf-8'})) as INftMetadata;
            if( !nftData.id || !nftData.attributes){
                continue;
            }

            nftsMetadata.push(nftData);
        }catch{
            continue;
        }
    }
    await fs.writeFile(path.join(destDir, `${projectKey}.json`), JSON.stringify(nftsMetadata));

    console.log(`DONE: ${projectKey}`);
};

const downloadNfts = async ({
    projectKey,
    destDir,
    totalSupply,
}:{
    projectKey: string,
    destDir: string,
    totalSupply: number,
})=>{

    let delayTime = 5000;

    const processDataFilePath = path.join(destDir, projectKey, `_downloadProcess.json`);
    let processData = {
        nextOffset: 0,
    };
    try{
        processData = JSON.parse(await fs.readFile(processDataFilePath, {encoding: 'utf-8'})) as typeof processData;
    }catch{}

    for(let offset = processData.nextOffset??0; offset < totalSupply; offset += 50){
        // Update process data
        processData.nextOffset = offset;
        await fs.writeFile(processDataFilePath, JSON.stringify(processData));

        const getNftsData = async () => {
            let attempt = 0;
            while(attempt < 3){
                console.log(`download nfts after delay: ${delayTime}ms at offset:${offset}`);
                await delay(delayTime);
    
                try{
                    const nftsResult = await fetchTyped(openSeaRequest_getCollectionNfts, {
                        collectionSlug: projectKey, 
                        offset: `${offset}`
                    });
                    if( 'notFound' in nftsResult ){ 
                        console.log(`collection not found`, {
                            collectionSlug: projectKey, 
                            offset: `${offset}`
                        });
                        return {notFound: true};
                    }
                    if( 'tooManyRequests' in nftsResult ){ 
                        console.log(`nft - too many requests`, {
                            collectionSlug: projectKey, 
                            offset: `${offset}`
                        });
                        delayTime *= 2;
                        continue;
                    }

                    // Decrease delay time on success
                    delayTime = Math.max(1, delayTime-1);

                    return nftsResult;
                }catch{}

                // Increase delay time on failure
                delayTime = Math.floor(delayTime * 2);
                attempt++;
            }
        };

        const nftsData = await getNftsData();
        if(!nftsData){ 
            console.error('Failed to get nfts - ABORT', { 
                collectionSlug: projectKey, 
                offset,
            });
            return;
        }
        if( 'notFound' in nftsData ){ 
            console.log(`collection not found`, { 
                collectionSlug: projectKey, 
                offset,
            });
            continue;
        }

        if( !nftsData.assets.length){
            // Backup to last page (for next time assets might be added)
            processData.nextOffset -= 50;
            await fs.writeFile(processDataFilePath, JSON.stringify(processData));

            // Done
            console.log(`No more assets found`, { 
                collectionSlug: projectKey, 
                offset,
            });
            return;
        }

        for( const nftData of nftsData.assets){
            const nft: INftMetadata = {
                id: Number(nftData.token_id),
                name: nftData.name ?? undefined,
                description: nftData.description ?? undefined,
                image: nftData.image_url ?? undefined,
                external_url: nftData.external_link ?? undefined,
                attributes: nftData.traits?.map(x=>({
                    trait_type: x.trait_type,
                    value: `${x.value}`,
                })) ?? undefined,
            };
    
            const nftFilePath = path.join(destDir, projectKey, `${nft.id}.nft.json`);
            console.log(`saving ${nftFilePath}`);
            await fs.writeFile(nftFilePath, JSON.stringify(nft));
        }



        // // Skip if file already exists
        // const nftFilePath = path.join(destDir, projectKey, `${tokenId}.nft.json`);
        // try{
        //     const exists = await fs.stat(nftFilePath);
        //     const nftData = JSON.parse(await fs.readFile(nftFilePath, {encoding:'utf-8'})) as INftMetadata;
        //     // Check if file is valid
        //     if(!nftData.id){
        //         await fs.unlink(nftFilePath);
        //         throw new Error('Nft not found');
        //     }

        //     if(exists){ continue; }
        // }catch{}
    }
};