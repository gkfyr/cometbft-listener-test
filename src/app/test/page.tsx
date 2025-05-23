"use client";
import React, { useEffect, useState } from "react";
import ConsensusVisualizerV2 from "@/components/ConsensusVisualizerV2";

const ports = [26657, 26659, 26661, 26663];

export default function Test() {
  const [isProposer, setIsProposer] = useState(true);
  const stepMap: Record<number, string> = {
    0: "NewHeight",
    1: "Propose",
    2: "Prevote",
    3: "PrevoteWait",
    4: "Precommit",
    5: "PrecommitWait",
    6: "Commit",
  };

  const NodeBox = () => {
    return (
      <div
        key={1}
        className={`absolute text-black w-[120px] h-[100px] rounded-lg text-center px-2 py-2 shadow-md transition-transform duration-300 z-10 ${
          isProposer ? "border-2 border-green-500 bg-green-100" : "bg-gray-100"
        }`}
      >
        <h4 className="font-semibold text-sm">Port: {123456}</h4>
        <p className="text-xs truncate">{123123123}...</p>
        <p className="text-sm">{stepMap[1] ?? "Unknown"}</p>
        {isProposer && <span className="inline-block w-3 h-3 bg-green-500 rounded-full animate-ping mt-1" />}
      </div>
    );
  };
  return (
    <div>
      <h1>CometBFT Consensus Dashboard</h1>
      <div className="p-5">
        <NodeBox />
      </div>
    </div>
  );
}
