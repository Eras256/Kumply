"use client";

import { type ReactNode } from "react";
import { WagmiProvider } from "wagmi";
import { avalancheFuji, avalanche } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createAppKit } from "@reown/appkit/react";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { KumplyNetworkProvider } from "./KumplyNetworkProvider";

const queryClient = new QueryClient();

// KUMPLY Compliance L1 (chainId 43210) — re-add to `networks` once the ACP-77
// conversion runs and the first validator is live; until then the chain has no
// RPC and offering it in the wallet modal adds a dead network.

const projectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID || "299ad4e99fab1b67cb95953e76fa45b6";

const metadata = {
  name: "KUMPLY",
  description: "Institutional Identity Infrastructure",
  url: "https://kumply.xyz",
  icons: ["https://kumply.xyz/logo.png"],
};

const networks = [avalancheFuji, avalanche] as any;

const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  ssr: true,
});

createAppKit({
  adapters: [wagmiAdapter],
  networks,
  projectId,
  metadata,
  features: {
    analytics: true,
  },
  themeMode: 'dark',
});

export function Web3Provider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <KumplyNetworkProvider>
          {children}
        </KumplyNetworkProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
