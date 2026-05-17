# KUMPLY — Contexto del Proyecto para Claude

## Qué es KUMPLY

Infraestructura de compliance institucional sobre Avalanche. Proporciona attestaciones KYC/KYB/KYA (Know Your Agent) on-chain con 5 tiers, integración con Sumsub, y diseño para cross-L1 via ICM. Implementa un modelo de negocio "Software-Only" (no custodial, sin clasificaciones Fintech/AML).

**Estado actual (Mayo 2026):** Contratos desplegados y verificados en Fuji. Tests: 40 contratos + 30 SDK + 15 API = **85 tests**. Frontend con 10 páginas (Home, Verify, Demo, Dashboard, Network, Tiers, Developers, Solutions, Legal, Docs). AttestationStore soporta `setEercToken()` admin-only para Phase 2 (eERC encrypted proofs). **Pendiente:** configurar API keys de Sumsub para activar el flujo KYC real.

**Stack:** Solidity 0.8.28 + Hardhat · Express + TypeScript · Next.js 16 + React 19 (con `next-intl` para i18n) · Wagmi · pnpm workspaces

**Red activa:** Avalanche Fuji Testnet (chainId 43113)

**Contexto:** Participando en el Hackathon LatAm Institucional de Avalanche (15–17 Mayo 2026, online). También candidatos a Retro9000 (C-Chain Round 3, cierra **18 Mayo 2026 a las 6PM UTC** — fecha confirmada en retro9000.avax.network) y Avalanche L1s & Infrastructure Tooling (round continuo). Candidatos potenciales para Team1 mini-grants y Blizzard Fund.

---

## 🌎 Hackathon: LatAm Institucional (15-17 Mayo 2026)

**Objetivo:** Resolver retos institucionales reales de las principales empresas financieras de América Latina. Sin casos de uso hipotéticos.

### Instituciones & Partners
- **Arkangeles** y **Bankaool** (Retos principales)
- **Oracle:** (Mentoría + $500 USD créditos)
- **Wavy Node:** (Infraestructura de trazabilidad y risk score + $200 USD créditos)
- **Ledger Leaders Week:** (Mentoría en Legal & Compliance)

### Criterios de Evaluación
1. **Viabilidad de negocio:** ¿Existe un mercado real? ¿Puede sostenerse y escalar?
2. **Viabilidad técnica:** Arquitectura sólida, segura y casi lista para producción.
3. **Avance del MVP:** ¿Qué tan desarrollada y funcional está la solución al momento de la entrega?
4. **Uso de tecnología Avalanche y partners:** Uso inteligente de infraestructura (L1s, ICM, C-Chain) y partners.
5. **Modelo de negocio:** Generación de valor y monetización.

### Tracks de Interés para Kumply
- Identidad Digital y KYC On-Chain *(Foco Principal)*
- Pagos Institucionales y Tokenización de Activos
- Automatización de Procesos Corporativos

---

## Reglas del Ecosistema Avalanche (SIEMPRE respetar)

