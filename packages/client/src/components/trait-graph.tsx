import { INftProjectRarityDocument } from '@crypto-dev-amigos/common';
import React, { useEffect, useRef, useState } from 'react';
import { ALL_TRAIT_VALUE, TraitFilters, OnSelectTraitValue } from './types';
import * as d3 from 'd3';
import * as d3Sankey from 'd3-sankey';
import { delay } from '../helpers/delay';
import { Icon, LoadingIndicator } from './icons';


export const TraitGraph = ({ 
    projectKey, projectRarity, tokenIds, selected, onSelect, 
 }:{ 
     projectKey: string, projectRarity: INftProjectRarityDocument, tokenIds: Set<number>, selected: TraitFilters, onSelect:OnSelectTraitValue
}) => {

    const svgRef = useRef(null as null | SVGSVGElement);
    const redrawKey = projectKey + JSON.stringify(selected);
    const [loading, setLoading] = useState(true);
    const [rareCount, setRareCount] = useState(64);
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        if(!isExpanded){ return; }

        const svg = svgRef.current;
        if(!svg){ return; }

        let isMounted = true;
        let redraw = () => {};

        (async () => {
            // Blank
            drawSankeyDiagram(svg, {nodes:[], links:[]}, ()=>{});

            const { data, nodeIdsMap } = await calculateData(projectRarity, tokenIds, selected, rareCount);
            if(!isMounted){ return; }

            const onSelectNodeIds = (nodeIds:number[]) => {
                const items = nodeIds.map(x=>nodeIdsMap.get(x));
                console.log('onSelect', {nodeIds, items});
                items.forEach(x=>{
                    if(!x){ return; }
                    onSelect({traitType: x.trait_type, value: x.trait_value});
                });
            };
    
            redraw = () => { drawSankeyDiagram(svg, data, onSelectNodeIds); };
            redraw();
            setLoading(false);
        })();

        setLoading(true);
        const redrawOuter = () => {redraw()};
        window.addEventListener('resize', redrawOuter);
        return () => {
            isMounted = false;
            window.removeEventListener('resize', redrawOuter);
        };
    },[redrawKey, tokenIds.size, rareCount, isExpanded]);

    const heightRatio = Math.max(0.25,Math.min(0.75,tokenIds.size * 0.1));

    const NumberButton = ({value}:{value:number})=>{
        return (
            <div className='link' style={{paddingLeft: 8}} 
                onClick={(e)=>{ 
                    e.preventDefault();
                    e.stopPropagation();
                    setRareCount(value);
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
                <div>Rarist Trait Combinations</div>
                <div style={{flex:1}}>{tokenIds.size} NFTs</div>
                {[16,64,256,1024].map((v)=><NumberButton key={v} value={v}/>)}
            </div>
            {isExpanded && (
                <div style={{ background: '#000000', borderRadius: 0 }}>
                    {loading && (<LoadingIndicator/>)}
                    <svg ref={svgRef} style={{width: '100%', minHeight: 600, height: `${(heightRatio*100).toFixed(0)}vh`}}></svg>
                </div>
            )}
        </div>
    );
}


const calculateData = async (projectRarity: INftProjectRarityDocument, tokenIds: Set<number>, selected: TraitFilters, rareCount: number) => {
    await delay(10);
    // const selectedNotAll = new Map(Object.entries(selected).filter(([k,x])=>x.value !== ALL_TRAIT_VALUE));

    const traitValuesRaw = projectRarity.tokenLookups;
    const traitValuesNotAll = traitValuesRaw
        .filter(x => x.trait_value !== ALL_TRAIT_VALUE)
        .map(x=>({
            ...x,
            tokensInSelectionSet: new Set(x.tokenIds.filter(t => tokenIds.has(t))),
        }))
        ;

    const getAllPairs = async () => {
        const allPairs = [] as {
            l: typeof traitValuesNotAll[number];
            r: typeof traitValuesNotAll[number];
            intersectCount: number;
            unionCount: number;
        }[];

        let lastDelay = Date.now();
        for(let i = 0; i < traitValuesNotAll.length; i++){
            const x = traitValuesNotAll[i];
            const xArray = [...x.tokensInSelectionSet];

            for(let j = i + 1; j < traitValuesNotAll.length; j++){
                const y = traitValuesNotAll[j];
                if(x.trait_type === y.trait_type){ continue; }

                if( Date.now() > lastDelay + 10){
                    console.log('getAllPairs delay');

                    await delay(0);
                    lastDelay = Date.now();
                }
 
                const result = {
                    l:x,
                    r:y,
                    intersectCount: xArray.filter(t => y.tokensInSelectionSet.has(t)).length,
                    unionCount: xArray.filter(t => !y.tokensInSelectionSet.has(t)).length + y.tokensInSelectionSet.size,
                };

                // Order trait type
                if(result.l.trait_type > result.r.trait_type){
                    const temp = result.l;
                    result.l = result.r;
                    result.r = temp;
                }

                if(!result.intersectCount){ continue; }
                allPairs.push(result);
            }    
        }

        return allPairs;
    };

    const allPairs = await getAllPairs();

    console.log('allPairs', {allPairs});

    const allPairsSortedByRarist = allPairs.sort((a,b)=>{

        if( a.intersectCount !== b.intersectCount){
            return a.intersectCount - b.intersectCount;
        }

        if( a.unionCount !== b.unionCount ){
            return a.unionCount - b.unionCount;
        }

        if( a.l.tokenIds.length !== b.l.tokenIds.length ){
            return a.l.tokenIds.length - b.l.tokenIds.length;
        }

        if( a.l.trait_type !== b.l.trait_type ){
            return a.l.trait_type.localeCompare(b.l.trait_type);
        }
        if( a.l.trait_value !== b.l.trait_value ){
            return a.l.trait_value.localeCompare(b.l.trait_value);
        }
        if( a.r.trait_type !== b.r.trait_type ){
            return a.r.trait_type.localeCompare(b.r.trait_type);
        }
        if( a.r.trait_value !== b.r.trait_value ){
            return a.r.trait_value.localeCompare(b.r.trait_value);
        }

        return 0;
    });

    const pairsUsed = allPairsSortedByRarist.slice(0,rareCount);
    const traitValuesUsed = [...new Set(pairsUsed.flatMap(x=>[x.l,x.r]))];

    const nodeIdsReverseMap = new Map(traitValuesUsed.map((x,i)=>[x,i]));
    const nodeIdsMap = new Map(traitValuesUsed.map((x,i)=>[i,x]));
    const getNodeId = (x: typeof traitValuesUsed[number]) => nodeIdsReverseMap.get(x) ?? 0;

    const traitTypesMap = new Map(
        [...new Set(traitValuesUsed.map(x=>x.trait_type))].map((x,i)=>[x,i])
    );

    const data: DataInput = {
        nodes: traitValuesUsed.map(x => ({
            nodeId: getNodeId(x),
            key: `${x.trait_type}:${x.trait_value}`,
            traitTypeIndex: traitTypesMap.get(x.trait_type) ?? 0,
            traitTypeCount: traitTypesMap.size,
            traitType: x.trait_type,
            traitValue: x.trait_value,
            tokenCountInSelected: x.tokensInSelectionSet.size,
            tokenCount: x.tokenIds.length,
            tokenCountAll: projectRarity.tokenLookups.length,
            tokenCountUsed: tokenIds.size,
        })),
        links: pairsUsed.map(x=>{
            return {
                source: getNodeId(x.l),
                target: getNodeId(x.r),
                value: x.intersectCount,
            };
        }),
    };

    return {
        data,
        nodeIdsMap
    };
};

type DataNode = {
    nodeId: number;
    key: string;
    traitTypeIndex: number;
    traitTypeCount: number;
    traitType: string;
    traitValue: string;
    tokenCountInSelected: number;
    tokenCount: number;
    tokenCountAll: number;
    tokenCountUsed: number;
}

type DataLink = {
    source: number;
    target: number;
    value: number;
}

type DataInput = {
    nodes: DataNode[];
    links: DataLink[];
}

const drawSankeyDiagram = (svgElement:SVGGElement, dataInput: DataInput, onSelect:(nodeIds:number[])=>void) => {

    type SNode = d3Sankey.SankeyNode<DataNode, DataLink>;
    type SLink = d3Sankey.SankeyLink<DataNode, DataLink>;

    const data = {
        nodes: dataInput.nodes as SNode[],
        links: dataInput.links.map(x=>({
            source: x.source,
            target: x.target,
            value: x.value,
            uom: 'Widget(s)',
        })) as SLink[],
    };


    const width = svgElement.clientWidth;
    const height = svgElement.clientHeight;
    const colors = {
        link: "#FFFFFF",
        text: "#FFFFFF",
        nodeOutline: "#000000",
    };

    const svg = d3.select(svgElement);
    svg.selectAll("*").remove();

    if( !data.nodes.length ){ return; }

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const sankey = d3Sankey.sankey<SNode,SLink>()
        .nodeWidth(15)
        .nodePadding(2)
        .extent([[4, 4], [width - 4, height - 4]]);
    sankey(data);

    // Override x position
    data.nodes.forEach(n=>{
        const xTarget = (width-8-20) *(n.traitTypeIndex / (n.traitTypeCount-1));
        const xDiff = xTarget - (n.x0??0);
        //console.log('override position', {xTarget, xDiff, x0:n.x0, x1:n.x1, width, traitTypeIndex: n.traitTypeIndex, traitTypeCount: n.traitTypeCount, n});
        n.x0 = xDiff + (n.x0 ?? 0);
        n.x1 = xDiff + (n.x1 ?? 0);
    });

    // // Override y height
    // data.nodes.forEach(n=>{
    //     const hTarget = (height-8-20) * (n.tokenCountInSelected / n.tokenCountUsed);
    //     const hDiff = hTarget - ((n.y1??0) - (n.y0??0));
    //     console.log('override height', {hTarget, hDiff, x0:n.x0, x1:n.x1, width, traitTypeIndex: n.traitTypeIndex, traitTypeCount: n.traitTypeCount, n});
    //     n.y1 = (n.y1 ?? 0) + hDiff;
    // });
    // Override width
    data.nodes.forEach(n=>{
        const wTarget = Math.max(2,(width-8-20) * (n.tokenCountInSelected / n.tokenCountUsed) / (n.traitTypeCount-1));
        const wDiff = wTarget - ((n.x1??0) - (n.x0??0));
        console.log('override width', {wTarget, wDiff, x0:n.x0, x1:n.x1, width, traitTypeIndex: n.traitTypeIndex, traitTypeCount: n.traitTypeCount, n});
        n.x1 = (n.x1 ?? 0) + wDiff;
    });
    
    // Recalculate y pos
    //sankey.update(data);
    

    // Draw
    const link = svg.append("g")
        .attr("class", "links")
        .attr("fill", "none")
        .attr("stroke", colors.link)
        .attr("stroke-opacity", 0.2)
        .selectAll("path");

    const node = svg.append("g")
        .attr("class", "nodes")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .selectAll("g")
        ;


    const link2 = link
        .data(data.links)
        .enter().append("path")
        .on('click', (e,d)=>{ console.log('click', {d}); onSelect([(d.source as SNode).nodeId, (d.target as SNode).nodeId]); })
        .attr("d", d3Sankey.sankeyLinkHorizontal())
        .attr("stroke-width", (d) => { return Math.max(1, d.width ?? 1); })
        ;

    link2.append("title")
        .text((d) => { return `
${(d.source as DataNode)?.key}
& 
${(d.target as DataNode)?.key}

${d.value} NFTs in common`.trim() })
        .attr("fill", colors.text)
        ;

    const node2 = node
        .data(data.nodes)
        .enter().append("g")
        .on('click' , (e,d)=> { console.log('click', {d}); onSelect([d.nodeId]); })
        ;

    node2.append("rect")
        .attr("x", (d) => { return d.x0??0; })
        .attr("y", (d) => { return d.y0??0; })
        .attr("height", (d) => { return (d.y1??0) - (d.y0??0); })
        .attr("width", (d) => { return (d.x1??0) -  (d.x0??0); })
        .attr("fill", (d) => { return color(d.key.replace(/ .*/, "")); })
        .attr("stroke", colors.nodeOutline)
        ;

    node2.append("text")
        .attr("fill", colors.text)
        .attr("x", (d) => { return (d.x0??0) - 6; })
        .attr("y", (d) => { return ((d.y1??0) + (d.y0??0)) / 2; })
        .attr("dy", "0.35em")
        .attr("text-anchor", "end")
        .text(d => `${d.traitType}: ${d.traitValue}`)
        .attr("fill", colors.text)
        .filter((d) => { return (d.x0??0) < width / 2; })
        .attr("x", (d) => { return (d.x1??0) + 6; })
        .attr("text-anchor", "start")
        ;

    node2.append("title")
        .text(d => `${d.traitType}: ${d.traitValue}\n${d.tokenCountInSelected} NFTs in Selection\n${d.tokenCount} NFTs Total`)
        .attr("fill", colors.text)
        ;
}
