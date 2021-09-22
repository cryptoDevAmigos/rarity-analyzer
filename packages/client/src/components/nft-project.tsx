import React, { useEffect, useRef, useState } from 'react';
import type { INftProjectMetadataDocument, INftProjectRarityDocument, INftRarity, MISSING_ATTRIBUTE_VALUE as MISSING_ATTRIBUTE_VALUE_TYPE } from '@crypto-dev-amigos/common';
import { NftCard } from './nft-card';
import { LazyList } from './lazy-list';
import { NftLoader } from './nft-loader';
import { getIpfsUrl, getNftJsonUrl, getProjectJsonUrl } from '../helpers/urls';
import { BarGraphCell } from './bar-graph';
import { changeTheme } from '../helpers/theme';
import { Icon, IconLink, IconName } from './icons';
import { SmartImage } from './smart-image';
import { OnSelectTraitValue } from './types';

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

            changeTheme(obj.project.theme);

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
    const onReset = () => {
        traitFilters.current = {};
        setTokenIds(new Set(projectRarity.tokenIdsByRank));
    };

    return (
        <>
            <div className='panel-container'>
                <div className='panel-project-info'>
                    <ProjectInfo projectRarity={projectRarity}/>
                </div>
                <div className='panel-trait-types'>
                    <TraitTypesList projectRarity={projectRarity} tokenIds={tokenIds} selected={traitFilters.current} onSelect={onSelect} onReset={onReset}/>
                </div>
                <div className='panel-nft-list'>
                    <div className='nft-list' ref={nftListRef}>
                        {projectRarity && (
                            <LazyList items={[...tokenIds]} getItemKey={x=>`${x}`} ItemComponent={({item})=>(
                                <div
                                    onClick={()=>window.location.href=`${projectKey}/${item}`}
                                >
                                    <NftLoader projectKey={projectKey} tokenId={`${item}`} contractAddress={projectRarity.contractAddress} onSelect={onSelect} />
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
    const {project} = projectRarity;
    return (
        <>
            <div style={{display:'flex', flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
                <div style={{}}>
                    <SmartImage alt='project' src={project.image} style={{objectFit:'contain', width: 150}}/>
                </div>
                <div style={{}}>
                    <div style={{display:'flex', flexDirection:'row', justifyContent:'flex-end'}}>
                        <IconLink url={project.external_link} icon='link'/>
                        <IconLink url={project.links?.opensea} iconUrl='/media/opensea.png'/>
                        <IconLink url={project.links?.openSea} iconUrl='/media/opensea.png'/>
                        <IconLink url={project.links?.twitter} icon='twitter'/>
                        <IconLink url={project.links?.discord} icon='discord'/>
                        {Object.entries(project.links??{})
                            .filter(([k])=> !'opensea openSea discord twitter'.includes(k))
                            .map(([k,v])=>(
                                <IconLink key={k} url={v} icon='link'/>
                            ))}
                    </div>
                    <div style={{fontSize: '1.6em'}}>{project.name}</div>
                    <div style={{fontSize: '1.0em'}}>{project.description}</div>
                    {!!project.external_link && (
                        <div style={{fontSize: '1.0em'}}>
                            <a href={getIpfsUrl(project.external_link)}>{project.external_link}</a>
                        </div>
                    )}
                </div>

            </div>
        </>
    );
};

export const TraitTypesList = ({ 
    projectRarity, tokenIds, selected, onSelect, onReset
}:{ 
    projectRarity:INftProjectRarityData, tokenIds: Set<number>, 
    selected:TraitFilters, 
    onSelect: OnSelectTraitValue,
    onReset: () => void,
})=>{
    const [isExpanded, setIsExpanded] = useState(true);
   
    return (
        <>
            <div className='nft-trait-types-header'>
                <div className='nft-trait-types-header-expandable' onClick={()=>setIsExpanded(s=>!s)}>
                    <div style={{position:'relative'}}>
                        <div style={{
                            position:'absolute',
                            left: 4,
                            fontSize: 18
                            }}>
                            {isExpanded ? <Icon icon='expanded'/> : <Icon icon='collapsed'/> }
                        </div>
                        Trait Filters 
                    </div>
                </div>
                <div className='nft-trait-types-header-simple'>
                    <div>Trait Filters</div>
                </div>
            </div>
                <div className='nft-trait-type-header' onClick={onReset}>
                    <div style={{position:'relative'}}>
                        {Object.values(selected).some(x=>x !==ALL_TRAIT_VALUE) && (
                            <>
                                <div style={{
                                    position:'absolute',
                                    right: 4,
                                    }}>
                                    {'❌'}
                                </div>
                                <span>Reset</span>
                            </>
                        )}
                        <span>&nbsp;</span>
                    </div>
                </div>
            <div className='nft-trait-types'>
                {projectRarity.traitTypes.map(x=>(
                    <React.Fragment key={x}>
                        <TraitValuesList traitType={x} projectRarity={projectRarity} isExpanded={isExpanded} tokenIds={tokenIds} selected={selected} onSelect={onSelect} />
                    </React.Fragment>
                ))}
            </div>
        </>
    );
};

export const TraitValuesList = ({ 
    traitType, projectRarity, isExpanded, tokenIds, selected, onSelect
}:{ 
     traitType: string, projectRarity:INftProjectRarityData, isExpanded: boolean, tokenIds: Set<number>, selected:TraitFilters, onSelect: OnSelectTraitValue
})=>{
   
    const traitTypeTokenLookups = projectRarity.tokenLookups
        .filter(x=>x.trait_type === traitType);
    const tokenIdsOfAll = traitTypeTokenLookups
        .find(x => x.trait_value===ALL_TRAIT_VALUE)
        ?.tokenIds.filter(x => tokenIds.has(x)) ?? [];
   
    const selectedTraitValue = selected[traitType] ?? ALL_TRAIT_VALUE;
    const isAllSelected = selectedTraitValue === ALL_TRAIT_VALUE;

    if(!isExpanded){

        if(!selectedTraitValue || isAllSelected){
            return <></>;
        }

        return (
            <div className='nft-trait-type' onClick={()=>onSelect({traitType, value: ALL_TRAIT_VALUE})}>
                <div style={{position:'relative'}}>
                    <div style={{
                        position:'absolute',
                        right: 4,
                        }}>
                        {'❌'}
                    </div>
                    {traitType} = {selectedTraitValue}
                </div>
            </div>
        );
    }

    return (
        <div className='nft-trait-type'>
            <div className='nft-trait-type-header' onClick={()=>onSelect({traitType, value: ALL_TRAIT_VALUE})}>
                <div style={{position:'relative'}}>
                    <div style={{
                        position:'absolute',
                        right: 4,
                        }}>
                        {isAllSelected ? '':'❌'}
                    </div>
                    {traitType}
                </div>
            </div>
            <div className='nft-trait-values'>
                {traitTypeTokenLookups.map(x=>(
                    <React.Fragment key={`${x.trait_type}:${x.trait_value}`}>
                        <div className={`nft-trait-value ${selectedTraitValue === x.trait_value ? 'nft-trait-value-selected':''}`} onClick={()=>onSelect({traitType: x.trait_type, value: x.trait_value})}>
                            <BarGraphCell ratio={x.ratio} text={x.trait_value} textRight={isAllSelected || selectedTraitValue === x.trait_value ? `${x.tokenIds.filter(t=>tokenIds.has(t)).length}`:``}/>
                        </div>
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

