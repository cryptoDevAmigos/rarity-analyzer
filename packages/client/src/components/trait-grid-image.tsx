import { INftProjectRarityDocument } from '@crypto-dev-amigos/common';
import React, { useEffect, useRef, useState } from 'react';
import { ALL_TRAIT_VALUE, TraitFilters, OnSelectTraitValue } from './types';
import { Icon, LoadingIndicator } from './icons';
import { colorFormat } from '../helpers/colors';
import { getTraitColor } from '../helpers/trait-colors';
import { sortTraits, TraitSortKind } from '../helpers/trait-sort';


export const TraitGridImage = ({ 
    projectKey, projectRarity, tokenIds, selected, onSelect, 
 }:{ 
     projectKey: string, projectRarity: INftProjectRarityDocument, tokenIds: Set<number>, selected: TraitFilters, onSelect:OnSelectTraitValue
}) => {

    const canvasRef = useRef(null as null | HTMLCanvasElement);
    const redrawKey = projectKey + JSON.stringify(selected);
    const [loading, setLoading] = useState(true);
    const [traitSort, setTraitSort] = useState('default' as TraitSortKind);
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        if(!isExpanded){ return; }

        const canvas = canvasRef.current;
        if(!canvas){ return; }

        let isMounted = true;
        let redraw = () => {};
        let unsubscribe = () => {};
        setLoading(true);

        (async () => {
            // Blank
            // drawSankeyDiagram(canvas, {nodes:[], links:[]}, ()=>{});

            // const { data, nodeIdsMap } = await calculateData(projectRarity, tokenIds, selected, rareCount);
            // if(!isMounted){ return; }

            // const onSelectNodeIds = (nodeIds:number[]) => {
            //     const items = nodeIds.map(x=>nodeIdsMap.get(x));
            //     console.log('onSelect', {nodeIds, items});
            //     items.forEach(x=>{
            //         if(!x){ return; }
            //         onSelect({traitType: x.trait_type, value: x.trait_value});
            //     });
            // };
    
            redraw = () => { 
                unsubscribe();
                const result = drawNftTraitGridImage({canvas, projectRarity, selectedTokenIds: tokenIds, traitSort}); 
                unsubscribe = result?.unsubscribe ?? (()=>{});
            };
            redraw();
            setLoading(false);
        })();

        const redrawOuter = () => {redraw()};
        window.addEventListener('resize', redrawOuter);
        return () => {
            isMounted = false;
            window.removeEventListener('resize', redrawOuter);
            unsubscribe();
        };
    },[redrawKey, tokenIds.size, traitSort, isExpanded]);

    const heightRatio = Math.max(0.25,Math.min(0.75,tokenIds.size * 0.1));

    const SortButton = ({value}:{value:TraitSortKind})=>{
        return (
            <div className='link' style={{paddingLeft: 8}} 
                onClick={(e)=>{ 
                    e.preventDefault();
                    e.stopPropagation();
                    setTraitSort(value);
                }}
            >{value}</div>
        );
    };

    return (
        <div>
            <div style={{display: 'flex',flexDirection:'row'}}
                onClick={()=>setIsExpanded(s=>!s)}
            >
                <div style={{fontSize: 18}}>
                    {isExpanded ? <Icon icon='expanded'/> : <Icon icon='collapsed'/> }
                </div>
                <div>Rarity Waterfall: Nft Trait Grid</div>
                <div style={{flex:1}}>{tokenIds.size} NFTs</div>
                {(['rarity','default'] as const).map((v)=><SortButton key={v} value={v}/>)}
            </div>
            {isExpanded && (
                <div style={{ background: '#000000', borderRadius: 0 }}>
                    {loading && (<LoadingIndicator/>)}
                    <canvas ref={canvasRef} style={{width:'100%', minHeight: 100}}></canvas>
                </div>
            )}
        </div>
    );
}


