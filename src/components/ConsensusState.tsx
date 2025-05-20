"use client";
import React, { useEffect, useState } from "react";

type ConsensusResponse = {
  result: {
    round_state: {
      ["height/round/step"]: string;
      step?: string;
      votes?: {
        prevotes: string;
        precommits: string;
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

    const interval = setInterval(fetchData, 3000);
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
    3: "Precommit",
    4: "Commit",
  };

  return (
    <div>
      <h3>Consensus State @ {rpcPort}</h3>
      <p>Step: {stepStr}</p>
      <p>Current Step: {stepMap[stepNum] ?? `Unknown (${stepNum})`}</p>
      <p>Prevotes: {data.result.round_state.votes?.prevotes}</p>
      <p>Precommits: {data.result.round_state.votes?.precommits}</p>
    </div>
  );
};

export default ConsensusState;
