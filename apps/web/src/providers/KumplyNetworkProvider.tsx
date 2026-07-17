"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useAccount, useSwitchChain } from "wagmi";
import { avalancheFuji, avalanche } from "wagmi/chains";

type KumplyNetwork = "fuji" | "mainnet";

interface KumplyNetworkContextType {
  network: KumplyNetwork;
  setNetwork: (network: KumplyNetwork) => void;
  contractAddress: `0x${string}`;
  complianceGateAddress: `0x${string}`;
  rpcUrl: string;
  chainId: number;
}

const KumplyNetworkContext = createContext<KumplyNetworkContextType | undefined>(undefined);

const CONTRACT_STORE_FUJI = "0x9Bbb0797EA92277c268fe7E45BdB16b70E787d76";
const CONTRACT_GATE_FUJI = "0x3Bf8F8ea2573Eb3f386aDF72D191869c4827062B";

// Placeholders for mainnet. Can be overridden via env vars.
const CONTRACT_STORE_MAINNET = process.env.NEXT_PUBLIC_CONTRACT_ATTESTATION_STORE_MAINNET || "0x0000000000000000000000000000000000000000";
const CONTRACT_GATE_MAINNET = process.env.NEXT_PUBLIC_CONTRACT_COMPLIANCE_GATE_MAINNET || "0x0000000000000000000000000000000000000000";

export function KumplyNetworkProvider({ children }: { children: React.ReactNode }) {
  const { chain, isConnected } = useAccount();
  const { switchChain } = useSwitchChain();
  
  // Stored state for UI/unconnected users
  const [network, setNetworkState] = useState<KumplyNetwork>("fuji");

  // Sync state if wallet is connected and on a supported chain
  useEffect(() => {
    if (isConnected && chain) {
      if (chain.id === avalanche.id) {
        setNetworkState("mainnet");
      } else if (chain.id === avalancheFuji.id) {
        setNetworkState("fuji");
      }
    }
  }, [chain, isConnected]);

  const setNetwork = (newNetwork: KumplyNetwork) => {
    setNetworkState(newNetwork);
    
    // If wallet is connected, switch its network too
    if (isConnected && switchChain) {
      const targetChainId = newNetwork === "mainnet" ? avalanche.id : avalancheFuji.id;
      if (chain?.id !== targetChainId) {
        switchChain({ chainId: targetChainId });
      }
    }
  };

  const contractAddress = (network === "mainnet" ? CONTRACT_STORE_MAINNET : CONTRACT_STORE_FUJI) as `0x${string}`;
  const complianceGateAddress = (network === "mainnet" ? CONTRACT_GATE_MAINNET : CONTRACT_GATE_FUJI) as `0x${string}`;
  const rpcUrl = network === "mainnet" 
    ? "https://api.avax.network/ext/bc/C/rpc"
    : "https://api.avax-test.network/ext/bc/C/rpc";
  const chainId = network === "mainnet" ? avalanche.id : avalancheFuji.id;

  return (
    <KumplyNetworkContext.Provider
      value={{
        network,
        setNetwork,
        contractAddress,
        complianceGateAddress,
        rpcUrl,
        chainId,
      }}
    >
      {children}
    </KumplyNetworkContext.Provider>
  );
}

export function useKumplyNetwork() {
  const context = useContext(KumplyNetworkContext);
  if (!context) {
    throw new Error("useKumplyNetwork must be used within a KumplyNetworkProvider");
  }
  return context;
}
