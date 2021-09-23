import { INftProjectRarityDocument } from '@crypto-dev-amigos/common';
import React, { useEffect, useRef } from 'react';
import { ALL_TRAIT_VALUE, TraitFilters, OnSelectTraitValue } from './types';
import * as d3 from 'd3';
import * as d3Sankey from 'd3-sankey';


export const TraitGraph = ({ 
    projectKey, projectRarity, tokenIds, selected, onSelect, 
 }:{ 
     projectKey: string, projectRarity: INftProjectRarityDocument, tokenIds: Set<number>, selected: TraitFilters, onSelect:OnSelectTraitValue
}) => {

    const svgRef = useRef(null as null | SVGSVGElement);
    const redrawKey = projectKey + JSON.stringify(selected);

    useEffect(() => {
        const svg = svgRef.current;
        if(!svg){ return; }

        const selectedNotAll = new Map(Object.entries(selected).filter(([k,x])=>x.value !== ALL_TRAIT_VALUE));
        const selectedCount = selectedNotAll.size;

        const tokenLookupsRaw2 = projectRarity.tokenLookups
            .filter(x=>x.trait_value !== ALL_TRAIT_VALUE)
            ;

        const tokenLookupsRaw = selectedCount > 0
            ? tokenLookupsRaw2
                .filter(x => x.trait_value === (selectedNotAll.get(x.trait_type) ?? x.trait_value))
                .filter(x => x.tokenIds.some(t => tokenIds.has(t)))
            : tokenLookupsRaw2;

        const traitTypesSet = new Set(tokenLookupsRaw.map(x=>x.trait_type));
        const traitTypeValueCountsMap = new Map( [...traitTypesSet].map(x=> [x ,tokenLookupsRaw.filter(t=>t.trait_type===x).length]));
        const traitTypesTop = [...traitTypesSet]
            .sort((a,b) => ( 
                (traitTypeValueCountsMap.get(a) ?? 0) 
                - (traitTypeValueCountsMap.get(b) ?? 0)
            ));
        
        // Only use n the top trait types
        const traitTypes = traitTypesTop;
        // const traitTypes = traitTypesTop.slice(selectedCount, 10 + selectedCount);
        // const traitTypes = traitTypesTop.slice(0, 5 + selectedCount);
        const traitTypesUsedSet = new Set(traitTypes);

        const tokenLookups = tokenLookupsRaw
            .filter(x => traitTypesUsedSet.has(x.trait_type));

        const nodeIdsReverseMap = new Map(tokenLookups.map((x,i)=>[x,i]));
        const nodeIdsMap = new Map(tokenLookups.map((x,i)=>[i,x]));
        const getNodeId = (x: typeof tokenLookups[number]) => nodeIdsReverseMap.get(x) ?? 0;

        const traitTypePairs = traitTypes.map((x,i)=>[x, traitTypes[i+1]]).filter(x => x[0] && x[1]);

        const data: DataInput = {
            nodes: tokenLookups.map(x => ({
                nodeId: getNodeId(x),
                name: `${x.trait_type}:${x.trait_value}`,
            })),
            links: traitTypePairs.flatMap(([lTraitType,rTraitType]) => {
                const left = tokenLookups.filter(x=>x.trait_type === lTraitType);
                const right = tokenLookups.filter(x=>x.trait_type === rTraitType);

                return left.flatMap(l=>{
                    const lTokenIdsSet = new Set(l.tokenIds);
                    return right.map(r=>{
                        return {
                            source: getNodeId(l),
                            target: getNodeId(r),
                            value: r.tokenIds.filter(x => lTokenIdsSet.has(x) && tokenIds.has(x)).length,
                            uom: 'Widget(s)'    
                        };
                    })
                });
            }).filter(x => x.value > 0),
        };

        const onSelectNodeIds = (nodeIds:number[]) => {
            const items = nodeIds.map(x=>nodeIdsMap.get(x));
            console.log('onSelect', {nodeIds, items});
            items.forEach(x=>{
                if(!x){ return; }
                onSelect({traitType: x.trait_type, value: x.trait_value});
            });
        };

        const redraw = () => { drawChart(svg, data, onSelectNodeIds) };
        redraw();

        window.addEventListener('resize', redraw);
        return () => {
            window.removeEventListener('resize', redraw);
        };
    },[redrawKey]);

    const heightRatio = Math.max(0.25,Math.min(0.75,tokenIds.size * 0.1));
    return (
        <div style={{ background: '#000000', borderRadius: 0 }}>
            <svg ref={svgRef} style={{width: '100%', minHeight: 600, height: `${(heightRatio*100).toFixed(0)}vh`}}></svg>
        </div>
    );
}


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

    const formatNumber = d3.format(",.0f"),
        format = function (d: any) { return formatNumber(d) + " NFTs"; },
        color = d3.scaleOrdinal(d3.schemeCategory10);

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
        .on('click' , (e,d)=>{ console.log('click', {d}); onSelect([(d.source as SNode).nodeId, (d.target as SNode).nodeId]); })
        .attr("d", d3Sankey.sankeyLinkHorizontal())
        .attr("stroke-width", function (d: any) { return Math.max(1, d.width); })
        ;

    link2.append("title")
        .text(function (d: any) { return d.source.name + " → " + d.target.name + "\n" + format(d.value); })
        .attr("fill", colors.text)
        ;

    const node2 = node
        .data(data.nodes)
        .enter().append("g")
        .on('click' , (e,d)=> { console.log('click', {d}); onSelect([d.nodeId]); })
        ;

    node2.append("rect")
        .attr("x", function (d: any) { return d.x0; })
        .attr("y", function (d: any) { return d.y0; })
        .attr("height", function (d: any) { return d.y1 - d.y0; })
        .attr("width", function (d: any) { return d.x1 - d.x0; })
        .attr("fill", function (d: any) { return color(d.name.replace(/ .*/, "")); })
        .attr("stroke", colors.nodeOutline)
        ;

    node2.append("text")
        .attr("fill", colors.text)
        .attr("x", function (d: any) { return d.x0 - 6; })
        .attr("y", function (d: any) { return (d.y1 + d.y0) / 2; })
        .attr("dy", "0.35em")
        .attr("text-anchor", "end")
        .text(function (d: any) { return d.name; })
        .attr("fill", colors.text)
        .filter(function (d: any) { return d.x0 < width / 2; })
        .attr("x", function (d: any) { return d.x1 + 6; })
        .attr("text-anchor", "start")
        ;

    node2.append("title")
        .text(function (d: any) { return d.name + "\n" + format(d.value); })
        .attr("fill", colors.text)
        ;
}

const exampleData: DataInput = {
    nodes: [{
        nodeId: 0,
        name: "node0"
    }, {
        nodeId: 1,
        name: "node1"
    }, {
        nodeId: 2,
        name: "node2"
    }, {
        nodeId: 3,
        name: "node3"
    }, {
        nodeId: 4,
        name: "node4"
    }],
    links: [{
        source: 0,
        target: 2,
        value: 2,
        uom: 'Widget(s)'
    }, {
        source: 1,
        target: 2,
        value: 2,
        uom: 'Widget(s)'
    }, {
        source: 1,
        target: 3,
        value: 2,
        uom: 'Widget(s)'
    }, {
        source: 0,
        target: 4,
        value: 2,
        uom: 'Widget(s)'
    }, {
        source: 2,
        target: 3,
        value: 2,
        uom: 'Widget(s)'
    }, {
        source: 2,
        target: 4,
        value: 2,
        uom: 'Widget(s)'
    }, {
        source: 3,
        target: 4,
        value: 4,
        uom: 'Widget(s)'
    }]
};

interface SNodeExtra {
    nodeId: number;
    name: string;
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