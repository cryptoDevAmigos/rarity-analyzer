import React, { useEffect, useRef, useState } from 'react';
import type { INftProjectMetadataDocument, INftProjectRarityDocument, INftRarity, MISSING_ATTRIBUTE_VALUE as MISSING_ATTRIBUTE_VALUE_TYPE } from '@crypto-dev-amigos/common';
import { NftCard } from './nft-card';
import { LazyList } from './lazy-list';
import { NftLoader } from './nft-loader';
import { getIpfsUrl, getNftJsonUrl, getProjectJsonUrl } from '../helpers/urls';
import { BarGraphCell } from './bar-graph';

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

const ALL_TRAIT_VALUE ='[All]';
type INftProjectRarityData = {
    project: INftProjectMetadataDocument;
    tokenIdsByRank: INftProjectRarityDocument['tokenIdsByRank']
    tokenLookups: (INftProjectRarityDocument['tokenLookups'][number] & {
        ratio: number;
    })[],
    traitTypes: string[];
    contractAddress?: string;
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
            doc.tokenLookups.unshift({
                trait_type: traitType,
                trait_value: MISSING_ATTRIBUTE_VALUE,
                tokenIds: missingTokenIds
            });
        }

        // All
        doc.tokenLookups.unshift({
            trait_type: traitType,
            trait_value: ALL_TRAIT_VALUE,
            tokenIds: doc.tokenIdsByRank,
        });
    });

    const tokenLookups = doc.tokenLookups.map(x=>({
        ...x,
        ratio: x.tokenIds.length / doc.tokenIdsByRank.length,
    }));

    // Sort tokenLookups
    tokenLookups.sort();

    return {
        project: doc.project,
        contractAddress: doc.project.contract,
        tokenIdsByRank: doc.tokenIdsByRank,
        tokenLookups,
        traitTypes,
    };
};

type TraitFilters = { [traitType: string]: string };
export const NftProject = ({ projectKey, projectRarity }:{ projectKey:string, projectRarity:INftProjectRarityData}) => {

    const [tokenIds, setTokenIds] = useState(new Set(projectRarity.tokenIdsByRank));
    const nftListRef = useRef(null as null | HTMLDivElement)
    const traitFilters = useRef({} as TraitFilters);

    const onSelect = (args: { traitType: string, value: string }) => {
        traitFilters.current[args.traitType] = args.value;
        let tokenIdsSelected = new Set(projectRarity.tokenIdsByRank);
        Object.entries(traitFilters.current).forEach(([traitKey,traitValue])=>{
            const tokenLookup = projectRarity.tokenLookups.find(v => v.trait_type === traitKey && v.trait_value === traitValue);
            if(!tokenLookup){ return; }

            tokenIdsSelected = new Set(tokenLookup.tokenIds.filter(t => tokenIdsSelected.has(t) ));
        });
        setTokenIds(tokenIdsSelected);
        // nftListRef.current?.scrollIntoView({behavior:'smooth'});
    };

    return (
        <>
            <div className='panel-container'>
                <div className='panel-project-info'>
                    <ProjectInfo projectRarity={projectRarity}/>
                </div>
                <div className='panel-trait-types'>
                    <TraitTypesList projectRarity={projectRarity} tokenIds={tokenIds} selected={traitFilters.current} onSelect={onSelect}/>
                </div>
                <div className='panel-nft-list'>
                    <div className='nft-list' ref={nftListRef}>
                        {projectRarity && (
                            <LazyList items={[...tokenIds]} getItemKey={x=>`${x}`} ItemComponent={({item})=>(
                                <div onClick={()=>window.location.href=`${projectKey}/${item}`}>
                                    <NftLoader projectKey={projectKey} tokenId={`${item}`} contractAddress={projectRarity.contractAddress} />
                                </div>
                            )}/>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export const ProjectInfo = ({projectRarity}:{ projectRarity:INftProjectRarityData})=>{
    return (
        <>
          <div style={{display:'flex', flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
                <div style={{}}>
                    <img 
                        src={getIpfsUrl(projectRarity.project.image)} 
                        alt='project'
                        style={{objectFit:'contain', width: 150}}
                    />
                </div>
                <div style={{}}>
                    <div style={{fontSize: '1.6em'}}>{projectRarity.project.name}</div>
                    <div style={{fontSize: '1.0em'}}>{projectRarity.project.description}</div>
                    <div style={{fontSize: '1.0em'}}>
                        <a href={getIpfsUrl(projectRarity.project.external_link)}>{projectRarity.project.external_link}</a>
                    </div>
                </div>
            </div>
        </>
    );
};

export const TraitTypesList = ({ projectRarity, tokenIds, selected, onSelect }:{ projectRarity:INftProjectRarityData, tokenIds: Set<number>, selected:TraitFilters, onSelect: (args:{ traitType: string, value: string, tokens: number[] })=>void })=>{
    return (
        <div className='nft-trait-types'>
            {projectRarity.traitTypes.map(x=>(
                <React.Fragment key={x}>
                    <TraitValuesList traitType={x} projectRarity={projectRarity} tokenIds={tokenIds} selected={selected} onSelect={onSelect} />
                </React.Fragment>
            ))}
        </div>
    );
};

export const TraitValuesList = ({ traitType, projectRarity, tokenIds, selected, onSelect }:{ traitType: string, projectRarity:INftProjectRarityData, tokenIds: Set<number>, selected:TraitFilters, onSelect: (args:{ traitType: string, value: string, tokens: number[] })=>void })=>{
   
    const traitTypeTokenLookups = projectRarity.tokenLookups
        .filter(x=>x.trait_type === traitType);
    // const tokenIdsOfAll = traitTypeTokenLookups
    //     .find(x => x.trait_value===ALL_TRAIT_VALUE)
    //     ?.tokenIds.filter(x => tokenIds.has(x)) ?? [];
   
    const selectedTraitValue = selected[traitType] ?? ALL_TRAIT_VALUE;
    const isAllSelected = selectedTraitValue === ALL_TRAIT_VALUE;

    return (
        <div className='nft-trait-type'>
            <div className='nft-trait-type-header'>
                {traitType}
            </div>
            <div className='nft-trait-values'>
                {traitTypeTokenLookups.map(x=>(
                    <React.Fragment key={`${x.trait_type}:${x.trait_value}`}>
                        <div className={`nft-trait-value ${selectedTraitValue === x.trait_value ? 'nft-trait-value-selected':''}`} onClick={()=>onSelect({traitType: x.trait_type, value: x.trait_value, tokens: x.tokenIds})}>
                            <BarGraphCell ratio={x.ratio} text={x.trait_value} textRight={isAllSelected || selectedTraitValue === x.trait_value ? `${x.tokenIds.filter(t=>tokenIds.has(t)).length}`:``}/>
                        </div>
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

