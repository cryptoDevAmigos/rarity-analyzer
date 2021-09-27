import { INftMetadata, INftProjectMetadataDocument } from '@crypto-dev-amigos/common';
import fetch from 'node-fetch';
import {promises as fs} from 'fs';
import path from 'path';
import { delay } from '../utils/delay';
import { openSeaRequest_getContractNfts, openSeaRequest_getContract, openSeaRequest_getNft } from './open-sea-api-types';

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

    console.log(`saving ${projectKey}/project.json`);
    
    await fs.mkdir(path.join(destDir, projectKey), {recursive: true});
    await fs.writeFile(path.join(destDir, projectKey, `${projectKey}.project.json`), JSON.stringify(projectMetadata));

    const totalSupply = contractResult.total_supply ?? 0;

    let delayTime = 1000;

    // !!! Note: this assumes sequential tokenIds

    for(let tokenId = 0; tokenId < totalSupply; tokenId++){
        // Skip if file already exists
        const nftFilePath = path.join(destDir, projectKey, `${tokenId}.nft.json`);
        try{
            const exists = await fs.stat(nftFilePath);
            if(exists){ continue; }
        }catch{}

        const getNftData = async () => {
            let attempt = 0;
            while(attempt < 3){
                await delay(delayTime);
    
                console.log(`downloadNft`,{delayTime});
                try{
                    const nftResult = await fetchTyped(openSeaRequest_getNft, {contractAddress, tokenId: `${tokenId}`});
                    if( 'notFound' in nftResult ){ 
                        console.log(`nft not found`, { tokenId });
                        return {notFound: true};
                    }
                    if( 'tooManyRequests' in nftResult ){ 
                        console.log(`nft - too many requests`, { tokenId, delayTime });
                        delayTime *= 2;
                        attempt++;
                        continue;
                    }

                    // Decrease delay time on success
                    delayTime = Math.max(1, delayTime-1);

                    return nftResult;
                }catch{}

                // Increase delay time on failure
                delayTime = Math.floor(delayTime * 2);
                attempt++;
            }
        };

        const nftData = await getNftData();
        if(!nftData){ 
            console.error('Failed to get nft - ABORT', { tokenId });
            return;
        }
        
        if( 'notFound' in nftData ){ 
            console.log(`nft not found tokenId=${tokenId}`);
            continue;
        }

        
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

        console.log(`saving ${projectKey}/${tokenId}.nft.json`);
        await fs.writeFile(nftFilePath, JSON.stringify(nft));
    }
};