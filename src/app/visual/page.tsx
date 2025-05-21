"use client";
import React, { useEffect, useState } from "react";
import ConsensusVisualizer from "@/components/ConsensusVisualizer";

const ports = [26657, 26659, 26661, 26663];

export default function Visual() {
  const [nodes, setNodes] = useState<any[]>([]);
  const [statusMap, setStatusMap] = useState<Record<number, any>>({});

  useEffect(() => {
    // status는 초기화 시 한 번만 호출
    const fetchStatusOnce = async () => {
      const statusData: Record<number, any> = {};

      await Promise.all(
        ports.map(async (port) => {
          try {
            const res = await fetch(`/api/status?port=${port}`).then((r) => r.json());
            statusData[port] = res.result.validator_info;
          } catch (e) {
            // 실패 시 빈 값으로 처리
            statusData[port] = null;
          }
        })
      );

      setStatusMap(statusData);
    };

    fetchStatusOnce();
  }, []);

  useEffect(() => {
    const fetchConsensusLoop = async () => {
      const promises = ports.map(async (port) => {
        try {
          const consensusRes = await fetch(`/api/consensus?port=${port}`).then((r) => r.json());
          const status = statusMap[port];

          return {
            port,
            address: status?.address || "unknown",
            stepStr: consensusRes.result.round_state["height/round/step"],
            proposer: consensusRes.result.round_state.proposer?.address,
          };
        } catch (e) {
          return null;
        }
      });

      const results = await Promise.all(promises);
      setNodes(results.filter(Boolean));
    };

    if (Object.keys(statusMap).length === ports.length) {
      fetchConsensusLoop();
      const interval = setInterval(fetchConsensusLoop, 100);
      return () => clearInterval(interval);
    }
  }, [statusMap]);

  return (
    <div>
      <h1>CometBFT Consensus Dashboard</h1>
      <ConsensusVisualizer nodes={nodes} />
    </div>
  );
}
