"use client";
import React, { useEffect, useState } from "react";

type ConsensusResponse = {
  result: {
    round_state: {
      ["height/round/step"]: string;
      step?: string;
      proposer?: {
        address: string;
        index: number;
      };
    };
  };
};

type Props = {
  rpcPort: number;
};

const ConsensusState: React.FC<Props> = ({ rpcPort }) => {
  const [data, setData] = useState<ConsensusResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [nodeInfo, setNodeInfo] = useState<any>(null);

  useEffect(() => {
    const fetchNodeInfo = async () => {
      try {
        const res = await fetch(`/api/status?port=${rpcPort}`);
        const json = await res.json();
        console.log(json);
        setNodeInfo(json);
      } catch (err: any) {
        console.log(err.message);
      }
    };
    fetchNodeInfo();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/consensus?port=${rpcPort}`);
        const json = await res.json();
        if (json.error) {
          throw new Error(json.error);
        }
        setData(json);
        console.log(json);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchData();

    const interval = setInterval(fetchData, 1000);
    return () => clearInterval(interval);
  }, [rpcPort]);

  if (error) return <div>Error: {error}</div>;
  if (!data) return <div>Loading...</div>;

  const stepStr = data.result.round_state["height/round/step"];
  const stepNum = parseInt(stepStr.split("/")[2]);
  const stepMap: Record<number, string> = {
    0: "NewHeight",
    1: "Propose",
    2: "Prevote",
    3: "PrevoteWait",
    4: "Precommit",
    5: "PrecommitWait",
    6: "Commit",
  };

  return (
    <div className="border">
      <h3>Port: {rpcPort}</h3>
      <h2>Address: {nodeInfo?.result?.validator_info.address}</h2>
      <p>Step: {stepStr}</p>
      <p>Current Step: {stepMap[stepNum] ?? `Unknown (${stepNum})`}</p>
      <p>Proposer : {data.result.round_state.proposer?.address}</p>
    </div>
  );
};

export default ConsensusState;
