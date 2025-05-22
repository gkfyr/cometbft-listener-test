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

const NODE_POSITIONS = [
  { x: 150, y: 100 }, // 1사분면
  { x: 450, y: 100 }, // 2사분면
  { x: 150, y: 300 }, // 3사분면
  { x: 450, y: 300 }, // 4사분면
];

const D3ConsensusVisualizer: React.FC<Props> = ({ nodes }) => {
  const currentProposer = nodes.find((node) => nodes.some((n) => n.proposer === node.address))?.address;

  return (
    <div key={JSON.stringify(nodes)} className="relative h-[500px] w-full overflow-x-auto">
      <svg className="absolute w-full h-full top-0 left-0 z-0">
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

        {nodes.map((targetNode, i) => {
          if (!targetNode.proposer) return null;

          const proposerIndex = nodes.findIndex((n) => n.address === targetNode.proposer);
          if (proposerIndex === -1 || proposerIndex === i) return null;

          const from = NODE_POSITIONS[proposerIndex];
          const to = NODE_POSITIONS[i];

          const fromX = from.x + 60;
          const fromY = from.y + 40;
          const toX = to.x + 60;
          const toY = to.y + 40;

          const dx = toX - fromX;
          const dy = toY - fromY;
          const len = Math.sqrt(dx * dx + dy * dy);
          const shorten = 80;
          const ratio = (len - shorten) / len;

          const adjustedX = fromX + dx * ratio;
          const adjustedY = fromY + dy * ratio;

          return (
            <line
              key={`${targetNode.proposer}->${targetNode.address}`}
              x1={fromX}
              y1={fromY}
              x2={adjustedX}
              y2={adjustedY}
              stroke="green"
              strokeWidth="2"
              markerEnd="url(#arrow)"
            />
          );
        })}
      </svg>

      {nodes.map((node, index) => {
        const { x, y } = NODE_POSITIONS[index];
        const stepNum = parseInt(node.stepStr.split("/")[2]);
        const isProposer = node.address === currentProposer;

        return (
          <div
            key={node.port}
            className={`absolute text-black w-[120px] h-[100px] rounded-lg text-center px-2 py-2 shadow-md transition-transform duration-300 z-10 ${
              isProposer ? "border-2 border-green-500 bg-green-100" : "bg-gray-100"
            }`}
            style={{ left: `${x}px`, top: `${y}px` }}
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

export default D3ConsensusVisualizer;
