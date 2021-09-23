import { INftProjectRarityDocument } from '@crypto-dev-amigos/common';
import React, { useEffect, useRef, useState } from 'react';
import { ALL_TRAIT_VALUE, TraitFilters, OnSelectTraitValue } from './types';
import * as d3 from 'd3';
import * as d3Sankey from 'd3-sankey';
import { delay } from '../helpers/delay';
import { LoadingIndicator } from './icons';


export const TraitGraph = ({ 
    projectKey, projectRarity, tokenIds, selected, onSelect, 
 }:{ 
     projectKey: string, projectRarity: INftProjectRarityDocument, tokenIds: Set<number>, selected: TraitFilters, onSelect:OnSelectTraitValue
}) => {

    const svgRef = useRef(null as null | SVGSVGElement);
    const redrawKey = projectKey + JSON.stringify(selected);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const svg = svgRef.current;
        if(!svg){ return; }

        let isMounted = true;
        let redraw = () => {};

        (async () => {
            // Blank
            drawChart(svg, {nodes:[], links:[]}, ()=>{});

            const { data, nodeIdsMap } = await calculateData(projectRarity, tokenIds, selected);
            if(!isMounted){ return; }

            const onSelectNodeIds = (nodeIds:number[]) => {
                const items = nodeIds.map(x=>nodeIdsMap.get(x));
                console.log('onSelect', {nodeIds, items});
                items.forEach(x=>{
                    if(!x){ return; }
                    onSelect({traitType: x.trait_type, value: x.trait_value});
                });
            };
    
            redraw = () => { drawChart(svg, data, onSelectNodeIds); };
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
    },[redrawKey, tokenIds.size]);

    const heightRatio = Math.max(0.25,Math.min(0.75,tokenIds.size * 0.1));
    return (
        <div style={{ background: '#000000', borderRadius: 0 }}>
            <div>Rarist Trait Combinations</div>
            {loading && (<LoadingIndicator/>)}
            <svg ref={svgRef} style={{width: '100%', minHeight: 600, height: `${(heightRatio*100).toFixed(0)}vh`}}></svg>
        </div>
    );
}

const calculateData = async (projectRarity: INftProjectRarityDocument, tokenIds: Set<number>, selected: TraitFilters) => {
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

    const pairsUsed = allPairsSortedByRarist.slice(0,250);
    const traitValuesUsed = [...new Set(pairsUsed.flatMap(x=>[x.l,x.r]))];

    const nodeIdsReverseMap = new Map(traitValuesUsed.map((x,i)=>[x,i]));
    const nodeIdsMap = new Map(traitValuesUsed.map((x,i)=>[i,x]));
    const getNodeId = (x: typeof traitValuesUsed[number]) => nodeIdsReverseMap.get(x) ?? 0;

    const data: DataInput = {
        nodes: traitValuesUsed.map(x => ({
            nodeId: getNodeId(x),
            key: `${x.trait_type}:${x.trait_value}`,
            traitType: x.trait_type,
            traitValue: x.trait_value,
            tokenCountInSelected: x.tokensInSelectionSet.size,
            tokensCountTotal: x.tokenIds.length,
        })),
        links: pairsUsed.map(x=>{
            return {
                source: getNodeId(x.l),
                target: getNodeId(x.r),
                value: x.intersectCount,
                uom: 'Widget(s)'    
            };
        }),
    };

    return {
        data,
        nodeIdsMap
    };
};

const drawChart = (svgElement:SVGGElement, data: DataInput, onSelect:(nodeIds:number[])=>void) => {
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

    const sankey = d3Sankey.sankey()
        .nodeWidth(15)
        .nodePadding(10)
        .extent([[1, 1], [width - 1, height - 6]]);

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

    sankey(data);

    const link2 = link
        .data(data.links)
        .enter().append("path")
        .on('click', (e,d)=>{ console.log('click', {d}); onSelect([(d.source as SNode).nodeId, (d.target as SNode).nodeId]); })
        .attr("d", d3Sankey.sankeyLinkHorizontal())
        .attr("stroke-width", (d) => { return Math.max(1, d.width ?? 1); })
        ;

    link2.append("title")
        .text((d) => { return `
${(d.source as SNodeExtra)?.key}
& 
${(d.target as SNodeExtra)?.key}

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
        .text(d => `[${d.traitType}] ${d.traitValue}`)
        .attr("fill", colors.text)
        .filter((d) => { return (d.x0??0) < width / 2; })
        .attr("x", (d) => { return (d.x1??0) + 6; })
        .attr("text-anchor", "start")
        ;

    node2.append("title")
        .text(d => `${d.traitType}\n${d.traitValue}\n${d.tokenCountInSelected} NFTs in Selection\n${d.tokensCountTotal} NFTs Total`)
        .attr("fill", colors.text)
        ;
}

// const exampleData: DataInput = {
//     nodes: [{
//         nodeId: 0,
//         name: "node0"
//     }, {
//         nodeId: 1,
//         name: "node1"
//     }, {
//         nodeId: 2,
//         name: "node2"
//     }, {
//         nodeId: 3,
//         name: "node3"
//     }, {
//         nodeId: 4,
//         name: "node4"
//     }],
//     links: [{
//         source: 0,
//         target: 2,
//         value: 2,
//         uom: 'Widget(s)'
//     }, {
//         source: 1,
//         target: 2,
//         value: 2,
//         uom: 'Widget(s)'
//     }, {
//         source: 1,
//         target: 3,
//         value: 2,
//         uom: 'Widget(s)'
//     }, {
//         source: 0,
//         target: 4,
//         value: 2,
//         uom: 'Widget(s)'
//     }, {
//         source: 2,
//         target: 3,
//         value: 2,
//         uom: 'Widget(s)'
//     }, {
//         source: 2,
//         target: 4,
//         value: 2,
//         uom: 'Widget(s)'
//     }, {
//         source: 3,
//         target: 4,
//         value: 4,
//         uom: 'Widget(s)'
//     }]
// };

interface SNodeExtra {
    nodeId: number;
    key: string;
    traitType: string;
    traitValue: string;
    tokenCountInSelected: number;
    tokensCountTotal: number;
}

interface SLinkExtra {
    source: number;
    target: number;
    value: number;
    uom: string;
}
type SNode = d3Sankey.SankeyNode<SNodeExtra, SLinkExtra>;
type SLink = d3Sankey.SankeyLink<SNodeExtra, SLinkExtra>;

interface DataInput {
    nodes: SNode[];
    links: SLink[];
}