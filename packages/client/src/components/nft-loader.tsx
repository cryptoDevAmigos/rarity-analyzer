import React, { useEffect, useState } from 'react';
import { INftRarityDocument } from '@crypto-dev-amigos/common';
import { NftCard } from './nft-card';

export const NftLoader = ({ nftUrl }:{ nftUrl:string })=>{

    const [nft, setNft] = useState(null as null | INftRarityDocument);

    useEffect(() => {
        (async () => {
            console.log(nftUrl, {nftUrl});
            const result = await fetch(nftUrl);
            const obj = await result.json() as INftRarityDocument;
            setNft(obj);
        })();
    }, [nftUrl]);

    return (
        <>
            {nft && <NftCard nft={nft}/>}
        </>
    );
};