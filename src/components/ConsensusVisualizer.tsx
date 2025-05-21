import React from "react";

type Node = {
  port: number;
  address: string;
  stepStr: string;
  proposer?: string;
};

type Props = {
  nodes: Node[];
};

const stepMap: Record<number, string> = {
  0: "NewHeight",
  1: "Propose",
  2: "Prevote",
  3: "PrevoteWait",
  4: "Precommit",
  5: "PrecommitWait",
  6: "Commit",
};

const NODE_WIDTH = 140;
const NODE_SPACING = 180;

const ConsensusVisualizer: React.FC<Props> = ({ nodes }) => {
  const currentProposer = nodes.find((node) => nodes.some((n) => n.proposer === node.address))?.address;

  return (
    <div className="relative h-[220px] mt-10 w-full overflow-x-auto">
      <svg className="absolute w-full h-[100px] top-0 left-0 z-0">
        <defs>
          <marker
            id="arrow"
            markerWidth="10"
            markerHeight="10"
            refX="6"
            refY="3"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path d="M0,0 L0,6 L9,3 z" fill="green" />
          </marker>
        </defs>

        {nodes.map((target, index) => {
          const proposerNode = nodes.find((n) => n.address === currentProposer);
          if (!proposerNode || proposerNode.address === target.address) return null;

          const fromX = nodes.findIndex((n) => n.address === proposerNode.address) * NODE_SPACING + NODE_WIDTH / 2;
          const toX = index * NODE_SPACING + NODE_WIDTH / 2;
          const y = 60;

          return (
            <line
              key={`${proposerNode.address}->${target.address}`}
              x1={fromX}
              y1={y}
              x2={toX}
              y2={y}
              stroke="green"
              strokeWidth="2"
              markerEnd="url(#arrow)"
              className="animate-dash"
            />
          );
        })}
      </svg>

      {nodes.map((node, index) => {
        const stepNum = parseInt(node.stepStr.split("/")[2]);
        const isProposer = node.address === currentProposer;

        return (
          <div
            key={node.port}
            className={`absolute top-[100px] text-black w-[120px] h-[100px] rounded-lg text-center px-2 py-2 shadow-md transition-transform duration-300 z-10 ${
              isProposer ? "border-2 border-green-500 bg-green-100" : "bg-gray-100"
            }`}
            style={{ left: `${index * NODE_SPACING}px` }}
          >
            <h4 className="font-semibold text-sm">Port: {node.port}</h4>
            <p className="text-xs truncate">{node.address.slice(0, 6)}...</p>
            <p className="text-sm">{stepMap[stepNum] ?? "Unknown"}</p>
            {isProposer && <span className="inline-block w-3 h-3 bg-green-500 rounded-full animate-ping mt-1" />}
          </div>
        );
      })}
    </div>
  );
};

export default ConsensusVisualizer;
