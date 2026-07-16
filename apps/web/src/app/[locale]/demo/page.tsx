"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useAccount } from "wagmi";
import { useAppKit } from "@reown/appkit/react";
import { Link } from "@/i18n/routing";
import { KumplyClient } from "@kumply/sdk";

const CONTRACT = (process.env.NEXT_PUBLIC_CONTRACT_ATTESTATION_STORE || "0x9Bbb0797EA92277c268fe7E45BdB16b70E787d76") as `0x${string}`;
const COMPLIANCE_GATE = (process.env.NEXT_PUBLIC_CONTRACT_COMPLIANCE_GATE || "0x3Bf8F8ea2573Eb3f386aDF72D191869c4827062B") as `0x${string}`;
const EXPLORER = "https://testnet.snowtrace.io";

const TIER_COLORS: Record<number, string> = {
  0: "var(--text-tertiary)",
  1: "var(--text-secondary)",
  2: "var(--info)",
  3: "var(--accent)",
  4: "#a855f7",
  5: "var(--success)",
};

const TIER_LABELS: Record<number, string> = {
  0: "None",
  1: "Basic",
  2: "Standard",
  3: "Enhanced",
  4: "Business / KYB",
  5: "Agent / KYA",
};

interface CheckResult {
  address: string;
  verified: boolean;
  tier: number;
  expiry: number;
  requiredTier: number;
  accessGranted: boolean;
}

// Demo wallet address — this is the seeded verified address from seed-fuji.ts
// Update this when redeploying or re-seeding attestations
const DEMO_VERIFIED_WALLET = "0xD65042534CE80fcb641fd6Eb99a16eBF6C0cd076";
const DEAD_WALLET = "0x000000000000000000000000000000000000dead";

const USE_CASES = [
  {
    id: "defi",
    icon: "📈",
    title: "DeFi Protocol Access",
    description: "A lending protocol requires Tier 2 (Standard KYC) to deposit funds. The seeded demo wallet holds a real on-chain credential; the second wallet has none.",
    requiredTier: 2,
    walletA: DEMO_VERIFIED_WALLET,
    walletB: DEAD_WALLET,
    walletALabel: "Demo wallet — seeded credential",
    walletBLabel: "Unverified wallet",
  },
  {
    id: "rwa",
    icon: "🏢",
    title: "RWA Tokenized Asset",
    description: "A tokenized real estate fund requires Tier 4 (Business / KYB). Only corporate entities may invest.",
    requiredTier: 4,
    walletA: DEMO_VERIFIED_WALLET,
    walletB: DEAD_WALLET,
    walletALabel: "Demo wallet — seeded credential",
    walletBLabel: "Unverified wallet",
  },
  {
    id: "agent",
    icon: "🤖",
    title: "AI Agent Marketplace",
    description: "An on-chain AI marketplace requires Tier 5 (KYA) to list autonomous agents for trading. The demo wallet is a business (Tier 4), not a registered agent — watch it get rejected.",
    requiredTier: 5,
    walletA: DEMO_VERIFIED_WALLET,
    walletB: DEAD_WALLET,
    walletALabel: "Demo wallet — seeded credential",
    walletBLabel: "Unverified wallet",
  },
];

