"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { useAccount, useConnect } from "wagmi";
import { injected } from "wagmi/connectors";
import { useLocale, useTranslations } from "next-intl";
import { KumplyClient } from "@kumply/sdk";

type VerifyStep = "connect" | "tierSelect" | "kyc" | "pending" | "done" | "error";

const ATTESTATION_STORE = process.env.NEXT_PUBLIC_CONTRACT_ATTESTATION_STORE as `0x${string}`;

const TIER_OPTIONS = [
  { levelName: "basic-kyc",    tier: 1, recommended: false, icon: "🔵" },
  { levelName: "standard-kyc", tier: 2, recommended: true,  icon: "⭐" },
  { levelName: "enhanced-kyc", tier: 3, recommended: false, icon: "🛡️" },
  { levelName: "business-kyb", tier: 4, recommended: false, icon: "🏢" },
  { levelName: "agent-kya",    tier: 5, recommended: false, icon: "🤖" },
] as const;


export default function VerifyPage() {
  const t = useTranslations("Verify");
  const locale = useLocale();
  const searchParams = useSearchParams();
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const [step, setStep] = useState<VerifyStep>("connect");
  const validLevels = ["basic-kyc", "standard-kyc", "enhanced-kyc", "business-kyb", "agent-kya"];
  const levelParam = searchParams.get("level") ?? "";
  const [selectedLevel, setSelectedLevel] = useState<string>(validLevels.includes(levelParam) ? levelParam : "standard-kyc");
  const [attestation, setAttestation] = useState<{ tier: number; expiry: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const sumsubContainerRef = useRef<HTMLDivElement>(null);
  const sdkLaunchedRef = useRef(false);

  const getTierName = (tier: number) => ({
    1: t("tier1Name"), 2: t("tier2Name"), 3: t("tier3Name"), 4: t("tier4Name"), 5: t("tier5Name"),
  }[tier] ?? `Tier ${tier}`);

  const getTierDesc = (tier: number) => ({
    1: t("tier1Desc"), 2: t("tier2Desc"), 3: t("tier3Desc"), 4: t("tier4Desc"), 5: t("tier5Desc"),
  }[tier] ?? "");

  const checkExistingAttestation = useCallback(async () => {
    if (!address || !ATTESTATION_STORE) { setStep("tierSelect"); return; }
    try {
      const client = new KumplyClient({ network: "fuji", contractAddress: ATTESTATION_STORE });
      const result = await client.verify(address);
      if (result.verified) {
        setAttestation({ tier: result.tier, expiry: result.expiry });
        setStep("done");
      } else {
        setStep("tierSelect");
      }
    } catch {
      setStep("tierSelect");
    }
  }, [address]);

  useEffect(() => {
    if (isConnected && step === "connect") {
      checkExistingAttestation();
    }
  }, [isConnected, step, checkExistingAttestation]);

  async function launchSumsub() {
    if (!address || sdkLaunchedRef.current) return;
    setError(null);
    sdkLaunchedRef.current = true;

    try {
      const tokenRes = await fetch(`/api/token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: address, levelName: selectedLevel }),
      });

      if (!tokenRes.ok) {
        const err = await tokenRes.json();
        throw new Error(err.error || "Failed to get verification token");
      }

      const { token } = await tokenRes.json();
      if (typeof window === "undefined") return;

      const { default: SumsubWebSdk } = await import("@sumsub/websdk");

      const launchedSdk = SumsubWebSdk.init(token, () =>
        fetch(`/api/token`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: address, levelName: selectedLevel }),
        })
          .then((r) => r.json())
          .then((d) => d.token)
      )
        .withConf({ lang: locale })
        .withOptions({ addViewportTag: false, adaptIframeHeight: true })
        .on("idCheck.onApplicantStatusChanged", async (data: any) => {
          if (data?.reviewResult?.reviewAnswer === "GREEN") {
            setStep("pending");
            await pollAttestation(address, 24, 5000);
          }
        })
        .on("idCheck.onError", (err: any) => {
          sdkLaunchedRef.current = false;
          setError(`${t("verifyError")}: ${err?.message || "Unknown error"}`);
        })
        .build();

      if (sumsubContainerRef.current) {
        launchedSdk.launch(`#sumsub-container`);
      }
    } catch (e: any) {
      sdkLaunchedRef.current = false;
      setError(e.message || t("launchError"));
    }
  }

  async function pollAttestation(addr: string, retries: number, intervalMs: number) {
    if (!ATTESTATION_STORE) { setError(t("pollError")); setStep("error"); return; }
    const client = new KumplyClient({ network: "fuji", contractAddress: ATTESTATION_STORE });
    for (let i = 0; i < retries; i++) {
      await new Promise((r) => setTimeout(r, intervalMs));
      try {
        const result = await client.verify(addr);
        if (result.verified) {
          setAttestation({ tier: result.tier, expiry: result.expiry });
          setStep("done");
          return;
        }
      } catch { /* continue */ }
    }
    setError(t("pollError"));
    setStep("error");
  }

  const WalletBar = () => (
    <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem", padding: "0.75rem 1rem", background: "var(--bg-secondary)", borderRadius: "var(--radius-md)", border: "1px solid var(--border)" }}>
      <div>
        <p style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", marginBottom: "0.15rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>{t("walletLabel")}</p>
        <code style={{ fontSize: "0.85rem", color: "var(--accent-light)", fontFamily: "monospace" }}>{address?.slice(0, 10)}…{address?.slice(-6)}</code>
      </div>
      <span className="badge badge-success" style={{ marginLeft: "auto" }}>
        <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "currentColor", display: "inline-block" }}></span>
        {t("connectedBadge")}
      </span>
    </div>
  );

  return (
    <div className="container" style={{ paddingTop: "3rem", paddingBottom: "4rem", maxWidth: "720px" }}>

      {/* ── Connect Wallet ── */}
      {step === "connect" && (
        <div style={{ textAlign: "center", paddingTop: "2rem" }}>
          <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "linear-gradient(135deg, var(--accent), var(--accent-dark))", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 2rem", boxShadow: "var(--shadow-glow-strong)" }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
              <path d="M19 7V4C19 3 18 2 17 2H3C2 2 1 3 1 4V20C1 21 2 22 3 22H17C18 22 19 21 19 20V17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M23 12H13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M20 9L23 12L20 15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className="page-title" style={{ fontSize: "2.25rem", marginBottom: "1rem" }}>{t("pageTitle")}</h1>
          <p className="page-description" style={{ marginBottom: "2.5rem" }}>{t("pageDesc")}</p>
          <button className="btn btn-primary" style={{ fontSize: "1rem", padding: "0.9rem 2.25rem" }} onClick={() => connect({ connector: injected() })}>
            {t("connectBtn")}
          </button>
          <p style={{ marginTop: "1.5rem", fontSize: "0.8rem", color: "var(--text-tertiary)" }}>⚠ {t("testnetWarning")}</p>
        </div>
      )}

      {/* ── Tier Selector ── */}
      {step === "tierSelect" && (
        <div>
          <WalletBar />
          <h1 className="page-title" style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>{t("tierSelectTitle")}</h1>
          <p style={{ color: "var(--text-secondary)", marginBottom: "2rem", fontSize: "0.9rem", lineHeight: 1.6 }}>{t("tierSelectDesc")}</p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1rem", marginBottom: "2rem", paddingTop: "0.75rem" }}>
            {TIER_OPTIONS.map(({ levelName, tier, recommended, icon }) => {
              const selected = selectedLevel === levelName;
              return (
                <button
                  key={levelName}
                  onClick={() => setSelectedLevel(levelName)}
                  style={{
                    position: "relative",
                    textAlign: "left",
                    padding: "1.25rem",
                    background: selected ? "var(--accent-glow, rgba(220,38,38,0.12))" : "var(--bg-card)",
                    border: `2px solid ${selected ? "var(--accent)" : "var(--border)"}`,
                    borderRadius: "var(--radius-lg)",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                    color: "var(--text-primary)",
                  }}
                >
                  {recommended && (
                    <span style={{ position: "absolute", top: "-10px", right: "12px", background: "var(--accent)", color: "white", fontSize: "0.65rem", fontWeight: 700, padding: "2px 8px", borderRadius: "999px", letterSpacing: "0.04em", textTransform: "uppercase" }}>
                      {t("recommended")}
                    </span>
                  )}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                    <span style={{ fontSize: "1.4rem" }}>{icon}</span>
                    {selected && (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" fill="var(--accent)"/>
                        <path d="M8 12l3 3 5-5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                  <p style={{ fontSize: "0.65rem", color: "var(--accent)", fontWeight: 700, marginBottom: "0.2rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    Tier {tier}
                  </p>
                  <p style={{ fontWeight: 700, fontSize: "1rem", marginBottom: "0.4rem", color: "var(--text-primary)" }}>
                    {getTierName(tier)}
                  </p>
                  <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                    {getTierDesc(tier)}
                  </p>
                </button>
              );
            })}
          </div>

          <div style={{ textAlign: "center" }}>
            <button
              className="btn btn-primary"
              style={{ fontSize: "1rem", padding: "0.85rem 2.5rem" }}
              onClick={() => setStep("kyc")}
            >
              {t("tierSelectBtn")}
            </button>
          </div>
        </div>
      )}

      {/* ── KYC Step ── */}
      {step === "kyc" && (
        <div>
          <WalletBar />
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
            <h1 className="page-title" style={{ fontSize: "2rem", margin: 0 }}>{t("pageTitle")}</h1>
            <button
              onClick={() => { sdkLaunchedRef.current = false; setStep("tierSelect"); }}
              style={{ marginLeft: "auto", fontSize: "0.8rem", color: "var(--text-tertiary)", background: "none", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "0.3rem 0.75rem", cursor: "pointer" }}
            >
              ← {t("tierSelectTitle").split(" ")[0]}
            </button>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem", padding: "0.5rem 0.85rem", background: "var(--accent-glow, rgba(220,38,38,0.08))", border: "1px solid rgba(220,38,38,0.25)", borderRadius: "var(--radius-md)" }}>
            <span style={{ fontSize: "0.75rem", color: "var(--accent)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              {TIER_OPTIONS.find(o => o.levelName === selectedLevel)?.icon} Tier {TIER_OPTIONS.find(o => o.levelName === selectedLevel)?.tier} — {getTierName(TIER_OPTIONS.find(o => o.levelName === selectedLevel)?.tier ?? 2)}
            </span>
          </div>

          <p style={{ color: "var(--text-secondary)", marginBottom: "1.5rem", fontSize: "0.9rem", lineHeight: 1.6 }}>{t("kycExplainer")}</p>

          <div id="sumsub-container" ref={sumsubContainerRef} style={{ minHeight: "420px", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", background: "var(--bg-card)", overflow: "hidden", marginBottom: "1.5rem" }} />

          {!sdkLaunchedRef.current && (
            <div style={{ textAlign: "center" }}>
              <button className="btn btn-primary" style={{ fontSize: "1rem", padding: "0.85rem 2rem" }} onClick={launchSumsub}>
                {t("launchBtn")}
              </button>
            </div>
          )}

          {error && (
            <div style={{ marginTop: "1rem", padding: "1rem 1.25rem", background: "var(--error-bg)", borderRadius: "var(--radius-md)", color: "var(--error)", border: "1px solid rgba(239,68,68,0.3)", fontSize: "0.875rem" }}>
              {error}
            </div>
          )}
        </div>
      )}

      {/* ── Pending ── */}
      {step === "pending" && (
        <div style={{ textAlign: "center", paddingTop: "4rem" }}>
          <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "var(--accent-glow)", border: "2px solid var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 2rem" }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "1rem", color: "var(--text-primary)" }}>{t("pendingTitle")}</h2>
          <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, maxWidth: "420px", margin: "0 auto 2.5rem" }}>{t("pendingDesc")}</p>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div style={{ width: "40px", height: "40px", border: "3px solid var(--accent)", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
          </div>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {/* ── Done ── */}
      {step === "done" && attestation && (
        <div style={{ textAlign: "center", paddingTop: "2rem" }}>
          <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "var(--success-bg)", border: "2px solid var(--success)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 2rem", boxShadow: "0 0 30px rgba(34,197,94,0.3)" }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
              <path d="M9 12l2 2 4-4" stroke="var(--success)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="12" cy="12" r="9" stroke="var(--success)" strokeWidth="2"/>
            </svg>
          </div>
          <h1 className="page-title" style={{ fontSize: "2rem", color: "var(--success)", marginBottom: "0.5rem" }}>{t("doneTitle")}</h1>
          <p style={{ color: "var(--text-secondary)", marginBottom: "2.5rem" }}>{t("doneDesc")}</p>

          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "1.75rem", maxWidth: "420px", margin: "0 auto 2rem", textAlign: "left" }}>
            {[
              { label: t("tierLabel"), value: `Tier ${attestation.tier} — ${getTierName(attestation.tier)}`, accent: true },
              { label: t("addressLabel"), value: `${address?.slice(0, 8)}…${address?.slice(-6)}`, mono: true },
              { label: t("expiresLabel"), value: new Date(attestation.expiry * 1000).toLocaleDateString() },
            ].map(({ label, value, accent, mono }, i, arr) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.6rem 0", borderBottom: i < arr.length - 1 ? "1px solid var(--border)" : "none" }}>
                <span style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>{label}</span>
                {mono
                  ? <code style={{ fontSize: "0.8rem", color: "var(--text-primary)", fontFamily: "monospace" }}>{value}</code>
                  : <span style={{ color: accent ? "var(--accent)" : "var(--text-primary)", fontWeight: accent ? 700 : 400, fontSize: "0.875rem" }}>{value}</span>
                }
              </div>
            ))}
          </div>

          <a href={`https://testnet.snowtrace.io/address/${ATTESTATION_STORE}`} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
            {t("snowtraceBtn")}
          </a>
        </div>
      )}

      {/* ── Error ── */}
      {step === "error" && (
        <div style={{ textAlign: "center", paddingTop: "3rem" }}>
          <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "var(--error-bg)", border: "2px solid var(--error)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 2rem" }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
              <path d="M12 9v4M12 17h.01" stroke="var(--error)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="var(--error)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "1rem", color: "var(--text-primary)" }}>{t("errorTitle")}</h2>
          <p style={{ color: "var(--text-secondary)", marginBottom: "2.5rem", lineHeight: 1.7, maxWidth: "400px", margin: "0 auto 2.5rem" }}>{error}</p>
          <button className="btn btn-secondary" onClick={() => { setStep("tierSelect"); sdkLaunchedRef.current = false; setError(null); }}>
            {t("tryAgainBtn")}
          </button>
        </div>
      )}
    </div>
  );
}
