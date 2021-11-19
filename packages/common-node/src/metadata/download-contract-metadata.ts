import { INftMetadata, INftProjectMetadata, INftProjectMetadataDocument } from '@crypto-dev-amigos/common';
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
    destDir,
    projectKey,
    contractAddress,
    collection,
    minTokenId,
    maxTokenId,
    maxOffset,
    transformAttribute,
    metadata,
}:{
    destDir: string,
    projectKey: string,
    contractAddress: string,
    collection: string,
    minTokenId?: string,
    maxTokenId?: string,
    maxOffset?: number,
    transformAttribute?: (attribute: {trait_type:string, value:string}) => null | {trait_type:string, value:string},
    metadata?: INftProjectMetadata,
}) => {

    console.log(`# downloadContractMetadata`, { collection, destDir });
    
    const collectionSlug = collection;
    const contractNftsResult = await fetchTyped(openSeaRequest_getCollectionNfts, {
        collectionSlug, 
        offset: `${0}`
    });
    if( 'notFound' in contractNftsResult ){ 
        console.log(`contract not found`, { collection, destDir });
        return;
    }
    if( 'tooManyRequests' in contractNftsResult ){ 
        console.log(`contract already too many requests`, { collection, destDir });
        return;
    }

    const contractResult = await fetchTyped(openSeaRequest_getContract, {contractAddress});
    if( 'notFound' in contractResult ){ 
        console.log(`contract not found`, { collection, destDir });
        return;
    }
    if( 'tooManyRequests' in contractResult ){ 
        console.log(`contract already too many requests`, { collection, destDir });
        return;
    }

    const collectionResult = contractNftsResult.assets[0].collection;
    const collectionMetadata : INftProjectMetadataDocument & {raw:unknown} = {
        contract: contractAddress,
        name: collectionResult.name,
        description: collectionResult.description,
        image: collectionResult.image_url,
        external_link: collectionResult.external_url,
        symbol: contractResult.symbol,

        ...metadata ?? {},
        raw: contractResult,
    };

    console.log(`saving ${collectionSlug}/${collectionSlug}.collection.json`);
    
    await fs.mkdir(path.join(destDir, collectionSlug), {recursive: true});
    await fs.writeFile(path.join(destDir, collectionSlug, `${collectionSlug}.collection.json`), JSON.stringify(collectionMetadata, null, 2));

    // const totalSupply = contractResult.total_supply ?? 0;
    // const totalSupply = 1000000;
    await downloadNewNfts({
        destDir,
        collectionSlug,
        maxOffset: maxOffset ?? contractResult.total_supply ?? 1000,
    });

    // Combine and copy files
    console.log(`creating project files ${projectKey} ${minTokenId}-${maxTokenId}`);

    const projectMetadata = {...collectionMetadata, raw: undefined};
    await fs.writeFile(path.join(destDir, `${projectKey}.project.json`), JSON.stringify(projectMetadata, null, 2));
    const nftsMetadata = [] as INftMetadata[];
    for( const f of await fs.readdir(path.join(destDir, collectionSlug))){
        if( !f.endsWith('.nft.json')){continue;}

        try{
            const nftData = JSON.parse(await fs.readFile(path.join(destDir, collectionSlug, f), {encoding:'utf-8'})) as INftMetadata;
            // if( !nftData.id || !nftData.attributes?.length){
            //     continue;
            // }
            if( !nftData.id ){
                continue;
            }

            if( minTokenId && Number(minTokenId) > Number(nftData.id)){
                continue;
            }
            if( maxTokenId && Number(maxTokenId) < Number(nftData.id)){
                continue;
            }

            (nftData as {raw:unknown}).raw = undefined;

            nftsMetadata.push({
                ...nftData,
                attributes: (nftData.attributes??[])
                    .map(x => transformAttribute ? transformAttribute?.(x) : x)
                    .filter(x => x)
                    .map(x => x!)
            });
        }catch{
            continue;
        }
    }
    await fs.writeFile(path.join(destDir, `${projectKey}.json`), JSON.stringify(nftsMetadata, null, 2));

    console.log(`DONE: ${projectKey} has ${nftsMetadata.length} NFTs`);
    // console.log(nftsMetadata.map(x=>x.id).join(' '));

    // // TEMP:

    // let ownersArray = [] as {address:string, }[];
    // const ownerCounts = {} as {[address:string]:number};
    // ownersArray.forEach(owner => { ownerCounts[owner.address] = ownerCounts[owner.address] + 1; });
    // const ownersWithCount = ownersArray.map(owner => ({...owner, count: ownerCounts[owner.address] || 0}) );
    // const ownersDistinct = [...new Map(ownersWithCount.map(x=>[x.address,x])).values()];
    // ownersDistinct.sort((a,b) => -(a.count - b.count));
    // const ownersTop = ownersDistinct.slice(0,10);
    // console.log(ownersTop);
};

