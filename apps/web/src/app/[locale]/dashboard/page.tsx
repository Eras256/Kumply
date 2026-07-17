"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useAccount } from "wagmi";
import { useAppKit } from "@reown/appkit/react";
import { useTranslations } from "next-intl";
import { createPublicClient, http, parseAbiItem } from "viem";
import { avalancheFuji, avalanche } from "viem/chains";
import { KumplyClient, ATTESTATION_STORE_ABI } from "@kumply/sdk";
import { useKumplyNetwork } from "@/providers/KumplyNetworkProvider";

const TIER_COLORS: Record<number, string> = {
  1: "var(--text-secondary)",
  2: "var(--info)",
  3: "var(--accent)",
  4: "#a855f7",
  5: "var(--success)",
};

const TIER_LABELS: Record<number, string> = {
  1: "Basic",
  2: "Standard",
  3: "Enhanced",
  4: "Business / KYB",
  5: "Agent / KYA",
};

interface AttestationEvent {
  subject: `0x${string}`;
  tier: number;
  expiry: bigint;
  verifier: `0x${string}`;
  txHash: `0x${string}`;
  blockNumber: bigint;
}

interface AttestationStatus {
  verified: boolean;
  tier: number;
  timestamp: number;
  expiry: number;
}

export default function DashboardPage() {
  const t = useTranslations("Dashboard");
  const { address, isConnected } = useAccount();
  const { open } = useAppKit();
  const { network, contractAddress, rpcUrl } = useKumplyNetwork();

  const [events, setEvents] = useState<AttestationEvent[]>([]);
  const [totalAttestations, setTotalAttestations] = useState<number | null>(null);
  const [verificationFee, setVerificationFee] = useState<bigint | null>(null);
  const [totalFeesCollected, setTotalFeesCollected] = useState<bigint | null>(null);
  const [loading, setLoading] = useState(false);
  const [lookupAddress, setLookupAddress] = useState("");
  const [lookupResult, setLookupResult] = useState<AttestationStatus | null>(null);
  const [lookupError, setLookupError] = useState<string | null>(null);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [tierStats, setTierStats] = useState<Record<number, number>>({});

  const chain = network === "mainnet" ? avalanche : avalancheFuji;
  const explorerUrl = network === "mainnet" ? "https://snowtrace.io" : "https://testnet.snowtrace.io";

  const publicClient = useMemo(
    () =>
      createPublicClient({
        chain,
        transport: http(rpcUrl),
      }),
    [chain, rpcUrl]
  );

  const fetchDashboardData = useCallback(async () => {
    if (!contractAddress) return;
    setLoading(true);
    try {
      const kumplyClient = new KumplyClient({ network, contractAddress });
      const [total, fee, collected] = await Promise.all([
        kumplyClient.getTotalAttestations(),
        kumplyClient.getVerificationFee(),
        kumplyClient.getTotalFeesCollected(),
      ]);
      setTotalAttestations(total);
      setVerificationFee(fee);
      setTotalFeesCollected(collected);

      // Read from block 0 to capture all historical attestations. Public RPCs
      // reject unbounded ranges on C-Chain mainnet, so fall back to the most
      // recent ~2048 blocks if the full-range query is refused.
      const attestationEvent = parseAbiItem(
        "event AttestationIssued(address indexed subject, uint32 tier, uint64 expiry, address indexed verifier)"
      );
      let logs;
      try {
        logs = await publicClient.getLogs({
          address: contractAddress,
          event: attestationEvent,
          fromBlock: 0n,
        });
      } catch {
        const latest = await publicClient.getBlockNumber();
        logs = await publicClient.getLogs({
          address: contractAddress,
          event: attestationEvent,
          fromBlock: latest > 2000n ? latest - 2000n : 0n,
        });
      }

      const parsed: AttestationEvent[] = logs
        .slice(-50) // last 50 events
        .reverse()
        .map((log) => ({
          subject: log.args.subject as `0x${string}`,
          tier: Number(log.args.tier),
          expiry: log.args.expiry as bigint,
          verifier: log.args.verifier as `0x${string}`,
          txHash: log.transactionHash as `0x${string}`,
          blockNumber: log.blockNumber as bigint,
        }));

      setEvents(parsed);

      // Compute tier distribution
      const stats: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      for (const e of parsed) {
        stats[e.tier] = (stats[e.tier] || 0) + 1;
      }
      setTierStats(stats);
    } catch (e) {
      console.error("Dashboard fetch error:", e);
    } finally {
      setLoading(false);
    }
  }, [contractAddress, network, publicClient]);

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, [fetchDashboardData]);

  async function lookupWallet() {
    const addr = lookupAddress.trim();
    if (!/^0x[0-9a-fA-F]{40}$/.test(addr)) {
      setLookupError("Invalid Ethereum address");
      return;
    }
    setLookupLoading(true);
    setLookupError(null);
    setLookupResult(null);
    try {
      const client = new KumplyClient({ network, contractAddress });
      const result = await client.verify(addr);
      setLookupResult(result);
    } catch {
      setLookupError("Could not query the contract. Check your connection.");
    } finally {
      setLookupLoading(false);
    }
  }

  function formatAvax(wei: bigint | null): string {
    if (wei === null) return "—";
    if (wei === 0n) return "Free";
    const avax = Number(wei) / 1e18;
    if (avax < 0.0001) return `< 0.0001 AVAX`;
    return `${avax.toFixed(4)} AVAX`;
  }

  function shortAddr(addr: string) {
    return addr.slice(0, 8) + "…" + addr.slice(-6);
  }

  function formatDate(ts: number) {
    if (!ts) return "—";
    return new Date(ts * 1000).toLocaleDateString(undefined, {
      year: "numeric", month: "short", day: "numeric",
    });
  }

  const isExpired = (expiry: number) => expiry > 0 && expiry < Date.now() / 1000;

  return (
    <div className="container dashboard-container">
      {/* ── Header ── */}
      <div style={{ marginBottom: "2.5rem" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "var(--bg-card)", padding: "0.4rem 1rem", borderRadius: "var(--radius-full)", border: "1px solid var(--border)", marginBottom: "1rem" }}>
          <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--success)", boxShadow: "0 0 10px var(--success)", flexShrink: 0 }}></span>
          <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--text-secondary)" }}>{network === "mainnet" ? "Mainnet C-Chain · Live" : "Fuji Testnet · Live"}</span>
        </div>
        <h1 className="page-title dashboard-title">
          {t("title")}
        </h1>
        <p className="page-description" style={{ marginLeft: 0, textAlign: "left" }}>
          {t("subtitle")}
        </p>
      </div>

      {/* ── Stats Row ── */}
      <div className="dashboard-stats-grid">
        <div className="glass-card" style={{ textAlign: "center", padding: "1.5rem" }}>
          <div style={{ fontSize: "2.5rem", fontWeight: 800, color: "var(--accent)", marginBottom: "0.25rem" }}>
            {loading ? "—" : (totalAttestations ?? "—")}
          </div>
          <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>{t("statTotal")}</div>
        </div>
        {[2, 3, 4].map((tier) => (
          <div key={tier} className="glass-card" style={{ textAlign: "center", padding: "1.5rem" }}>
            <div style={{ fontSize: "2.5rem", fontWeight: 800, color: TIER_COLORS[tier], marginBottom: "0.25rem" }}>
              {loading ? "—" : (tierStats[tier] ?? 0)}
            </div>
            <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              {TIER_LABELS[tier]}
            </div>
          </div>
        ))}
      </div>

      {/* ── Fee Metrics Row ── */}
      <div className="fee-grid">
        <div className="glass-card" style={{ padding: "1.25rem 1.5rem", display: "flex", alignItems: "center", gap: "1.25rem" }}>
          <div style={{ width: "40px", height: "40px", borderRadius: "var(--radius-md)", background: "rgba(99,102,241,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
          </div>
          <div>
            <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--text-primary)", lineHeight: 1.2 }}>
              {loading ? "—" : formatAvax(verificationFee)}
            </div>
            <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em", marginTop: "0.2rem" }}>
              Verify Once Fee
            </div>
          </div>
        </div>
        <div className="glass-card" style={{ padding: "1.25rem 1.5rem", display: "flex", alignItems: "center", gap: "1.25rem" }}>
          <div style={{ width: "40px", height: "40px", borderRadius: "var(--radius-md)", background: "rgba(16,185,129,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
          </div>
          <div>
            <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--text-primary)", lineHeight: 1.2 }}>
              {loading ? "—" : formatAvax(totalFeesCollected)}
            </div>
            <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em", marginTop: "0.2rem" }}>
              Protocol Revenue
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* ── Address Lookup ── */}
        <div className="glass-card" style={{ padding: "1.75rem" }}>
          <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.4rem" }}>
            {t("lookupTitle")}
          </h2>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "1.25rem", lineHeight: 1.5 }}>
            {t("lookupDesc")}
          </p>

          <div className="lookup-form">
            <input
              type="text"
              placeholder="0x..."
              value={lookupAddress}
              onChange={(e) => setLookupAddress(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && lookupWallet()}
              style={{
                flex: 1,
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
            <button
              className="btn btn-primary"
              onClick={lookupWallet}
              disabled={lookupLoading}
              style={{ padding: "0.65rem 1.25rem", fontSize: "0.875rem" }}
            >
              {lookupLoading ? "…" : t("lookupBtn")}
            </button>
          </div>

          {lookupError && (
            <div style={{ padding: "0.75rem 1rem", background: "var(--error-bg)", borderRadius: "var(--radius-md)", color: "var(--error)", fontSize: "0.85rem", border: "1px solid rgba(239,68,68,0.3)" }}>
              {lookupError}
            </div>
          )}

          {lookupResult && (
            <div style={{ background: "var(--bg-secondary)", borderRadius: "var(--radius-md)", border: "1px solid var(--border)", overflow: "hidden" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.75rem 1rem", borderBottom: "1px solid var(--border)" }}>
                <span style={{ fontSize: "0.8rem", color: "var(--text-tertiary)" }}>{t("status")}</span>
                {lookupResult.verified && !isExpired(lookupResult.expiry) ? (
                  <span className="badge badge-success">✓ Verified</span>
                ) : isExpired(lookupResult.expiry) ? (
                  <span className="badge" style={{ background: "var(--warning-bg)", color: "var(--warning)", border: "1px solid rgba(245,158,11,0.3)" }}>Expired</span>
                ) : (
                  <span className="badge" style={{ background: "var(--bg-card)", color: "var(--text-tertiary)", border: "1px solid var(--border)" }}>Not Verified</span>
                )}
              </div>
              {lookupResult.verified && (
                <>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "0.75rem 1rem", borderBottom: "1px solid var(--border)" }}>
                    <span style={{ fontSize: "0.8rem", color: "var(--text-tertiary)" }}>{t("tier")}</span>
                    <span style={{ fontSize: "0.875rem", fontWeight: 700, color: TIER_COLORS[lookupResult.tier] }}>
                      {TIER_LABELS[lookupResult.tier] || `Tier ${lookupResult.tier}`}
                    </span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "0.75rem 1rem", borderBottom: "1px solid var(--border)" }}>
                    <span style={{ fontSize: "0.8rem", color: "var(--text-tertiary)" }}>{t("issuedAt")}</span>
                    <span style={{ fontSize: "0.875rem", color: "var(--text-primary)" }}>{formatDate(lookupResult.timestamp)}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "0.75rem 1rem" }}>
                    <span style={{ fontSize: "0.8rem", color: "var(--text-tertiary)" }}>{t("validUntil")}</span>
                    <span style={{ fontSize: "0.875rem", color: isExpired(lookupResult.expiry) ? "var(--error)" : "var(--text-primary)" }}>
                      {formatDate(lookupResult.expiry)}
                    </span>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Quick lookup: connected wallet */}
          {isConnected && address && (
            <button
              className="btn btn-secondary"
              onClick={() => { setLookupAddress(address); }}
              style={{ marginTop: "1rem", fontSize: "0.8rem", padding: "0.5rem 1rem" }}
            >
              {t("useMyWallet")}
            </button>
          )}
          {!isConnected && (
            <button
              className="btn btn-secondary"
              onClick={() => open()}
              style={{ marginTop: "1rem", fontSize: "0.8rem", padding: "0.5rem 1rem" }}
            >
              {t("connectToLookup")}
            </button>
          )}
        </div>

        {/* ── Tier Distribution ── */}
        <div className="glass-card" style={{ padding: "1.75rem" }}>
          <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.25rem" }}>
            {t("tierDistTitle")}
          </h2>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "1.5rem" }}>
            {t("tierDistDesc")}
          </p>

          {loading ? (
            <div style={{ display: "flex", justifyContent: "center", padding: "2rem" }}>
              <div style={{ width: "32px", height: "32px", border: "3px solid var(--accent)", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {[1, 2, 3, 4, 5].map((tier) => {
                const count = tierStats[tier] || 0;
                const total = Object.values(tierStats).reduce((a, b) => a + b, 0);
                const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                return (
                  <div key={tier}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.3rem" }}>
                      <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                        <span style={{ color: TIER_COLORS[tier], fontWeight: 600 }}>Tier {tier}</span> — {TIER_LABELS[tier]}
                      </span>
                      <span style={{ fontSize: "0.8rem", color: "var(--text-tertiary)" }}>{count} ({pct}%)</span>
                    </div>
                    <div style={{ height: "6px", background: "var(--bg-secondary)", borderRadius: "var(--radius-full)", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${pct}%`, background: TIER_COLORS[tier], borderRadius: "var(--radius-full)", transition: "width 0.5s ease" }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="dashboard-actions">
            <a
              href={`${explorerUrl}/address/${contractAddress}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary"
            >
              {t("viewContract")} ↗
            </a>
            <button
              onClick={fetchDashboardData}
              disabled={loading}
              className="btn btn-secondary"
            >
              {t("refresh")}
            </button>
          </div>
        </div>
      </div>

      {/* ── Recent Attestations Table ── */}
      <div className="glass-card" style={{ padding: "1.75rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <div>
            <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.2rem" }}>
              {t("recentTitle")}
            </h2>
            <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>{t("recentDesc")}</p>
          </div>
          <span style={{ fontSize: "0.78rem", color: "var(--text-tertiary)", background: "var(--bg-secondary)", padding: "0.3rem 0.75rem", borderRadius: "var(--radius-full)", border: "1px solid var(--border)" }}>
            Auto-refresh 30s
          </span>
        </div>

        {loading && events.length === 0 ? (
          <div style={{ textAlign: "center", padding: "3rem", color: "var(--text-tertiary)" }}>
            <div style={{ width: "32px", height: "32px", border: "3px solid var(--accent)", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 1rem" }} />
            {t("loading")}
          </div>
        ) : events.length === 0 ? (
          <div style={{ textAlign: "center", padding: "3rem", color: "var(--text-tertiary)" }}>
            <p style={{ fontSize: "0.9rem" }}>{t("noEvents")}</p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)" }}>
                  {["Subject", "Tier", "Expires", "Tx Hash"].map((h) => (
                    <th key={h} style={{ textAlign: "left", padding: "0.6rem 0.75rem", fontSize: "0.75rem", color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {events.map((ev, i) => (
                  <tr
                    key={ev.txHash + i}
                    style={{ borderBottom: "1px solid var(--border)", transition: "background 0.15s" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-secondary)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <td style={{ padding: "0.75rem", fontFamily: "monospace", color: "var(--text-primary)" }}>
                      <a href={`${explorerUrl}/address/${ev.subject}`} target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent-light)", textDecoration: "none" }}>
                        {shortAddr(ev.subject)}
                      </a>
                    </td>
                    <td style={{ padding: "0.75rem" }}>
                      <span style={{ fontWeight: 700, color: TIER_COLORS[ev.tier] }}>
                        Tier {ev.tier} — {TIER_LABELS[ev.tier]}
                      </span>
                    </td>
                    <td style={{ padding: "0.75rem", color: "var(--text-secondary)" }}>
                      {formatDate(Number(ev.expiry))}
                    </td>
                    <td style={{ padding: "0.75rem", fontFamily: "monospace" }}>
                      <a href={`${explorerUrl}/tx/${ev.txHash}`} target="_blank" rel="noopener noreferrer" style={{ color: "var(--text-tertiary)", textDecoration: "none", fontSize: "0.8rem" }}>
                        {shortAddr(ev.txHash)} ↗
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .dashboard-container { padding-top: 3rem; padding-bottom: 4rem; }
        .dashboard-title { font-size: 2.5rem; margin-bottom: 0.5rem; }
        .dashboard-stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem; margin-bottom: 1rem; }
        .fee-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin-bottom: 2rem; }
        .dashboard-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 2rem; }
        .lookup-form { display: flex; gap: 0.75rem; margin-bottom: 1rem; }
        .dashboard-actions { display: flex; gap: 0.5rem; flex-wrap: wrap; margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid var(--border); }
        .dashboard-actions .btn { font-size: 0.8rem; padding: 0.5rem 1rem; display: inline-flex; align-items: center; gap: 0.4rem; }
        
        @media (max-width: 768px) {
          .dashboard-grid { grid-template-columns: 1fr; }
          .fee-grid { grid-template-columns: 1fr; }
          .dashboard-title { font-size: 2rem; }
        }
        @media (max-width: 480px) {
          .lookup-form { flex-direction: column; }
          .dashboard-container { padding-top: 1.5rem; padding-bottom: 2.5rem; }
          .dashboard-title { font-size: 1.75rem; }
        }
      ` }} />
    </div>
  );
}
