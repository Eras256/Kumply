// Auto-generated from the KUMPLY grant pitch deck artifact (July 2026).
// Self-contained: rendered only on the standalone /pitch route.

export const DECK_CSS = `

  :root {
    --ink: #F2F0EE;
    --ink-2: #A8A5A1;
    --ink-3: #6E6B68;
    --ground: #0B0B0D;
    --panel: #141416;
    --panel-2: #1B1B1E;
    --line: #26262A;
    --crimson: #E5484D;
    --crimson-soft: rgba(229, 72, 77, 0.12);
    --live: #46A758;
    --live-soft: rgba(70, 167, 88, 0.12);
    --amber: #D9A036;
    --amber-soft: rgba(217, 160, 54, 0.12);
    --mono: ui-monospace, "SF Mono", "Cascadia Code", Menlo, Consolas, monospace;
    --sans: "Avenir Next", "Segoe UI", system-ui, -apple-system, sans-serif;
  }
  @media (prefers-color-scheme: light) {
    :root {
      --ink: #1C1917; --ink-2: #57534E; --ink-3: #8A8580;
      --ground: #FAF9F7; --panel: #FFFFFF; --panel-2: #F3F1EE;
      --line: #E5E2DE;
      --crimson: #C0323B; --crimson-soft: rgba(192, 50, 59, 0.09);
      --live: #2F7A3D; --live-soft: rgba(47, 122, 61, 0.10);
      --amber: #9A6D14; --amber-soft: rgba(154, 109, 20, 0.10);
    }
  }
  :root[data-theme="dark"] {
    --ink: #F2F0EE; --ink-2: #A8A5A1; --ink-3: #6E6B68;
    --ground: #0B0B0D; --panel: #141416; --panel-2: #1B1B1E;
    --line: #26262A;
    --crimson: #E5484D; --crimson-soft: rgba(229, 72, 77, 0.12);
    --live: #46A758; --live-soft: rgba(70, 167, 88, 0.12);
    --amber: #D9A036; --amber-soft: rgba(217, 160, 54, 0.12);
  }
  :root[data-theme="light"] {
    --ink: #1C1917; --ink-2: #57534E; --ink-3: #8A8580;
    --ground: #FAF9F7; --panel: #FFFFFF; --panel-2: #F3F1EE;
    --line: #E5E2DE;
    --crimson: #C0323B; --crimson-soft: rgba(192, 50, 59, 0.09);
    --live: #2F7A3D; --live-soft: rgba(47, 122, 61, 0.10);
    --amber: #9A6D14; --amber-soft: rgba(154, 109, 20, 0.10);
  }

  * { box-sizing: border-box; }
  body {
    background: var(--ground);
    color: var(--ink);
    font-family: var(--sans);
    line-height: 1.55;
    margin: 0;
    padding: 3rem 1.25rem 4rem;
    -webkit-font-smoothing: antialiased;
  }
  .deck { max-width: 960px; margin: 0 auto; display: flex; flex-direction: column; gap: 2rem; }

  .slide {
    background: var(--panel);
    border: 1px solid var(--line);
    border-radius: 14px;
    padding: 3rem 3.25rem;
    position: relative;
  }
  .slide-head {
    display: flex; justify-content: space-between; align-items: baseline;
    margin-bottom: 1.75rem;
  }
  .eyebrow {
    font-family: var(--mono); font-size: 0.72rem; letter-spacing: 0.14em;
    text-transform: uppercase; color: var(--crimson); font-weight: 600;
  }
  .slide-num { font-family: var(--mono); font-size: 0.72rem; color: var(--ink-3); }

  h1, h2 { text-wrap: balance; margin: 0; }
  h1 { font-size: 3.1rem; font-weight: 800; letter-spacing: -0.03em; line-height: 1.06; }
  h2 { font-size: 1.85rem; font-weight: 800; letter-spacing: -0.02em; line-height: 1.15; margin-bottom: 1.1rem; }
  h3 { font-size: 0.95rem; font-weight: 700; margin: 0 0 0.35rem; }
  p { margin: 0; }
  .lede { font-size: 1.08rem; color: var(--ink-2); max-width: 62ch; }
  .lede strong, .cell p strong, .note strong { color: var(--ink); font-weight: 700; }

  .badge {
    display: inline-flex; align-items: center; gap: 0.45em;
    font-family: var(--mono); font-size: 0.7rem; font-weight: 600;
    letter-spacing: 0.08em; text-transform: uppercase;
    padding: 0.3em 0.75em; border-radius: 999px;
  }
  .badge::before { content: ""; width: 6px; height: 6px; border-radius: 50%; background: currentColor; flex-shrink: 0; }
  .badge.live { color: var(--live); background: var(--live-soft); }
  .badge.warn { color: var(--amber); background: var(--amber-soft); }
  .badge.brand { color: var(--crimson); background: var(--crimson-soft); }

  .grid { display: grid; gap: 0.9rem; margin-top: 1.5rem; }
  .grid.cols-2 { grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); }
  .grid.cols-3 { grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); }
  .founder-cell { display: flex; gap: 1rem; align-items: flex-start; }
  .avatar {
    width: 56px; height: 56px; border-radius: 50%; flex-shrink: 0;
    object-fit: cover; border: 1px solid var(--line);
    background: var(--panel-2);
  }
  .founder-info { min-width: 0; }

  .cell {
    background: var(--panel-2); border: 1px solid var(--line);
    border-radius: 10px; padding: 1.15rem 1.3rem;
  }
  .cell p { font-size: 0.88rem; color: var(--ink-2); }
  .cell .kpi { font-size: 1.9rem; font-weight: 800; letter-spacing: -0.02em; font-variant-numeric: tabular-nums; }
  .cell .kpi-label { font-family: var(--mono); font-size: 0.7rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--ink-3); margin-top: 0.2rem; }

  code, .addr {
    font-family: var(--mono); font-size: 0.8rem;
    background: var(--panel-2); border: 1px solid var(--line);
    padding: 0.12em 0.45em; border-radius: 6px; color: var(--ink);
    word-break: break-all;
  }
  a { color: var(--crimson); text-decoration: none; border-bottom: 1px solid transparent; }
  a:hover, a:focus-visible { border-bottom-color: var(--crimson); }
  a:focus-visible { outline: 2px solid var(--crimson); outline-offset: 2px; border-radius: 2px; }

  table { width: 100%; border-collapse: collapse; margin-top: 1.4rem; font-size: 0.9rem; }
  th {
    text-align: left; font-family: var(--mono); font-size: 0.68rem;
    letter-spacing: 0.12em; text-transform: uppercase; color: var(--ink-3);
    font-weight: 600; padding: 0 0.9rem 0.6rem 0; border-bottom: 1px solid var(--line);
  }
  td { padding: 0.7rem 0.9rem 0.7rem 0; border-bottom: 1px solid var(--line); vertical-align: top; color: var(--ink-2); }
  td:first-child { color: var(--ink); font-weight: 600; white-space: nowrap; }
  tr:last-child td { border-bottom: none; }
  .table-wrap { overflow-x: auto; }
  .num { font-variant-numeric: tabular-nums; font-family: var(--mono); font-size: 0.85rem; }

  .flow { display: flex; flex-wrap: wrap; gap: 0.5rem; align-items: stretch; margin-top: 1.6rem; }
  .flow-step {
    flex: 1 1 150px; background: var(--panel-2); border: 1px solid var(--line);
    border-radius: 10px; padding: 0.9rem 1rem; position: relative;
  }
  .flow-step .step-label { font-family: var(--mono); font-size: 0.66rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--crimson); font-weight: 600; }
  .flow-step h3 { margin-top: 0.25rem; font-size: 0.9rem; }
  .flow-step p { font-size: 0.78rem; color: var(--ink-2); margin-top: 0.2rem; }

  .proof { display: flex; align-items: baseline; gap: 0.6rem; flex-wrap: wrap; margin-top: 0.4rem; }
  .proof .label { font-family: var(--mono); font-size: 0.68rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--ink-3); }

  .note {
    margin-top: 1.6rem; padding: 1rem 1.25rem; border-radius: 10px;
    background: var(--crimson-soft); border: 1px solid var(--crimson);
    font-size: 0.9rem; color: var(--ink-2);
  }
  .footer-links { display: flex; flex-wrap: wrap; gap: 1.4rem; margin-top: 1.6rem; font-family: var(--mono); font-size: 0.82rem; }
  .legal { margin-top: 2rem; font-size: 0.72rem; color: var(--ink-3); max-width: 72ch; line-height: 1.6; }

  .title-slide { padding: 4.5rem 3.25rem; }
  .wordmark { font-size: 1rem; font-weight: 800; letter-spacing: 0.22em; margin-bottom: 2.2rem; }
  .wordmark .dot { color: var(--crimson); }
  .title-badges { display: flex; gap: 0.6rem; flex-wrap: wrap; margin-top: 1.8rem; }

  @media (max-width: 640px) {
    .slide, .title-slide { padding: 2rem 1.4rem; }
    h1 { font-size: 2.1rem; }
    h2 { font-size: 1.45rem; }
  }
  @media (prefers-reduced-motion: no-preference) {
    .slide { transition: border-color 0.2s ease; }
    .slide:hover { border-color: var(--ink-3); }
  }

`;

