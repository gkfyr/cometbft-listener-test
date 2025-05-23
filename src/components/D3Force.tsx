// ForceGraph.tsx
import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

type NodeType = d3.SimulationNodeDatum & {
  id: string;
};

type LinkType = d3.SimulationLinkDatum<NodeType> & {
  source: string;
  target: string;
};

const ForceGraph = () => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // 초기화

    const nodes: NodeType[] = [{ id: "A" }, { id: "B" }, { id: "C" }, { id: "D" }];

    function createAllLinks(nodes: NodeType[]): LinkType[] {
      const links: LinkType[] = [];

      for (let i = 0; i < nodes.length; i++) {
        for (let j = 0; j < nodes.length; j++) {
          if (i !== j) {
            links.push({ source: nodes[i].id, target: nodes[j].id });
          }
        }
      }

      return links;
    }

    const links = createAllLinks(nodes);

    //TODO: make it from here
  }, []);

  return <svg ref={svgRef} width={400} height={300} />;
};

export default ForceGraph;
