import React, { useEffect, useState } from 'react';
import { INftProjectRarityDocument, INftRarity } from '@crypto-dev-amigos/common';
import { NftCard } from './nft-card';
import { LazyList } from './lazy-list';
import { NftLoader } from './nft-loader';
import { getNftJsonUrl, getProjectJsonUrl } from '../helpers/urls';

export const NftProjectLoader = ({ projectKey }:{ projectKey:string })=>{

    const [projectRarity, setProjectRarity] = useState(null as null | INftProjectRarityDocument);

    useEffect(() => {
        (async () => {
            const nftProjectUrl = getProjectJsonUrl(projectKey);
            // console.log('projectKey', { projectKey, nftProjectUrl });
            const result = await fetch(nftProjectUrl);
            const obj = await result.json() as INftProjectRarityDocument;
            setProjectRarity(obj);
        })();
    }, [projectKey]);

return (
    <>
        {projectRarity && <NftProject projectKey={projectKey} projectRarity={projectRarity} />}
    </>
);
};

export const NftProject = ({ projectKey, projectRarity }:{ projectKey:string, projectRarity:INftProjectRarityDocument}) => {
    return (
        <>
        
            {projectRarity && (
                <LazyList items={projectRarity.tokens} getItemKey={x=>`${x.tokenId}`} ItemComponent={({item})=>(
                    <NftLoader projectKey={projectKey} tokenId={`${item.tokenId}`} />
                )}/>
            )}
        </>
    );
};