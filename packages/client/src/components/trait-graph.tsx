import { INftProjectRarityDocument } from '@crypto-dev-amigos/common';
import React, { useEffect, useRef } from 'react';
import { TraitFilters } from './types';
import * as d3 from 'd3';
import * as d3Sankey from 'd3-sankey';


export const TraitGraph = ({ projectKey, projectRarity, selected }:{ projectKey: string, projectRarity: INftProjectRarityDocument, selected: TraitFilters }) => {

    const svgRef = useRef(null as null | SVGSVGElement);
    const redrawKey = projectKey + JSON.stringify(selected);

    useEffect(() => {
        const svg = svgRef.current;
        if(!svg){ return; }
        const redraw = () => { drawChart(svg, exampleData) };
        redraw();

        window.addEventListener('resize', redraw);
        return () => {
            window.removeEventListener('resize', redraw);
        };
    },[redrawKey]);

    return (
        <div style={{ background: '#000000', borderRadius: 0 }}>
            <svg ref={svgRef} style={{width: '100%', height: 300}}></svg>
        </div>
    );
}


const drawChart = (svgElement:SVGGElement, data: DataInput) => {
    const width = svgElement.clientWidth;
    const height = svgElement.clientHeight;
    const colors = {
        link: "#FFFFFF",
        text: "#FFFFFF",
        nodeOutline: "#000000",
    };

    const svg = d3.select(svgElement);
    svg.selectAll("*").remove();

    const formatNumber = d3.format(",.0f"),
        format = function (d: any) { return formatNumber(d) + " TWh"; },
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
        .selectAll("g");

    sankey(data);

    const link2 = link
        .data(data.links)
        .enter().append("path")
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
        ;

    node2.append("rect")
        .attr("x", function (d: any) { return d.x0; })
        .attr("y", function (d: any) { return d.y0; })
        .attr("height", function (d: any) { return d.y1 - d.y0; })
        .attr("width", function (d: any) { return d.x1 - d.x0; })
        .attr("fill", function (d: any) { return color(d.name.replace(/ .*/, "")); })
        .attr("stroke", colors.nodeOutline);

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