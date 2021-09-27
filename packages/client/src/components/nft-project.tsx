import React, { useEffect, useRef, useState } from 'react';
import type { INftProjectMetadataDocument, INftProjectRarityDocument, INftRarity, MISSING_ATTRIBUTE_VALUE as MISSING_ATTRIBUTE_VALUE_TYPE } from '@crypto-dev-amigos/common';
import { NftCard } from './nft-card';
import { LazyList } from './lazy-list';
import { NftLoader } from './nft-loader';
import { getIpfsUrl, getNftJsonUrl, getProjectJsonUrl } from '../helpers/urls';
import { BarGraphCell } from './bar-graph';
import { changeTheme } from '../helpers/theme';
import { Icon, IconLink, IconName, LoadingIndicator } from './icons';
import { SmartImage } from './smart-image';
import { ALL_TRAIT_VALUE, OnSelectTraitValue, TraitFilters } from './types';
import { TraitGraph } from './trait-graph';
import { HoverArgs, TraitGrid } from './trait-grid';
import { sortTraits } from '../helpers/trait-sort';

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
        {!projectRarity && <LoadingIndicator/>}
        {projectRarity && <NftProject projectKey={projectKey} projectRarity={projectRarity} />}
    </>
);
};

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
    const tokenLookupsSource = sortTraits(doc.tokenLookups,'default');

    const traitTypes = [...new Set(tokenLookupsSource.map(x=>x.trait_type))];

    // Add [Missing] and [All]
    traitTypes.forEach(traitType => {
        const traitTypeTokenLookups = tokenLookupsSource
            .filter(x=>x.trait_type === traitType);

        const includedTokenIds = new Set(traitTypeTokenLookups.flatMap(x=>x.tokenIds));
        const missingTokenIds = doc.tokenIdsByRank.filter(t => !includedTokenIds.has(t));
        // Missing
        if(missingTokenIds.length){
            tokenLookupsSource.unshift({
                trait_type: traitType,
                trait_value: MISSING_ATTRIBUTE_VALUE,
                tokenIds: missingTokenIds
            });
        }

        // All
        tokenLookupsSource.unshift({
            trait_type: traitType,
            trait_value: ALL_TRAIT_VALUE,
            tokenIds: doc.tokenIdsByRank,
        });
    });

    const tokenLookups = tokenLookupsSource.map(x=>({
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

export const NftProject = ({ projectKey, projectRarity }:{ projectKey:string, projectRarity:INftProjectRarityData}) => {

    const [pinnedTokenId, setPinnedTokenId] = useState('');
    const [tokenIds, setTokenIds] = useState(new Set(projectRarity.tokenIdsByRank));
    const nftListRef = useRef(null as null | HTMLDivElement)
    const traitFilters = useRef({} as TraitFilters);

    const onSelect = (args: { traitType: string, value: string }) => {
        const selections = traitFilters.current;
        selections[args.traitType] = {value: args.value, tokenIdsIfAll: new Set([]) };

        // Calculate tokenIdsIfAll
        Object.keys(selections).forEach(traitKeyIfAll => {
            let tokenIdsIfAll = new Set(projectRarity.tokenIdsByRank);
            Object.entries(selections).forEach(([traitKey,traitValue])=>{
                const tokenLookup = projectRarity.tokenLookups.find(v => v.trait_type === traitKey && v.trait_value === traitValue.value);
                if(!tokenLookup){ return; }
                if(traitKey === traitKeyIfAll){ return; }
    
                tokenIdsIfAll = new Set(tokenLookup.tokenIds.filter(t => tokenIdsIfAll.has(t) ));
            });
            selections[traitKeyIfAll].tokenIdsIfAll = tokenIdsIfAll;
        });

        let tokenIdsSelected = new Set(projectRarity.tokenIdsByRank);
        Object.entries(selections).forEach(([traitKey,traitValue])=>{
            const tokenLookup = projectRarity.tokenLookups.find(v => v.trait_type === traitKey && v.trait_value === traitValue.value);
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
                    <ProjectInfo project={projectRarity.project}/>
                </div>
                <div className='panel-trait-types'>
                    <TraitTypesList projectRarity={projectRarity} tokenIds={tokenIds} selected={traitFilters.current} onSelect={onSelect} onReset={onReset}/>
                </div>
                <div className='panel-nft-list'>
                    <div style={{marginTop: 8}}>Analysis</div>
                    <div>
                        <TraitGraph projectKey={projectKey} projectRarity={projectRarity} tokenIds={tokenIds} selected={traitFilters.current} onSelect={onSelect}/>
                    </div>
                    <div>
                        <TraitGrid projectKey={projectKey} projectRarity={projectRarity} tokenIds={tokenIds} selected={traitFilters.current} onSelect={onSelect}
                            HoverComponent={({args})=><HoverComponent hoverArgs={args} projectRarity={projectRarity} tokenIds={tokenIds} selected={traitFilters.current} onSelect={onSelect}/>}
                        />
                    </div>
                    <div style={{marginTop: 32}}>NFTs</div>
                    <div style={{textAlign:'left'}}>
                        Search: <input type='text' style={{maxWidth: 100}} value={pinnedTokenId} onChange={(e)=>setPinnedTokenId(e.target.value)}/>
                    </div>
                    <div className='nft-list' ref={nftListRef}>
                        {projectRarity && (
                            <LazyList key={pinnedTokenId} items={[pinnedTokenId,...tokenIds].filter(x=>x)} getItemKey={x=>`${x}`} ItemComponent={({item})=>(
                                // <div
                                //     className='link'
                                //     onClick={()=>window.location.href=`${projectKey}/${item}`}
                                // >
                                    <NftLoader projectKey={projectKey} tokenId={`${item}`} contractAddress={projectRarity.contractAddress} onSelect={onSelect} />
                                // </div>
                            )}/>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

const HoverComponent = ({ 
    projectRarity, 
    tokenIds, selected, onSelect,
    hoverArgs,
}:{ 
     projectRarity:INftProjectRarityData, 
     tokenIds: Set<number>, selected:TraitFilters, onSelect: OnSelectTraitValue,
     hoverArgs: HoverArgs,
})=>{
    // const traitInfo = traitFilters.current.

    const {trait,tokenId} = hoverArgs;
    const traitInfo = selected?.[trait.trait_type];
    const isSelected = traitInfo?.value === trait.trait_value;
    const nftCount = trait.tokenIds.length;
    const ratio = trait.tokenIds.length / projectRarity.tokenIdsByRank.length;

    return (
        <div className='hover-popup'>
            <div style={{textAlign:'left'}}>{trait.trait_type}</div>
            <div className={`nft-trait-value link ${isSelected ? 'nft-trait-value-selected':''}`} 
                onClick={()=>onSelect({traitType: trait.trait_type, value: trait.trait_value})}>
                <BarGraphCell ratio={ratio} text={trait.trait_value} textRight={`${nftCount}`}/>
            </div>
            <div style={{textAlign:'left'}}>#{tokenId}</div>
            <div style={{textAlign:'right'}}>Rank {projectRarity.tokenIdsByRank.findIndex(x=>x === tokenId) + 1}</div>
        </div>
    );
};

export const ProjectInfo = ({project}:{ project:INftProjectMetadataDocument})=>{
    return (
        <>
            <div className='project-info'>
                <div className='project-info-image'>
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
                    <div className='project-info-title'>{project.name}</div>
                    <div className='project-info-description'>{project.description}</div>
                    {!!project.external_link && (
                        <div className='project-info-link'>
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
                <div className='nft-trait-types-header-expandable link' onClick={()=>setIsExpanded(s=>!s)}>
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
                <div className='nft-trait-type-header link' onClick={onReset}>
                    <div style={{position:'relative'}}>
                        {Object.values(selected).some(x => x.value !== ALL_TRAIT_VALUE) && (
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
                        <TraitValuesList traitType={x} projectRarity={projectRarity} 
                            isExpandedAll={isExpanded}
                            tokenIds={tokenIds} selected={selected} onSelect={onSelect} />
                    </React.Fragment>
                ))}
            </div>
        </>
    );
};

export const TraitValuesList = ({ 
    traitType, projectRarity, 
    isExpandedAll,
    tokenIds, selected, onSelect
}:{ 
     traitType: string, projectRarity:INftProjectRarityData, 
     isExpandedAll: boolean,
     tokenIds: Set<number>, selected:TraitFilters, onSelect: OnSelectTraitValue
})=>{
   
    const [isExpanded, setIsExpanded] = useState(isExpandedAll);
    const toggleIsExpanded = ()=>{setIsExpanded(s=>!s)};
    useEffect(()=>{
        setIsExpanded(isExpandedAll);
    },[isExpandedAll]);

    const traitTypeTokenLookups = projectRarity.tokenLookups
        .filter(x=>x.trait_type === traitType);
   
    const selectedTraitItem = selected[traitType] ?? {
        value: ALL_TRAIT_VALUE,
        tokenIdsIfAll: tokenIds,
    };
    const isAllSelected = selectedTraitItem.value === ALL_TRAIT_VALUE;
    console.log('TraitValuesList', {isAllSelected, selectedTraitItem});

    const traitTypeTokenLookupsWithCount = traitTypeTokenLookups.map(x=>({
        x, 
        isSelected: selectedTraitItem.value === x.trait_value,
        count: x.tokenIds.filter(t => (selectedTraitItem.tokenIdsIfAll??tokenIds).has(t)).length
    }));

    return (
        <div className='nft-trait-type'>
            <div className='nft-trait-type-header link' onClick={()=>toggleIsExpanded()}>
                <div style={{position:'relative'}}>
                    <div style={{
                            position:'absolute',
                            left: 4,
                            fontSize: 18
                            }}>
                            {isExpanded ? <Icon icon='expanded'/> : <Icon icon='collapsed'/> }
                    </div>
                    {!isAllSelected && (
                        <div style={{
                            position:'absolute',
                            right: 4,
                            }}
                            onClick={(e)=>{ 
                                e.preventDefault();
                                e.stopPropagation();
                                onSelect({traitType, value: ALL_TRAIT_VALUE});
                            }}
                        >
                            {'❌'}
                        </div>
                    )}
                    {traitType}
                </div>
                {!isExpanded && (
                    <div className='nft-trait-value'>
                        {selectedTraitItem.value}
                    </div>
                )}
            </div>
            {isExpanded && (
                <div className='nft-trait-values'>
                    {traitTypeTokenLookupsWithCount
                    .filter(({count,isSelected})=>count||isSelected)
                    .map(({x,count,isSelected})=>(
                        <React.Fragment key={`${x.trait_type}:${x.trait_value}`}>
                            <div className={`nft-trait-value link ${isSelected ? 'nft-trait-value-selected':''}`} onClick={()=>onSelect({traitType: x.trait_type, value: x.trait_value})}>
                                <BarGraphCell ratio={x.ratio} text={x.trait_value} textRight={`${count}`}/>
                            </div>
                        </React.Fragment>
                    ))}
                </div>
            )}
        </div>
    );
};

