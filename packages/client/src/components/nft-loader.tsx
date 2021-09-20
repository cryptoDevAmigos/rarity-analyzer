import React, { useEffect, useState } from 'react';
import { INftRarityDocument } from '@crypto-dev-amigos/common';
import { NftCard, NftCardPlaceholder } from './nft-card';
import { getNftJsonUrl } from '../helpers/urls';

export const NftLoader = ({ projectKey, tokenId }:{ projectKey:string, tokenId:string })=>{

    const [nft, setNft] = useState(null as null | INftRarityDocument);

    useEffect(() => {
        (async () => {
            const nftUrl = getNftJsonUrl(projectKey, tokenId);
            console.log('NftLoader', {nftUrl});
            const result = await fetch(nftUrl);
            const obj = await result.json() as INftRarityDocument;
            setNft(obj);
        })();
    }, [projectKey, tokenId]);

    return (
        <>
            {!nft && <NftCardPlaceholder />}
            {nft && <NftCard nft={nft}/>}
        </>
    );
};