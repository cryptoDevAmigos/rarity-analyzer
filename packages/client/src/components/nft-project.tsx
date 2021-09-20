import React, { useEffect, useRef, useState } from 'react';
import type { INftProjectRarityDocument, INftRarity, MISSING_ATTRIBUTE_VALUE as MISSING_ATTRIBUTE_VALUE_TYPE } from '@crypto-dev-amigos/common';
import { NftCard } from './nft-card';
import { LazyList } from './lazy-list';
import { NftLoader } from './nft-loader';
import { getNftJsonUrl, getProjectJsonUrl } from '../helpers/urls';

// Workaround for importing implementation
const MISSING_ATTRIBUTE_VALUE: typeof MISSING_ATTRIBUTE_VALUE_TYPE = `[Missing]`;

export const NftProjectLoader = ({ projectKey }:{ projectKey:string })=>{

    const [projectRarity, setProjectRarity] = useState(null as null | INftProjectRarityData);

    useEffect(() => {
        (async () => {
            const nftProjectUrl = getProjectJsonUrl(projectKey);
            // console.log('projectKey', { projectKey, nftProjectUrl });
            const result = await fetch(nftProjectUrl);
            const obj = await result.json() as INftProjectRarityDocument;

            const loaded = loadProjectRarityData(obj);

            setProjectRarity(loaded);
        })();
    }, [projectKey]);

return (
    <>
        {projectRarity && <NftProject projectKey={projectKey} projectRarity={projectRarity} />}
    </>
);
};

type INftProjectRarityData = {
    tokenIdsByRank: INftProjectRarityDocument['tokenIdsByRank']
    tokenLookups: INftProjectRarityDocument['tokenLookups'],
    traitTypes: string[];
};
const loadProjectRarityData = (doc: INftProjectRarityDocument): INftProjectRarityData => {
    const traitTypes = [...new Set(doc.tokenLookups.map(x=>x.trait_type))];

    // Add [Missing] and [All]
    traitTypes.forEach(traitType => {
        const traitTypeTokenLookups = doc.tokenLookups
            .filter(x=>x.trait_type === traitType);
        const includedTokenIds = new Set(traitTypeTokenLookups.flatMap(x=>x.tokenIds));
        const missingTokenIds = doc.tokenIdsByRank.filter(t => !includedTokenIds.has(t));
        // Missing
        if(missingTokenIds.length){
            doc.tokenLookups.push({
                trait_type: traitType,
                trait_value: MISSING_ATTRIBUTE_VALUE,
                tokenIds: missingTokenIds
            });
        }

        // All
        doc.tokenLookups.push({
            trait_type: traitType,
            trait_value: '[All]',
            tokenIds: doc.tokenIdsByRank,
        });
    });

    return {
        tokenIdsByRank: doc.tokenIdsByRank,
        tokenLookups: doc.tokenLookups,
        traitTypes,
    };
};

export const NftProject = ({ projectKey, projectRarity }:{ projectKey:string, projectRarity:INftProjectRarityData}) => {

    const [tokenIds, setTokenIds] = useState(projectRarity.tokenIdsByRank);
    const nftListRef = useRef(null as null | HTMLDivElement)

    const onSelect = (args: { traitType: string, value: string, tokens: number[] }) => {
        setTokenIds(args.tokens);
        nftListRef.current?.scrollIntoView({behavior:'smooth'});
    };

    return (
        <>
            <div>
                <TraitTypesList projectRarity={projectRarity} onSelect={onSelect}/>
            </div>
            <div className='nft-list' ref={nftListRef}>
                {projectRarity && (
                    <LazyList items={tokenIds} getItemKey={x=>`${x}`} ItemComponent={({item})=>(
                        <div onClick={()=>window.location.href=`${projectKey}/${item}`}>
                            <NftLoader projectKey={projectKey} tokenId={`${item}`} />
                        </div>
                    )}/>
                )}
            </div>
        </>
    );
};

export const TraitTypesList = ({ projectRarity, onSelect }:{ projectRarity:INftProjectRarityData, onSelect: (args:{ traitType: string, value: string, tokens: number[] })=>void })=>{
    return (
        <div className='nft-trait-types'>
            {projectRarity.traitTypes.map(x=>(
                <React.Fragment key={x}>
                    <TraitValuesList traitType={x} projectRarity={projectRarity} onSelect={onSelect} />
                </React.Fragment>
            ))}
        </div>
    );
};

export const TraitValuesList = ({ traitType, projectRarity, onSelect }:{ traitType: string, projectRarity:INftProjectRarityData, onSelect: (args:{ traitType: string, value: string, tokens: number[] })=>void })=>{
   
    const traitTypeTokenLookups = projectRarity.tokenLookups
        .filter(x=>x.trait_type === traitType);
   
    return (
        <div className='nft-trait-type'>
            <div>
                {traitType}
            </div>
            <div className='nft-trait-values'>
                {traitTypeTokenLookups.map(x=>(
                    <React.Fragment key={`${x.trait_type}:${x.trait_value}`}>
                        <div className='nft-trait-value' onClick={()=>onSelect({traitType: x.trait_type, value: x.trait_value, tokens: x.tokenIds})}>
                            <div>
                                {x.trait_value}
                            </div>
                        </div>
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