const downloadNewNfts = async ({
    collectionSlug,
    destDir,
    maxOffset,
}:{
    collectionSlug: string,
    destDir: string,
    maxOffset: number,
})=>{

    let delayTime = 5000;

    const processDataFilePath = path.join(destDir, collectionSlug, `_downloadProcess.json`);
    let processData = {
        nextOffset: 0,
    };
    try{
        processData = JSON.parse(await fs.readFile(processDataFilePath, {encoding: 'utf-8'})) as typeof processData;
    }catch{}

    // Reset (this is now desc)
    processData.nextOffset = Math.max(0,processData.nextOffset);

    console.log(`#downloadNewNfts: ${delayTime}ms at offset:${processData.nextOffset} maxOffset:${maxOffset}`);

    for(let offset = processData.nextOffset??0; offset < maxOffset; offset += 50){
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
                        collectionSlug, 
                        offset: `${offset}`
                    });
                    if( 'notFound' in nftsResult ){ 
                        console.log(`collection not found`, {
                            collectionSlug, 
                            offset: `${offset}`
                        });
                        return {notFound: true};
                    }
                    if( 'tooManyRequests' in nftsResult ){ 
                        console.log(`nft - too many requests`, {
                            collectionSlug, 
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
                collectionSlug, 
                offset,
            });
            return;
        }
        if( 'notFound' in nftsData ){ 
            console.log(`collection not found`, { 
                collectionSlug, 
                offset,
            });
            continue;
        }


        let foundExisting = false;
        let foundNewCount = 0;

        for( const nftData of nftsData.assets){
            const nft: INftMetadata & {raw:unknown}= {
                id: Number(nftData.token_id),
                name: nftData.name ?? undefined,
                description: nftData.description ?? undefined,
                image: nftData.image_url ?? undefined,
                external_url: nftData.external_link ?? undefined,
                attributes: nftData.traits?.map(x=>({
                    trait_type: x.trait_type,
                    value: `${x.value}`,
                })) ?? undefined,
                raw: nftData,
            };
    
            const nftFilePath = path.join(destDir, collectionSlug, `${nft.id}.nft.json`);

            // Done if file already exists
            try{
                const exists = await fs.stat(nftFilePath);
                const nftData = JSON.parse(await fs.readFile(nftFilePath, {encoding:'utf-8'})) as INftMetadata;

                if(nftData.id === nft.id){
                    foundExisting = true;
                } else {
                    foundNewCount++;
                }
            }catch{
                foundNewCount++;
            }

            console.log(`saving ${nftFilePath}`);
            await fs.writeFile(nftFilePath, JSON.stringify(nft));
        }

        console.log(`found ${foundNewCount} new assets`);
        
        if(!nftsData.assets.length){
            // Backup to last page (for next time assets might be added)
            if( nftsData.assets.length < 50){
                processData.nextOffset -= 50;
            }

            await fs.writeFile(processDataFilePath, JSON.stringify(processData));

            // Done
            console.log(`No more new assets found`, { 
                foundExisting,
                collectionSlug, 
                offset,
            });
            return;
        }
    }
};