export default function DemoPage() {
  const t = useTranslations("Demo");
  const { address: connectedAddress, isConnected } = useAccount();
  const { open } = useAppKit();
  const [selectedUseCase, setSelectedUseCase] = useState(USE_CASES[0]);
  const [customAddress, setCustomAddress] = useState("");
  const [customRequiredTier, setCustomRequiredTier] = useState(2);
  const [results, setResults] = useState<CheckResult[]>([]);
  const [resultLabels, setResultLabels] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function runCheck(addresses: string[], requiredTier: number, labels: string[]) {
    if (!CONTRACT) {
      setError("Contract address not configured. Check NEXT_PUBLIC_CONTRACT_ATTESTATION_STORE.");
      return;
    }
    setLoading(true);
    setError(null);
    setResults([]);
    setResultLabels(labels);

    try {
      const client = new KumplyClient({ network: "fuji", contractAddress: CONTRACT });
      const checks = await Promise.all(
        addresses.map(async (addr): Promise<CheckResult> => {
          try {
            const result = await client.verify(addr);
            return {
              address: addr,
              verified: result.verified,
              tier: result.tier,
              expiry: result.expiry,
              requiredTier,
              accessGranted: result.verified && result.tier >= requiredTier,
            };
          } catch {
            return { address: addr, verified: false, tier: 0, expiry: 0, requiredTier, accessGranted: false };
          }
        })
      );
      setResults(checks);
    } catch (e) {
      setError("Could not connect to Fuji testnet. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }

  function handleUseCaseDemo() {
    runCheck(
      [selectedUseCase.walletA, selectedUseCase.walletB],
      selectedUseCase.requiredTier,
      [selectedUseCase.walletALabel, selectedUseCase.walletBLabel]
    );
  }

  function handleMyWalletCheck() {
    if (!isConnected || !connectedAddress) {
      open();
      return;
    }
    runCheck([connectedAddress], selectedUseCase.requiredTier, ["Your connected wallet"]);
  }

  function handleCustomCheck() {
    const addr = customAddress.trim();
    if (!/^0x[0-9a-fA-F]{40}$/.test(addr)) {
      setError("Invalid Ethereum address (must be 0x + 40 hex chars)");
      return;
    }
    runCheck([addr], customRequiredTier, ["Custom address"]);
  }

  return (
    <div className="container" style={{ paddingTop: "3rem", paddingBottom: "5rem", maxWidth: "860px" }}>
      {/* ── Header ── */}
      <div style={{ textAlign: "center", marginBottom: "3rem" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "var(--bg-card)", padding: "0.4rem 1rem", borderRadius: "var(--radius-full)", border: "1px solid var(--border)", marginBottom: "1rem" }}>
          <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--success)", boxShadow: "0 0 10px var(--success)", flexShrink: 0 }}></span>
          <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--text-secondary)" }}>Live Demo · Fuji Testnet</span>
        </div>
        <h1 className="page-title" style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>
          {t("title")}
        </h1>
        <p className="page-description" style={{ margin: "0 auto" }}>
          {t("subtitle")}
        </p>
      </div>

      {/* ── How ComplianceGate Works ── */}
      <div className="glass-card animate-glow" style={{ padding: "1.75rem", marginBottom: "2rem", borderColor: "var(--accent)" }}>
        <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
          <div style={{ width: "40px", height: "40px", borderRadius: "var(--radius-md)", background: "var(--accent-glow)", border: "1px solid var(--border-accent)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: "1.2rem" }}>🔐</div>
          <div>
            <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.4rem" }}>
              {t("gateTitle")}
            </h2>
            <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "0.75rem" }}>
              {t("gateDesc")}
            </p>
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              <a href={`${EXPLORER}/address/${CONTRACT}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: "0.78rem", color: "var(--accent-light)", textDecoration: "none", fontFamily: "monospace", background: "var(--bg-secondary)", padding: "0.3rem 0.75rem", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)" }}>
                AttestationStore ↗
              </a>
              {COMPLIANCE_GATE && (
                <a href={`${EXPLORER}/address/${COMPLIANCE_GATE}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: "0.78rem", color: "var(--accent-light)", textDecoration: "none", fontFamily: "monospace", background: "var(--bg-secondary)", padding: "0.3rem 0.75rem", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)" }}>
                  ComplianceGate ↗
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Use Case Selector ── */}
      <div className="glass-card" style={{ padding: "1.75rem", marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "1.25rem" }}>
          {t("useCaseTitle")}
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.75rem", marginBottom: "1.5rem" }} className="use-case-grid">
          {USE_CASES.map((uc) => (
            <button
              key={uc.id}
              onClick={() => { setSelectedUseCase(uc); setResults([]); setError(null); }}
              style={{
                background: selectedUseCase.id === uc.id ? "var(--accent-glow)" : "var(--bg-secondary)",
                border: `1px solid ${selectedUseCase.id === uc.id ? "var(--accent)" : "var(--border)"}`,
                borderRadius: "var(--radius-md)",
                padding: "1rem",
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.2s",
                color: "var(--text-primary)",
              }}
            >
              <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>{uc.icon}</div>
              <div style={{ fontSize: "0.85rem", fontWeight: 700, color: selectedUseCase.id === uc.id ? "var(--accent-light)" : "var(--text-primary)", marginBottom: "0.25rem" }}>{uc.title}</div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", lineHeight: 1.4 }}>{uc.description.split(".")[0]}.</div>
            </button>
          ))}
        </div>

        <div style={{ background: "var(--bg-secondary)", borderRadius: "var(--radius-md)", padding: "1.25rem", marginBottom: "1.25rem", border: "1px solid var(--border)" }}>
          <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "0.75rem" }}>
            {selectedUseCase.description}
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontSize: "0.78rem", color: "var(--text-tertiary)" }}>Required tier:</span>
            <span style={{ fontSize: "0.85rem", fontWeight: 700, color: TIER_COLORS[selectedUseCase.requiredTier] }}>
              Tier {selectedUseCase.requiredTier} — {TIER_LABELS[selectedUseCase.requiredTier]}
            </span>
          </div>
        </div>

        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "center" }}>
          <button
            className="btn btn-primary"
            onClick={handleUseCaseDemo}
            disabled={loading}
            style={{ fontSize: "0.95rem", padding: "0.75rem 1.75rem" }}
          >
            {loading ? "Checking on-chain…" : t("runDemoBtn")}
          </button>
          <button
            className="btn btn-secondary"
            onClick={handleMyWalletCheck}
            disabled={loading}
            style={{ fontSize: "0.95rem", padding: "0.75rem 1.5rem" }}
          >
            {isConnected && connectedAddress
              ? `Check my wallet (${connectedAddress.slice(0, 6)}…${connectedAddress.slice(-4)})`
              : "Connect wallet to test yours"}
          </button>
        </div>
        {isConnected && (
          <p style={{ marginTop: "0.75rem", fontSize: "0.78rem", color: "var(--text-tertiary)" }}>
            Runs the same on-chain read against your own address — if you completed verification, you&apos;ll see your real credential answer here.
          </p>
        )}
      </div>

      {/* ── Results ── */}
      {error && (
        <div style={{ padding: "1rem 1.25rem", background: "var(--error-bg)", borderRadius: "var(--radius-md)", color: "var(--error)", border: "1px solid rgba(239,68,68,0.3)", fontSize: "0.875rem", marginBottom: "1.5rem" }}>
          {error}
        </div>
      )}

      {results.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "2rem" }}>
          {results.map((r, i) => {
            const isWalletA = i === 0;
            return (
              <div
                key={r.address + i}
                className="glass-card"
                style={{
                  padding: "1.5rem",
                  borderColor: r.accessGranted ? "var(--success)" : "rgba(239,68,68,0.4)",
                  background: r.accessGranted ? "rgba(34,197,94,0.04)" : "rgba(239,68,68,0.04)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem", flexWrap: "wrap" }}>
                  <div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", marginBottom: "0.25rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      {resultLabels[i] || (isWalletA ? "Wallet A" : "Wallet B")}
                    </div>
                    <code style={{ fontSize: "0.875rem", color: "var(--text-primary)", fontFamily: "monospace" }}>
                      {r.address.slice(0, 10)}…{r.address.slice(-8)}
                    </code>
                  </div>

                  <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", flexWrap: "wrap" }}>
                    {r.verified ? (
                      <span style={{ fontSize: "0.8rem", fontWeight: 700, color: TIER_COLORS[r.tier], background: "var(--bg-card)", padding: "0.3rem 0.75rem", borderRadius: "var(--radius-full)", border: `1px solid ${TIER_COLORS[r.tier]}33` }}>
                        Tier {r.tier} · {TIER_LABELS[r.tier]}
                      </span>
                    ) : (
                      <span style={{ fontSize: "0.8rem", color: "var(--text-tertiary)", background: "var(--bg-card)", padding: "0.3rem 0.75rem", borderRadius: "var(--radius-full)", border: "1px solid var(--border)" }}>
                        Not Verified
                      </span>
                    )}

                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      padding: "0.5rem 1rem",
                      borderRadius: "var(--radius-md)",
                      background: r.accessGranted ? "var(--success-bg)" : "var(--error-bg)",
                      border: `1px solid ${r.accessGranted ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)"}`,
                    }}>
                      <span style={{ fontSize: "1rem" }}>{r.accessGranted ? "✓" : "✕"}</span>
                      <span style={{ fontSize: "0.875rem", fontWeight: 700, color: r.accessGranted ? "var(--success)" : "var(--error)" }}>
                        {r.accessGranted ? "Access Granted" : "Access Denied"}
                      </span>
                    </div>
                  </div>
                </div>

                {!r.accessGranted && r.verified && (
                  <p style={{ marginTop: "0.75rem", fontSize: "0.8rem", color: "var(--text-tertiary)" }}>
                    Has Tier {r.tier}, but this protocol requires Tier {r.requiredTier} ({TIER_LABELS[r.requiredTier]}).{" "}
                    <Link href="/verify" style={{ color: "var(--accent-light)" }}>Upgrade verification →</Link>
                  </p>
                )}
                {!r.accessGranted && !r.verified && (
                  <p style={{ marginTop: "0.75rem", fontSize: "0.8rem", color: "var(--text-tertiary)" }}>
                    No active credential found for this address.{" "}
                    <Link href="/verify" style={{ color: "var(--accent-light)" }}>Get verified →</Link>
                  </p>
                )}
                {r.accessGranted && r.expiry > 0 && (
                  <p style={{ marginTop: "0.75rem", fontSize: "0.8rem", color: "var(--text-tertiary)" }}>
                    Valid until {new Date(r.expiry * 1000).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── Custom Address Check ── */}
      <div className="glass-card" style={{ padding: "1.75rem", marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.4rem" }}>
          {t("customTitle")}
        </h2>
        <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "1.25rem" }}>
          {t("customDesc")}
        </p>

        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginBottom: "1rem" }}>
          <input
            type="text"
            placeholder="0x... wallet address"
            value={customAddress}
            onChange={(e) => setCustomAddress(e.target.value)}
            style={{
              flex: 1,
              minWidth: "260px",
              background: "var(--bg-secondary)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-md)",
              padding: "0.65rem 1rem",
              color: "var(--text-primary)",
              fontSize: "0.875rem",
              fontFamily: "monospace",
              outline: "none",
            }}
          />
          <select
            value={customRequiredTier}
            onChange={(e) => setCustomRequiredTier(Number(e.target.value))}
            style={{
              background: "var(--bg-secondary)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-md)",
              padding: "0.65rem 1rem",
              color: "var(--text-primary)",
              fontSize: "0.875rem",
              outline: "none",
              cursor: "pointer",
            }}
          >
            {[1, 2, 3, 4, 5].map((t) => (
              <option key={t} value={t}>Required: Tier {t} ({TIER_LABELS[t]})</option>
            ))}
          </select>
          <button
            className="btn btn-primary"
            onClick={handleCustomCheck}
            disabled={loading}
            style={{ padding: "0.65rem 1.25rem", fontSize: "0.875rem" }}
          >
            {loading ? "…" : t("checkBtn")}
          </button>
        </div>
      </div>

      {/* ── Solidity snippet ── */}
      <div className="glass-card" style={{ padding: "1.75rem" }}>
        <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.4rem" }}>
          {t("solidityTitle")}
        </h2>
        <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "1.25rem" }}>
          {t("solidityDesc")}
        </p>
        <pre style={{
          background: "var(--bg-secondary)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-md)",
          padding: "1.25rem",
          fontSize: "0.82rem",
          color: "var(--text-primary)",
          overflowX: "auto",
          lineHeight: 1.6,
          margin: 0,
        }}>
{`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

interface IAttestationStore {
    function verify(address subject) external view returns (
        bool verified,
        uint32 tier,
        uint64 timestamp,
        uint64 expiry
    );
}

contract MyProtocol {
    IAttestationStore public immutable kumply;
    uint32 public immutable requiredTier;

    constructor(address _kumply, uint32 _requiredTier) {
        kumply = IAttestationStore(_kumply);
        requiredTier = _requiredTier;
    }

    modifier onlyCompliant() {
        (bool verified, uint32 tier, , uint64 expiry) =
            kumply.verify(msg.sender);
        require(
            verified && tier >= requiredTier && expiry > block.timestamp,
            "KUMPLY: insufficient compliance tier"
        );
        _;
    }

    // Add onlyCompliant to any function you want to gate
    function deposit(uint256 amount) external onlyCompliant {
        // only verified users reach here
    }
}`}
        </pre>
        <div style={{ marginTop: "1rem", display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <Link href="/developers" className="btn btn-secondary" style={{ fontSize: "0.85rem", padding: "0.5rem 1rem" }}>
            Full SDK Docs →
          </Link>
          <Link href="/verify" className="btn btn-primary" style={{ fontSize: "0.85rem", padding: "0.5rem 1rem" }}>
            Get Verified →
          </Link>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 640px) {
          .use-case-grid { grid-template-columns: 1fr !important; }
        }
      ` }} />
    </div>
  );
}
