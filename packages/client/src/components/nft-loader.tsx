import React, { useEffect, useState } from 'react';
import { INftRarity } from '@crypto-dev-amigos/common';
import { NftCard } from './nft-card';

export const NftLoader = ({ nftUrl }:{ nftUrl:string })=>{

    const [nft, setNft] = useState(null as null | INftRarity);

    useEffect(() => {
        (async () => {
            console.log(nftUrl, {nftUrl});
            const result = await fetch(nftUrl);
            const obj = await result.json() as INftRarity;
            setNft(obj);
        })();
    }, [nftUrl]);

    return (
        <>
            {nft && <NftCard nft={nft}/>}
        </>
    );
};