export const DECK_HTML = `
<div class="deck">

  <!-- 01 · Title -->
  <section class="slide title-slide">
    <div class="slide-head">
      <span class="eyebrow">Grant Application Deck · July 2026</span>
      <span class="slide-num">01 / 12</span>
    </div>
    <p class="wordmark">KUMPLY<span class="dot">.</span></p>
    <h1>The compliance layer for the Avalanche ecosystem.</h1>
    <p class="lede" style="margin-top: 1.4rem;">
      On-chain KYC, KYB, and KYA attestations that any dApp or sovereign L1 can verify in under a second —
      plus the first Avalanche L1 designed so that every validator must pass business verification (KYB) to join consensus.
    </p>
    <div class="title-badges">
      <span class="badge live">Live on Mainnet C-Chain · Beta</span>
      <span class="badge brand">ACP-99 · ACP-77 · ICM</span>
      <span class="badge warn">Production KYC is the next milestone</span>
    </div>
    <div class="footer-links">
      <a href="https://kumply.xyz">kumply.xyz</a>
      <a href="https://github.com/kumplyprotocol/Kumply">github.com/kumplyprotocol/Kumply</a>
      <a href="https://www.npmjs.com/package/@kumply/sdk">npm: @kumply/sdk</a>
    </div>
  </section>

  <!-- 02 · Problem -->
  <section class="slide">
    <div class="slide-head">
      <span class="eyebrow">Problem</span>
      <span class="slide-num">02 / 12</span>
    </div>
    <h2>Institutions can't answer one question on-chain: who is the counterparty?</h2>
    <p class="lede">
      LatAm banks, funds, and enterprises have publicly stated they want to deploy on-chain products.
      The gating concern they cite is the absence of a <strong>compliant counterparty-resolution layer</strong> —
      a way to know who they're transacting with that a regulator will accept.
    </p>
    <div class="grid cols-3">
      <div class="cell">
        <h3>Off-chain whitelists</h3>
        <p>Break composability. Every integration is a bespoke bilateral agreement.</p>
      </div>
      <div class="cell">
        <h3>Per-dApp KYC</h3>
        <p>Users re-verify for every app. Costs repeat; liquidity fragments.</p>
      </div>
      <div class="cell">
        <h3>Permissioned forks</h3>
        <p>Walled gardens disconnected from public DeFi and its liquidity.</p>
      </div>
    </div>
    <p class="lede" style="margin-top: 1.5rem;">
      And a new class of counterparty is arriving faster than any of these workarounds can handle:
      <strong>autonomous AI agents</strong> transacting with real capital.
    </p>
  </section>

  <!-- 03 · Solution -->
  <section class="slide">
    <div class="slide-head">
      <span class="eyebrow">Solution</span>
      <span class="slide-num">03 / 12</span>
    </div>
    <h2>Verify once. Composable everywhere.</h2>
    <p class="lede">
      A user, business, or AI agent verifies once through KUMPLY. The credential is written to the
      <strong>AttestationStore</strong> contract — no personal data on-chain, just wallet, tier, and expiry.
      From that moment, any contract on Avalanche resolves the counterparty with one free
      <code>verify(address)</code> call.
    </p>
    <div class="table-wrap">
      <table>
        <thead><tr><th>Tier</th><th>Credential</th><th>Who it's for</th></tr></thead>
        <tbody>
          <tr><td>Tier 1–3</td><td>KYC — Basic / Standard / Enhanced</td><td>Individuals, from retail DeFi to regulated products</td></tr>
          <tr><td>Tier 4</td><td>KYB — Business verification</td><td>Companies; required to validate on the KUMPLY L1</td></tr>
          <tr><td>Tier 5</td><td>KYA — Know Your Agent</td><td>Autonomous AI agents operating on-chain capital</td></tr>
        </tbody>
      </table>
    </div>
    <p class="note"><strong>A primitive, not a walled SaaS.</strong> KUMPLY is MIT-licensed contracts plus a TypeScript SDK.
      Any Avalanche dApp or sovereign L1 integrates compliance in a few lines — nobody has to route through our app.</p>
  </section>

  <!-- 04 · Live proof -->
  <section class="slide">
    <div class="slide-head">
      <span class="eyebrow">Working today — every claim clickable</span>
      <span class="slide-num">04 / 12</span>
    </div>
    <h2>Don't trust the deck. Click it.</h2>
    <div class="grid cols-3">
      <div class="cell"><div class="kpi">164</div><div class="kpi-label">automated tests, CI on every push</div></div>
      <div class="cell"><div class="kpi">&lt; 1 s</div><div class="kpi-label">on-chain credential lookup</div></div>
      <div class="cell"><div class="kpi">~3 s</div><div class="kpi-label">KYC approval → credential on-chain</div></div>
    </div>
    <div class="grid cols-2">
      <div class="cell">
        <h3>Contracts verified on both networks</h3>
        <p class="proof"><span class="label">AttestationStore · Mainnet</span>
          <a class="addr" href="https://snowtrace.io/address/0xa116261Ed3a848A9E1cd34923D5A0442D1455F71">0xa116…5F71</a></p>
        <p class="proof"><span class="label">ComplianceGate · Mainnet</span>
          <a class="addr" href="https://snowtrace.io/address/0x01BEEA13A485c7bAD58f926E345325e9e3773bEe">0x01BE…3bEe</a></p>
        <p class="proof"><span class="label">AttestationStore · Fuji</span>
          <a class="addr" href="https://testnet.snowtrace.io/address/0xa3Bc5564A18e107807aF41fF2a5215Db050b22dD">0xa3Bc…22dD</a></p>
        <p class="proof"><span class="label">ComplianceGate · Fuji</span>
          <a class="addr" href="https://testnet.snowtrace.io/address/0xcFDdeA5482baE9A6733B58F6a39FC36BCe6164cF">0xcFDd…64cF</a></p>
        <p class="proof"><span class="label">ValidatorSetManager (Fuji)</span>
          <a class="addr" href="https://testnet.snowtrace.io/address/0x903f6E46f965C9A1127652D761400dBe487F555D">0x903f…555D</a></p>
        <p style="margin-top: 0.6rem; font-size: 0.85em;">Read-path smoke tests run live against both deployments on every release: <strong>8/8 on mainnet, 10/10 on Fuji</strong> (incl. gate rejection/admission paths).</p>
      </div>
      <div class="cell">
        <h3>End-to-end flow, live</h3>
        <p>Connect wallet → Sumsub identity check → webhook issues the attestation on-chain → app shows the credential.
          Full loop runs in about three seconds after approval.</p>
        <p class="proof" style="margin-top: 0.6rem;">
          <a href="https://kumply.xyz/verify">Try it: kumply.xyz/verify</a>
        </p>
        <p class="proof" style="margin-top: 0.4rem;">
          <a href="https://kumply.xyz/dashboard">__TOTAL_ATTESTATIONS__ attestations issued on Fuji — browse them live</a>
        </p>
      </div>
      <div class="cell">
        <h3>Published SDK</h3>
        <p><code>@kumply/sdk</code> v1.x on npm — viem-based client, ABIs, network configs for Fuji, mainnet, and the KUMPLY L1.</p>
      </div>
      <div class="cell">
        <h3>Interactive demo</h3>
        <p>Three scenarios (DeFi pool, RWA transfer, agent marketplace) checking real attestations on the selected network — Mainnet or Fuji — no login, no wallet needed.</p>
        <p class="proof" style="margin-top: 0.6rem;"><a href="https://kumply.xyz/demo">kumply.xyz/demo</a></p>
      </div>
    </div>
    <p class="note"><strong>Honest status:</strong> the non-custodial core (AttestationStore + ComplianceGate) is live and verified on
      <strong>Mainnet C-Chain</strong> as a read-only beta with fees at zero — self-funded, July 2026 — alongside the full suite on Fuji Testnet.
      Identity checks currently run on Sumsub's sandbox tier.
      The KUMPLY L1 is registered on Fuji with validator activation in progress — live status at <a href="https://kumply.xyz/l1">kumply.xyz/l1</a>.
      Production identity checks and mainnet fee activation are exactly what this grant funds — see slide 11.</p>
  </section>

  <!-- 05 · How it works -->
  <section class="slide">
    <div class="slide-head">
      <span class="eyebrow">Architecture</span>
      <span class="slide-num">05 / 12</span>
    </div>
    <h2>One write, unlimited reads.</h2>
    <div class="flow">
      <div class="flow-step">
        <span class="step-label">1 · Verify</span>
        <h3>User connects wallet</h3>
        <p>Picks a tier, completes identity verification (Sumsub WebSDK). KUMPLY never stores personal data.</p>
      </div>
      <div class="flow-step">
        <span class="step-label">2 · Attest</span>
        <h3>Webhook signs the result</h3>
        <p>HMAC-verified webhook issues <code>issueAttestation</code> on-chain: wallet, tier, expiry. Idempotent by design.</p>
      </div>
      <div class="flow-step">
        <span class="step-label">3 · Compose</span>
        <h3>Anyone verifies free</h3>
        <p><code>verify(address)</code> from any contract, the SDK, or cross-L1 via ICM. Sub-second, no API keys.</p>
      </div>
      <div class="flow-step">
        <span class="step-label">4 · Enforce</span>
        <h3>Gates and validators</h3>
        <p><code>ComplianceGate</code> guards dApp actions by minimum tier; the L1's validator manager requires Tier 4 to join consensus.</p>
      </div>
    </div>
    <p class="lede" style="margin-top: 1.5rem;">
      Attestations expire and can be revoked. If a validator's KYB attestation lapses, the ACP-99 contract
      removes it from the set automatically — <strong>anyone can trigger the purge</strong>. Compliance isn't a
      policy document; it's enforced by consensus.
    </p>
  </section>

  <!-- 06 · Avalanche-native -->
  <section class="slide">
    <div class="slide-head">
      <span class="eyebrow">Why Avalanche — and only Avalanche</span>
      <span class="slide-num">06 / 12</span>
    </div>
    <h2>Built with the primitives this ecosystem invented.</h2>
    <div class="grid cols-2">
      <div class="cell">
        <h3>ACP-99 ValidatorSetManager, KYB-gated</h3>
        <p>Our <code>KumplyValidatorSetManager</code> implements the full two-phase validator lifecycle with
        Avalanche-codec Warp payloads — and adds a requirement we have not seen on another L1: validators must hold a live
        Tier-4 attestation. 27 dedicated tests.</p>
      </div>
      <div class="cell">
        <h3>ACP-77 sovereign L1</h3>
        <p>KUMPLY Compliance L1, registered on Fuji with validator activation in progress: Subnet-EVM,
        chainId 43210, 2-second blocks, KMP gas token, deployer allow-list gated by KYB.</p>
      </div>
      <div class="cell">
        <h3>ICM: a network-wide primitive</h3>
        <p>Attestations issued on C-Chain propagate to any Avalanche L1 via Interchain Messaging —
        one verification serves the whole ecosystem, not one chain.</p>
      </div>
      <div class="cell">
        <h3>C-Chain composability</h3>
        <p><code>ComplianceGate</code> drops into any EVM dApp as a 3-line dependency: institutional pools,
        accredited markets, qualified lending — without migrating anything.</p>
      </div>
    </div>
  </section>

  <!-- 07 · KYA -->
  <section class="slide">
    <div class="slide-head">
      <span class="eyebrow">Differentiator</span>
      <span class="slide-num">07 / 12</span>
    </div>
    <h2>KYA — Know Your Agent. First of its kind on Avalanche.</h2>
    <p class="lede">
      Agentic DeFi is arriving: autonomous market makers, AI portfolio managers, on-chain agents holding real budgets.
      Every protocol will need to distinguish a <strong>trusted, bounded agent</strong> from an anonymous script —
      and no compliance rail exists for that today.
    </p>
    <div class="grid cols-3">
      <div class="cell">
        <h3>Tier 5 attestations</h3>
        <p>Agents get on-chain credentials tied to a verified owner (Tier 4 KYB) — accountability chains upward.</p>
      </div>
      <div class="cell">
        <h3>First in the ecosystem</h3>
        <p>To our knowledge, the first Avalanche L1 — and the first EVM compliance layer — purpose-built for agent identity.</p>
      </div>
      <div class="cell">
        <h3>Roadmapped depth</h3>
        <p>AgentRegistry.sol extension: model fingerprint, behavior bounds, liveness — planned for Q3 2026.</p>
      </div>
    </div>
  </section>

  <!-- 08 · Business model -->
  <section class="slide">
    <div class="slide-head">
      <span class="eyebrow">Business model — already in the contracts</span>
      <span class="slide-num">08 / 12</span>
    </div>
    <h2>Two revenue rails, both implemented on-chain.</h2>
    <div class="grid cols-2">
      <div class="cell">
        <h3>Pay-per-check · $0.50</h3>
        <p><code>checkCompliance(address)</code> is a payable read for dApps that want verified counterparties without
        a subscription. The fee logic, treasury accounting, and withdrawal are live in AttestationStore today —
        currently set to zero on both mainnet and testnet.</p>
      </div>
      <div class="cell">
        <h3>SaaS subscription</h3>
        <p><code>setSubscription</code> exempts a partner's ComplianceGate from per-call fees — flat monthly billing
        for high-volume integrators, enforced by the contract, not an invoice.</p>
      </div>
    </div>
    <p class="lede" style="margin-top: 1.5rem;">
      <strong>Software-only by design:</strong> non-custodial, no fiat rails, no tradable token sale.
      KMP is the L1 gas token, not an investment product. This posture keeps KUMPLY outside regulated
      financial classifications — a written Mexican legal opinion is scoped for Q3 2026, before fee activation on mainnet.
    </p>
  </section>

  <!-- 09 · Market -->
  <section class="slide">
    <div class="slide-head">
      <span class="eyebrow">Market</span>
      <span class="slide-num">09 / 12</span>
    </div>
    <h2>The LatAm institutional wedge.</h2>
    <p class="lede">
      Mexico's banking and fintech sector is the largest unaddressed institutional Web3 market in the Americas,
      and Avalanche has made LatAm institutions a strategic priority. KUMPLY is that thesis, built from inside:
      a Mexican team building the compliance rail Mexican institutions ask about first.
    </p>
    <div class="grid cols-3">
      <div class="cell">
        <h3>Beachhead</h3>
        <p>Mexican digital banks and venture funds, reached through the Avalanche LatAm community. No commercial agreements signed to date.</p>
      </div>
      <div class="cell">
        <h3>Expansion</h3>
        <p>Colombia, Brazil, Chile: multi-jurisdiction tier definitions planned for 2027.</p>
      </div>
      <div class="cell">
        <h3>Network effect</h3>
        <p>Each institution that trusts KUMPLY attestations lowers the onboarding cost for the next one.</p>
      </div>
    </div>
  </section>

  <!-- 10 · Team -->
  <section class="slide">
    <div class="slide-head">
      <span class="eyebrow">Team</span>
      <span class="slide-num">10 / 12</span>
    </div>
    <h2>Two builders who ship every week.</h2>
    <div class="grid cols-2">
      <div class="cell founder-cell">
        <img class="avatar" src="/pitch-giovanny.jpg" alt="Giovanny Amador" width="56" height="56" />
        <div class="founder-info">
          <h3>Giovanny Amador — Technical lead</h3>
          <p>Contracts, L1, SDK, infrastructure. Avalanche Team1 Collaborator.
            <a href="https://github.com/Eras256">github.com/Eras256</a> · <a href="https://x.com/vaiossx">@vaiossx</a></p>
        </div>
      </div>
      <div class="cell founder-cell">
        <img class="avatar" src="/pitch-monserrat.jpg" alt="Monserrat Mendoza" width="56" height="56" />
        <div class="founder-info">
          <h3>Monserrat Mendoza — Product &amp; design lead</h3>
          <p>Product, design, content. ETH Uruguay 2025 winner. Avalanche Team1 Collaborator.
            <a href="https://github.com/M0nsxx">github.com/M0nsxx</a> · <a href="https://x.com/smithserrat">@smithserrat</a></p>
        </div>
      </div>
    </div>
    <p class="lede" style="margin-top: 1.5rem;">
      Active in the Team1 LatAm community — introduced KUMPLY at a Team1 weekly call, and shipped two additional
      Avalanche builds in a single weekend (an invisible-blockchain museum ticketing app and an agricultural
      traceability demo), shared with the community. <strong>Building on Avalanche is what we do, grant or no grant.</strong>
    </p>
  </section>

  <!-- 11 · Roadmap & funds -->
  <section class="slide">
    <div class="slide-head">
      <span class="eyebrow">Roadmap &amp; use of funds</span>
      <span class="slide-num">11 / 12</span>
    </div>
    <h2>Every dollar maps to a verifiable milestone.</h2>
    <div class="table-wrap">
      <table>
        <thead><tr><th>Milestone</th><th>Deliverable</th><th>Weeks</th><th>Budget</th></tr></thead>
        <tbody>
          <tr><td>M1</td><td>Security &amp; quality hardening of AttestationStore + ComplianceGate: static analysis (Slither/Aderyn), fuzz + invariant test suite, expanded edge-case coverage, and a published threat-model report — findings fixed, all in-repo</td><td class="num">1–3</td><td class="num">$1,500</td></tr>
          <tr><td>M2</td><td>Sumsub production tier activated (Compliance plan); first real KYC/KYB attestations issued on-chain end-to-end</td><td class="num">2–6</td><td class="num">$3,500</td></tr>
          <tr><td>M3</td><td>On-chain query fee activation on Mainnet C-Chain — the free read layer is already live and verified on mainnet (self-funded, July 2026); this milestone adds a written Mexican fintech legal opinion, migrates admin/treasury to cold-key ops, enables fees post-hardening, and ships the SDK mainnet release on npm</td><td class="num">6–9</td><td class="num">$2,000</td></tr>
          <tr><td>M4</td><td>KUMPLY L1 validator activation on Fuji; ICM integration for cross-L1 attestation reads; 2 pilot integrations generating real mainnet activity</td><td class="num">9–12</td><td class="num">$3,000</td></tr>
        </tbody>
      </table>
    </div>
    <p class="note"><strong>Where the dollars actually go.</strong> Hard costs dominate: M2 is chiefly Sumsub's production
      plan (subscription + per-verification pricing); M3 covers a written Mexican fintech legal opinion and cold-key
      treasury setup before any fee is switched on; M4 covers validator node hosting and pilot integration work.
      M1 is scoped builder time on open-source tooling (Slither, Aderyn, fuzzing) plus a published threat model.</p>
    <p class="note"><strong>Sized for discretion.</strong> Milestones are independently scoped, so the plan degrades gracefully
      if funded below the full ask: <strong>$5,000</strong> delivers M1–M2 (hardened contracts + real production verifications),
      <strong>$7,000</strong> adds mainnet fee activation, and the full <strong>$10,000</strong> completes L1 activation and pilot
      integrations. What this budget deliberately does <strong>not</strong> include: a formal third-party audit of the L1
      validator manager, scoped for Retro9000 / Accelerator funding once mainnet usage proves demand. Nothing this grant
      puts on mainnet custodies user funds. <strong>Already shipped self-funded before this application</strong> — and not
      billed to it: the mainnet C-Chain launch of the non-custodial core (verified on Snowtrace), the 164-test suite with CI,
      the published SDK on npm, and the live dashboard/demo at kumply.xyz.</p>
  </section>

  <!-- 12 · Ask -->
  <section class="slide">
    <div class="slide-head">
      <span class="eyebrow">The ask</span>
      <span class="slide-num">12 / 12</span>
    </div>
    <h2>Fund the bridge from beta to production.</h2>
    <p class="lede">
      KUMPLY is already built, tested, and live on Mainnet C-Chain as a free read-only beta — we shipped
      that ourselves. What stands between this beta and real production verifications are exactly two things
      a bootstrapped two-person team cannot self-fund: <strong>production identity-verification costs</strong>
      and a <strong>disciplined security-hardening pass</strong> before fees go live on the mainnet core.
      That is what this grant buys — everything else, we ship ourselves.
    </p>
    <div class="grid cols-2">
      <div class="cell">
        <h3>Giovanny Amador — Technical lead</h3>
        <p>Discord <code>Vaiosx</code> · Telegram <a href="https://t.me/Vaiosx">@Vaiosx</a> · X <a href="https://x.com/vaiossx">@vaiossx</a></p>
      </div>
      <div class="cell">
        <h3>Monserrat Mendoza — Product &amp; design lead</h3>
        <p>Discord <code>smithserrat</code> · Telegram <a href="https://t.me/M0nsxx">@M0nsxx</a> · X <a href="https://x.com/smithserrat">@smithserrat</a></p>
      </div>
    </div>
    <div class="footer-links">
      <a href="https://kumply.xyz">kumply.xyz</a>
      <a href="https://kumply.xyz/demo">Live demo</a>
      <a href="https://kumply.xyz/verify">Verification flow</a>
      <a href="https://github.com/kumplyprotocol/Kumply">GitHub</a>
      <a href="https://www.npmjs.com/package/@kumply/sdk">@kumply/sdk</a>
      <a href="https://snowtrace.io/address/0xa116261Ed3a848A9E1cd34923D5A0442D1455F71">Snowtrace</a>
    </div>
    <p class="legal">
      The AVALANCHE® and AVAX® trademarks are owned by Ava Labs, Inc. KUMPLY is an independent project —
      not endorsed by, sponsored by, or affiliated with Ava Labs, Inc. or the Avalanche Foundation.
      Core contracts live on Avalanche Mainnet C-Chain (read-only beta, fees at zero) and Fuji Testnet.
      Automated identity checks remain on Sumsub's sandbox tier; not for production verifications yet.
    </p>
  </section>

</div>
`;