const drawNftTraitGridImage = ({
    canvas,
    projectRarity,
    selectedTokenIds,
    traitSort,
}:{ 
    canvas:HTMLCanvasElement,
    projectRarity: INftProjectRarityDocument
    selectedTokenIds: Set<number>,
    traitSort:TraitSortKind,
}) => {
    // const tokenIdsToUse = projectRarity.tokenIdsByRank.length;
    const tokenIdsToUse = selectedTokenIds;
    //const traitsToUse = projectRarity.tokenLookups.filter(x=>x.tokenIds.some(t=>selectedTokenIds.has(t)));
    const traitsRaw = projectRarity.tokenLookups
        .filter(x=>x.trait_value!==ALL_TRAIT_VALUE);
        
    const traitsToUse = sortTraits(traitsRaw, traitSort);

    const hRaw = tokenIdsToUse.size;
    const wRaw = traitsToUse.length;

    const wClient = canvas.parentElement?.clientWidth;
    const hClient = 100;
    if(!wClient||!hClient){return;}

    const xScale = Math.max(1,Math.floor(wClient / wRaw));
    const yScale = Math.max(1,Math.floor(hClient / hRaw));

    const HEADER_SIZE = 8;
    const BLANK_SIZE = 4;
    
    const w = wRaw * xScale;
    const hContent = hRaw * yScale;
    const h = hContent + 2 * (HEADER_SIZE+BLANK_SIZE);

    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if(!ctx){return;}

    ctx.clearRect(0,0,w,h);
    const imageData = ctx.getImageData(0,0,w,h);
    const data = imageData.data;


    const tokenIdRankMap = new Map([...tokenIdsToUse].map((tokenId,rankIndex)=>[tokenId,rankIndex]));


    for(let x = 0; x < traitsToUse.length; x++){
        const trait = traitsToUse[x];

        const {r,g,b} = getTraitColor(trait, traitsToUse, projectRarity.tokenIdsByRank.length);
        let yOffset = 0;

        const drawHeaderBar = ()=>{
            for(let y = 0; y < HEADER_SIZE; y++){
                for( let i = 0; i < xScale; i++){
                    for( let j = 0; j < 1; j++){
                        const xs = x*xScale+i;
                        const ys = y*1     +j + yOffset;
                        data[(xs+ys*w) * 4 + 0] = r;
                        data[(xs+ys*w) * 4 + 1] = g;
                        data[(xs+ys*w) * 4 + 2] = b;
                        data[(xs+ys*w) * 4 + 3] = 255;
                    }
                }
            }
        };
   
        drawHeaderBar(); 
        yOffset+=HEADER_SIZE;
        yOffset+=BLANK_SIZE;

        for( const tokenId of trait.tokenIds){
            const y = tokenIdRankMap.get(tokenId);
            if(y==null){ continue; }

            for( let i = 0; i < xScale; i++){
                for( let j = 0; j < yScale; j++){
                    const xs = x*xScale+i;
                    const ys = y*yScale+j + yOffset;
                    data[(xs+ys*w) * 4 + 0] = r;
                    data[(xs+ys*w) * 4 + 1] = g;
                    data[(xs+ys*w) * 4 + 2] = b;
                    data[(xs+ys*w) * 4 + 3] = 255;
                }
            }
        }
        yOffset+=hContent;
        yOffset+=BLANK_SIZE;
        drawHeaderBar(); 
        yOffset+=HEADER_SIZE;
    }

    ctx.putImageData(imageData,0,0);

    // Events

    const handleInput = (position: {clientX:number, clientY:number}) => {
        const rect = canvas.getClientRects()[0];
        const canvasXRatio = (position.clientX - rect.top) / (rect.bottom-rect.top);
        const canvasYRatio = (position.clientY - rect.right) / (rect.bottom-rect.left);
        
        const traitIndex = Math.floor(canvasXRatio * traitsToUse.length);
        const trait = traitsToUse[traitIndex];

        // TODO: Finish handling inputs
    };

    const handleMouse = (ev: MouseEvent) => handleInput(ev);
    const handleTouch = (ev: TouchEvent) => handleInput(ev.touches[0]);
    window.addEventListener('mousemove', handleMouse);
    window.addEventListener('touchstart', handleTouch);
    window.addEventListener('touchmove', handleTouch);

    return {
        unsubscribe: ()=>{
            window.removeEventListener('mousemove', handleMouse);
            window.removeEventListener('touchstart', handleTouch);  
            window.removeEventListener('touchmove', handleTouch);
        }
    };
};