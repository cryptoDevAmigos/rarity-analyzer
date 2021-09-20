import React, { useEffect, useState } from 'react';
import { INftProjectRarityDocument, INftRarityDocument } from '@crypto-dev-amigos/common';
import { INftRarityWithExtra, NftCard, NftCardPlaceholder } from './nft-card';
import { getNftJsonUrl, getProjectJsonUrl } from '../helpers/urls';
import { getOpenSeaData } from '../helpers/open-sea';

export const NftLoader = ({ projectKey, tokenId, contractAddress }:{ projectKey: string, tokenId: string, contractAddress?: string })=>{

    const [nft, setNft] = useState(null as null | INftRarityWithExtra);

    useEffect(() => {
        (async () => {
            const nftUrl = getNftJsonUrl(projectKey, tokenId);
            // console.log('NftLoader', {nftUrl});
            const result = await fetch(nftUrl);
            const obj = await result.json() as INftRarityDocument;
            setNft(obj);

            // Try to get contractAddress from project data
            if(!contractAddress){
                // Load from project
                const nftProjectUrl = getProjectJsonUrl(projectKey);
                // console.log('projectKey', { projectKey, nftProjectUrl });
                const result = await fetch(nftProjectUrl);
                const obj = await result.json() as INftProjectRarityDocument;
                contractAddress = obj.project.contract;

                if(!contractAddress){ return; }
            }

            // Load open sea data
            const openSeaData = await getOpenSeaData({ contractAddress, tokenId });
            const lastSellPrice = parseFloat(openSeaData.last_sale?.total_price ?? '0') / Math.pow(10, openSeaData.last_sale?.payment_token.decimals ?? 0);
            const lastSellSymbol = openSeaData.last_sale?.payment_token.symbol;
            const lastSellPriceUsd = lastSellPrice * parseFloat(openSeaData.last_sale?.payment_token.usd_price ?? '1');

            const order = openSeaData.orders?.[0];
            const listingPrice = parseFloat(order?.current_price ?? '0') / Math.pow(10, order?.payment_token_contract.decimals ?? 0);
            const listingSymbol =order?.payment_token_contract.symbol;
            const listingPriceUsd = listingPrice * parseFloat(order?.payment_token_contract.usd_price ?? '1');

            setNft({
                ...obj, 
                lastSell: openSeaData.last_sale ? {
                    price: lastSellPrice, 
                    symbol: lastSellSymbol, 
                    priceUsd : lastSellPriceUsd,
                } : undefined,
                listing: {
                    price: listingPrice, 
                    symbol: listingSymbol, 
                    priceUsd : listingPriceUsd,
                },
                openSeaLink: openSeaData.permalink,
            })

        })();
    }, [projectKey, tokenId]);

    // console.log('NftLoader RENDER', {projectKey, tokenId});
    return (
        <>
            {!nft && <NftCardPlaceholder />}
            {nft && <NftCard nft={nft}/>}
        </>
    );
};

