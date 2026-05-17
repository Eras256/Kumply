"use client";

import { type ReactNode } from "react";
import { WagmiProvider } from "wagmi";
import { avalancheFuji } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createAppKit } from "@reown/appkit/react";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";

const queryClient = new QueryClient();

// Add KUMPLY L1 Network
const kumplyL1 = {
  id: 43210,
  name: "KUMPLY Compliance L1",
  nativeCurrency: { name: "KMP", symbol: "KMP", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://subnets.avax.network/2pyvAQK1WQ318yHtnv4ZQeL9hWeJmmgMp9MEHqpJnDYttQEL6b/rpc"] },
  },
  blockExplorers: {
    default: { name: "KUMPLY Explorer", url: "https://testnet.avascan.info/blockchain/2pyvAQK1WQ318yHtnv4ZQeL9hWeJmmgMp9MEHqpJnDYttQEL6b" },
  },
  testnet: true,
};

const projectId = "299ad4e99fab1b67cb95953e76fa45b6";

const metadata = {
  name: "KUMPLY",
  description: "Institutional Identity Infrastructure",
  url: "https://kumply.xyz",
  icons: ["https://kumply.xyz/logo.png"],
};

const networks = [avalancheFuji, kumplyL1] as any;

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
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}
