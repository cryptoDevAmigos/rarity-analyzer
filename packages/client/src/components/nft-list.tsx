import React, { useEffect, useState } from 'react';
import { INftRarity } from '@crypto-dev-amigos/common';
import { NftCard } from './nft-card';

export const NftListLoader = ({ nftListUrl }:{ nftListUrl: string })=>{

    const [nftList, setNftList] = useState(null as null | INftRarity[]);

    useEffect(() => {
        (async () => {
            console.log(nftListUrl, {nftListUrl});
            const result = await fetch(nftListUrl);
            const obj = await result.json() as INftRarity[];
            setNftList(obj);
        })();
    }, [nftListUrl]);

return (
    <>
        {nftList && <NftList nftList={nftList} />}
    </>
);
};

export const NftList = ({nftList}:{nftList:INftRarity[]}) => {
    return (
        <>
            {nftList && nftList.map(x=>(
                <React.Fragment key={x.nft.id}>
                    <NftCard nft={x} />
                </React.Fragment>
            ))}
        </>
    );
};