- El trademark **AVALANCHE®** es de Ava Labs, Inc. KUMPLY es una submission independiente, no endorsada por Ava Labs.
- No usar el nombre/logo de Avalanche de forma que implique asociación oficial.
- Cumplir las [Avalanche Foundation Guidelines](https://www.avax.network/legal).
- Para grants/retro: las submissions deben ser públicas por defecto en Retro9000.
- Cualquier investigación financiada por la Foundation tiene 6 meses de exclusividad antes de publicación.

---

## Documentación Avalanche — Links de Referencia

A continuación se presentan todos los enlaces de referencia ordenados alfabéticamente para facilitar su consulta:

- https://areta.market/avalanche
- https://avalabs.org/whitepapers
- https://build.avax.network/
- https://build.avax.network/academy
- https://build.avax.network/blog
- https://build.avax.network/chat
- https://build.avax.network/console
- https://build.avax.network/docs/acps/108-evm-event-importing
- https://build.avax.network/docs/acps/118-warp-signature-request
- https://build.avax.network/docs/acps/13-subnet-only-validators
- https://build.avax.network/docs/acps/20-ed25519-p2p
- https://build.avax.network/docs/acps/23-p-chain-native-transfers
- https://build.avax.network/docs/acps/24-shanghai-eips
- https://build.avax.network/docs/acps/25-vm-application-errors
- https://build.avax.network/docs/acps/256-hardware-recommendations
- https://build.avax.network/docs/acps/267-uptime-requirement-increase
- https://build.avax.network/docs/acps/30-avalanche-warp-x-evm
- https://build.avax.network/docs/acps/31-enable-subnet-ownership-transfer
- https://build.avax.network/docs/acps/41-remove-pending-stakers
- https://build.avax.network/docs/acps/62-disable-addvalidatortx-and-adddelegatortx
- https://build.avax.network/docs/acps/75-acceptance-proofs
- https://build.avax.network/docs/acps/77-reinventing-subnets
- https://build.avax.network/docs/acps/83-dynamic-multidimensional-fees
- https://build.avax.network/docs/acps/84-table-preamble
- https://build.avax.network/docs/acps/99-validatorsetmanager-contract
- https://build.avax.network/docs/api-reference/data-api
- https://build.avax.network/docs/api-reference/data-api/avax-supply/getAvaxSupply
- https://build.avax.network/docs/api-reference/data-api/data-api-usage-metrics/getApiLogs
- https://build.avax.network/docs/api-reference/data-api/data-api-usage-metrics/getApiUsageMetrics
- https://build.avax.network/docs/api-reference/data-api/data-api-usage-metrics/getPrimaryNetworkRpcUsageMetrics
- https://build.avax.network/docs/api-reference/data-api/data-api-usage-metrics/getSubnetRpcUsageMetrics
- https://build.avax.network/docs/api-reference/data-api/data-vs-rpc
- https://build.avax.network/docs/api-reference/data-api/evm-balances/getNativeBalance
- https://build.avax.network/docs/api-reference/data-api/evm-balances/listCollectibleBalances
- https://build.avax.network/docs/api-reference/data-api/evm-balances/listErc1155Balances
- https://build.avax.network/docs/api-reference/data-api/evm-balances/listErc20Balances
- https://build.avax.network/docs/api-reference/data-api/evm-balances/listErc721Balances
- https://build.avax.network/docs/api-reference/data-api/evm-blocks/getBlock
- https://build.avax.network/docs/api-reference/data-api/evm-blocks/getLatestBlocks
- https://build.avax.network/docs/api-reference/data-api/evm-blocks/listLatestBlocksAllChains
- https://build.avax.network/docs/api-reference/data-api/evm-chains/getChainInfo
- https://build.avax.network/docs/api-reference/data-api/evm-chains/listAddressChains
- https://build.avax.network/docs/api-reference/data-api/evm-chains/supportedChains
- https://build.avax.network/docs/api-reference/data-api/evm-contracts/getContractMetadata
- https://build.avax.network/docs/api-reference/data-api/evm-transactions/getDeploymentTransaction
- https://build.avax.network/docs/api-reference/data-api/evm-transactions/getTransaction
- https://build.avax.network/docs/api-reference/data-api/evm-transactions/getTransactionsForBlock
- https://build.avax.network/docs/api-reference/data-api/evm-transactions/listContractDeployments
- https://build.avax.network/docs/api-reference/data-api/evm-transactions/listErc1155Transactions
- https://build.avax.network/docs/api-reference/data-api/evm-transactions/listErc20Transactions
- https://build.avax.network/docs/api-reference/data-api/evm-transactions/listErc721Transactions
- https://build.avax.network/docs/api-reference/data-api/evm-transactions/listInternalTransactions
- https://build.avax.network/docs/api-reference/data-api/evm-transactions/listLatestTransactions
- https://build.avax.network/docs/api-reference/data-api/evm-transactions/listLatestTransactionsAllChains
- https://build.avax.network/docs/api-reference/data-api/evm-transactions/listNativeTransactions
- https://build.avax.network/docs/api-reference/data-api/evm-transactions/listTransactions
- https://build.avax.network/docs/api-reference/data-api/evm-transactions/listTransactionsV2
- https://build.avax.network/docs/api-reference/data-api/evm-transactions/listTransfers
- https://build.avax.network/docs/api-reference/data-api/getting-started
- https://build.avax.network/docs/api-reference/data-api/health-check/data-health-check
- https://build.avax.network/docs/api-reference/data-api/health-check/live-check
- https://build.avax.network/docs/api-reference/data-api/interchain-messaging/getIcmMessage
- https://build.avax.network/docs/api-reference/data-api/interchain-messaging/listIcmMessages
- https://build.avax.network/docs/api-reference/data-api/interchain-messaging/listIcmMessagesByAddress
- https://build.avax.network/docs/api-reference/data-api/nfts/getTokenDetails
- https://build.avax.network/docs/api-reference/data-api/nfts/listTokens
- https://build.avax.network/docs/api-reference/data-api/nfts/reindexNft
- https://build.avax.network/docs/api-reference/data-api/operations/getOperationResult
- https://build.avax.network/docs/api-reference/data-api/operations/postTransactionExportJob
- https://build.avax.network/docs/api-reference/data-api/primary-network-balances/getBalancesByAddresses
- https://build.avax.network/docs/api-reference/data-api/primary-network-blocks/getBlockById
- https://build.avax.network/docs/api-reference/data-api/primary-network-blocks/listLatestPrimaryNetworkBlocks
- https://build.avax.network/docs/api-reference/data-api/primary-network-blocks/listPrimaryNetworkBlocksByNodeId
- https://build.avax.network/docs/api-reference/data-api/primary-network-rewards/listHistoricalPrimaryNetworkRewards
- https://build.avax.network/docs/api-reference/data-api/primary-network-rewards/listPendingPrimaryNetworkRewards
- https://build.avax.network/docs/api-reference/data-api/primary-network-transactions/getTxByHash
- https://build.avax.network/docs/api-reference/data-api/primary-network-transactions/listActivePrimaryNetworkStakingTransactions
- https://build.avax.network/docs/api-reference/data-api/primary-network-transactions/listAssetTransactions
- https://build.avax.network/docs/api-reference/data-api/primary-network-transactions/listLatestPrimaryNetworkTransactions
- https://build.avax.network/docs/api-reference/data-api/primary-network-utxos/getLastActivityTimestampByAddresses
- https://build.avax.network/docs/api-reference/data-api/primary-network-utxos/getLastActivityTimestampByAddressesV2
- https://build.avax.network/docs/api-reference/data-api/primary-network-utxos/getUtxosByAddresses
- https://build.avax.network/docs/api-reference/data-api/primary-network-utxos/getUtxosByAddressesV2
- https://build.avax.network/docs/api-reference/data-api/primary-network-vertices/getVertexByHash
- https://build.avax.network/docs/api-reference/data-api/primary-network-vertices/getVertexByHeight
- https://build.avax.network/docs/api-reference/data-api/primary-network-vertices/listLatestXChainVertices
- https://build.avax.network/docs/api-reference/data-api/primary-network/getAssetDetails
- https://build.avax.network/docs/api-reference/data-api/primary-network/getBlockchainById
- https://build.avax.network/docs/api-reference/data-api/primary-network/getChainIdsForAddresses
- https://build.avax.network/docs/api-reference/data-api/primary-network/getNetworkDetails
- https://build.avax.network/docs/api-reference/data-api/primary-network/getSubnetById
- https://build.avax.network/docs/api-reference/data-api/primary-network/listBlockchains
- https://build.avax.network/docs/api-reference/data-api/primary-network/listDelegators
- https://build.avax.network/docs/api-reference/data-api/primary-network/listL1Validators
- https://build.avax.network/docs/api-reference/data-api/primary-network/listSubnets
- https://build.avax.network/docs/api-reference/data-api/primary-network/listValidators
- https://build.avax.network/docs/api-reference/data-api/rate-limits
- https://build.avax.network/docs/api-reference/data-api/signature-aggregator/aggregateSignatures
- https://build.avax.network/docs/api-reference/data-api/signature-aggregator/getAggregatedSignatures
- https://build.avax.network/docs/api-reference/data-api/snowflake
- https://build.avax.network/docs/api-reference/data-api/usage
- https://build.avax.network/docs/nodes
- https://build.avax.network/docs/nodes/architecture
- https://build.avax.network/docs/nodes/architecture/consensus
- https://build.avax.network/docs/nodes/architecture/core-components
- https://build.avax.network/docs/nodes/architecture/execution
- https://build.avax.network/docs/nodes/architecture/execution/firewood
- https://build.avax.network/docs/nodes/architecture/execution/streaming-async-execution
- https://build.avax.network/docs/nodes/architecture/networking
- https://build.avax.network/docs/nodes/architecture/virtual-machines
- https://build.avax.network/docs/nodes/chain-configs/avalanche-l1s/avalanche-l1-configs
- https://build.avax.network/docs/nodes/chain-configs/avalanche-l1s/subnet-evm
- https://build.avax.network/docs/nodes/chain-configs/primary-network/c-chain
- https://build.avax.network/docs/nodes/chain-configs/primary-network/p-chain
- https://build.avax.network/docs/nodes/chain-configs/primary-network/x-chain
- https://build.avax.network/docs/nodes/maintain/backup-restore
- https://build.avax.network/docs/nodes/maintain/cube-signer-sidecar
- https://build.avax.network/docs/nodes/maintain/enroll-in-avalanche-notify
- https://build.avax.network/docs/nodes/maintain/monitoring
- https://build.avax.network/docs/nodes/maintain/run-as-background-service
- https://build.avax.network/docs/nodes/maintain/upgrade
- https://build.avax.network/docs/nodes/releases
- https://build.avax.network/docs/nodes/run-a-node
- https://build.avax.network/docs/nodes/run-a-node/avalanche-l1-nodes
- https://build.avax.network/docs/nodes/run-a-node/common-errors
- https://build.avax.network/docs/nodes/run-a-node/from-source
- https://build.avax.network/docs/nodes/run-a-node/on-third-party-services/amazon-web-services
- https://build.avax.network/docs/nodes/run-a-node/on-third-party-services/aws-marketplace
- https://build.avax.network/docs/nodes/run-a-node/on-third-party-services/google-cloud
- https://build.avax.network/docs/nodes/run-a-node/on-third-party-services/microsoft-azure
- https://build.avax.network/docs/nodes/run-a-node/using-docker
- https://build.avax.network/docs/nodes/run-a-node/using-install-script/managing-avalanche-go
- https://build.avax.network/docs/nodes/run-a-node/using-install-script/node-config-maintenance
- https://build.avax.network/docs/nodes/run-a-node/using-install-script/preparing-environment
- https://build.avax.network/docs/nodes/system-requirements
- https://build.avax.network/docs/primary-network
- https://build.avax.network/docs/primary-network/avalanche-consensus
- https://build.avax.network/docs/primary-network/avax-token
- https://build.avax.network/docs/primary-network/coreth-architecture
- https://build.avax.network/docs/primary-network/exchange-integration
- https://build.avax.network/docs/primary-network/firewoodv
- https://build.avax.network/docs/primary-network/platformvm-architecture
- https://build.avax.network/docs/primary-network/streaming-async-execution
- https://build.avax.network/docs/primary-network/validate/how-to-stake
- https://build.avax.network/docs/primary-network/validate/node-validator
- https://build.avax.network/docs/primary-network/validate/rewards-formula
- https://build.avax.network/docs/primary-network/validate/staking-for-finance-professionals
- https://build.avax.network/docs/primary-network/validate/validate-vs-delegate
- https://build.avax.network/docs/primary-network/verify-contract/explorer
- https://build.avax.network/docs/primary-network/verify-contract/hardhat
- https://build.avax.network/docs/primary-network/verify-contract/snowtrace
- https://build.avax.network/docs/primary-network/virtual-machines
- https://build.avax.network/docs/tooling/avalanche-sdk/client/utils
- https://build.avax.network/docs/tooling/avalanche-sdk/interchain
- https://build.avax.network/docs/tooling/avalanche-sdk/interchain/chains
- https://build.avax.network/docs/tooling/avalanche-sdk/interchain/getting-started
- https://build.avax.network/docs/tooling/avalanche-sdk/interchain/icm
- https://build.avax.network/docs/tooling/avalanche-sdk/interchain/icm/methods
- https://build.avax.network/docs/tooling/avalanche-sdk/interchain/ictt
- https://build.avax.network/docs/tooling/avalanche-sdk/interchain/ictt/deployment
- https://build.avax.network/docs/tooling/avalanche-sdk/interchain/ictt/transfers
- https://build.avax.network/docs/tooling/avalanche-sdk/interchain/warp
- https://build.avax.network/docs/tooling/avalanche-sdk/interchain/warp/building
- https://build.avax.network/docs/tooling/avalanche-sdk/interchain/warp/parsing
- https://build.avax.network/events
- https://build.avax.network/explorer
- https://build.avax.network/grants
- https://build.avax.network/grants/avalanche-research-proposals
- https://build.avax.network/hackathons
- https://build.avax.network/integrations
- https://build.avax.network/llms-full.txt
- https://build.avax.network/stats/overview
- https://core.app/discover?__hstc=235724126.55958365b7734cc50a968b0f4910ba44.1778691720989.1778691720989.1778691720989.1&__hssc=235724126.2.1778691720989&__hsfp=52a5abc339a67a5194374d07920f2103
- https://evergreen.avax.network/
- https://forum.avax.network/
- https://github.com/ava-labs
- https://github.com/ava-labs/audits
- https://grants.team1.network/
- https://job-boards.greenhouse.io/avalanchefoundation
- https://medium.com/@avaxdevelopers
- https://retro9000.avax.network/
- https://shop.avax.network/
- https://spaceandtimedb.notion.site/Space-and-Time-x-Avalanche-Builder-Credit-Grant-Program-239af37755f580b4929ff9328584f347?pvs=74
- https://status.avax.network/
- https://subnets.avax.network/
- https://support.avax.network/en/
- https://t.me/+KDajA4iToKY2ZjBk
- https://www.alibabacloud.com/blog/avax-naas-node-as-a-service-on-alibaba-cloud_599481
- https://www.avax.network
- https://www.avax.network/
- https://www.avax.network/about/foundation
- https://www.avax.network/blog
- https://www.avax.network/build/developer-hub
- https://www.avax.network/community-hub
- https://www.avax.network/community-hub/newsletter
- https://www.avax.network/defi
- https://www.avax.network/enterprise
- https://www.avax.network/gaming
- https://www.avax.network/infrastructure
- https://www.avax.network/institutions
- https://www.avax.network/legal
- https://www.avax.network/nft
- https://www.blizzard.fund/
- https://www.facebook.com/avalancheavax
- https://www.helika.io/helika-avalanche-accelerator/
- https://www.linkedin.com/company/avalancheavax
- https://www.team1.network/
- https://www.tencentcloud.com/dynamic/insights/sample-article/100424
- https://www.youtube.com/@Avalancheavax
- https://x.com/AvaxDevelopers

---

