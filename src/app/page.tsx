import ConsensusState from "@/components/ConsensusState";

export default function Home() {
  const ports = [26657, 26659, 26661, 26663]; // 노드별 RPC 포트

  return (
    <div>
      <h1>CometBFT Consensus Dashboard</h1>
      {ports.map((port) => (
        <ConsensusState key={port} rpcPort={port} />
      ))}
    </div>
  );
}
