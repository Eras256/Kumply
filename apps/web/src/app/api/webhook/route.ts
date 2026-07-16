import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createWalletClient, createPublicClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { avalancheFuji } from 'viem/chains';
import { KumplyClient, ATTESTATION_STORE_ABI } from '@kumply/sdk';

// Vercel: allow up to 60s for blockchain tx confirmation (Fuji ~2s blocks, but may queue)
export const maxDuration = 60;

const LEVEL_TO_TIER: Record<string, number> = {
  'basic-kyc': 1,
  'standard-kyc': 2,
  'enhanced-kyc': 3,
  'business-kyb': 4,
  'agent-kya': 5,
};

// NOTE: No in-memory idempotency Set here — Vercel serverless functions are
// stateless (module-level state is lost between cold starts). The on-chain
// kumplyClient.isVerified() check below provides persistent idempotency.
// For the Express standalone API (apps/api), the in-memory Map is kept as
// a secondary guard since it runs as a long-lived process.

function log(level: string, event: string, data?: Record<string, unknown>) {
  console.log(JSON.stringify({ ts: new Date().toISOString(), level, event, ...data }));
}

export async function POST(request: Request) {
  try {
    const bodyText = await request.text();
    const signature = request.headers.get('x-payload-digest');

    // Use SUMSUB_WEBHOOK_SECRET first, fall back to SUMSUB_SECRET_KEY
    const secret = process.env.SUMSUB_WEBHOOK_SECRET || process.env.SUMSUB_SECRET_KEY || '';

    if (!secret) {
      log('ERROR', 'webhook_no_secret');
      return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
    }

    // Always verify HMAC — no environment bypass
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(bodyText);
    const calculated = hmac.digest('hex');

    if (!signature || signature !== calculated) {
      log('WARN', 'webhook_invalid_signature', { provided: signature?.slice(0, 10) });
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const payload = JSON.parse(bodyText);
    const { reviewResult, applicantId, externalUserId, levelName } = payload;

    log('INFO', 'webhook_received', {
      applicantId,
      reviewAnswer: reviewResult?.reviewAnswer,
      levelName,
    });

    if (reviewResult?.reviewAnswer !== 'GREEN') {
      return new NextResponse('OK', { status: 200 });
    }

    // Prefer non-public env vars for server-side use; fall back to NEXT_PUBLIC_ if needed
    const privateKey = (process.env.DEPLOYER_PRIVATE_KEY) as `0x${string}` | undefined;
    const contractAddress = (
      process.env.CONTRACT_ATTESTATION_STORE ||
      process.env.NEXT_PUBLIC_CONTRACT_ATTESTATION_STORE ||
      '0x9Bbb0797EA92277c268fe7E45BdB16b70E787d76'
    ) as `0x${string}`;
    const rpcUrl =
      process.env.FUJI_RPC_URL ||
      process.env.NEXT_PUBLIC_FUJI_RPC_URL ||
      'https://api.avax-test.network/ext/bc/C/rpc';

    if (!privateKey || !contractAddress) {
      log('ERROR', 'webhook_no_signer', { applicantId, hasKey: !!privateKey, hasContract: !!contractAddress });
      return NextResponse.json({ error: 'Attestation issuance not configured' }, { status: 503 });
    }


    // On-chain idempotency — persistent across serverless cold starts
    const kumplyClient = new KumplyClient({
      network: 'fuji',
      contractAddress,
      rpcUrl,
    });

    const alreadyVerified = await kumplyClient.isVerified(externalUserId);
    if (alreadyVerified) {
      log('INFO', 'webhook_already_attested', { address: externalUserId });
      return new NextResponse('OK', { status: 200 });
    }

    const account = privateKeyToAccount(privateKey);
    const walletClient = createWalletClient({
      account,
      chain: avalancheFuji,
      transport: http(rpcUrl),
    });
    const publicClient = createPublicClient({
      chain: avalancheFuji,
      transport: http(rpcUrl),
    });

    const tier = LEVEL_TO_TIER[levelName] ?? 1;
    const expiry = BigInt(Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60);

    log('AUDIT', 'attestation_issuing', {
      address: externalUserId,
      tier,
      levelName,
      applicantId,
    });

    const txHash = await walletClient.writeContract({
      address: contractAddress,
      abi: ATTESTATION_STORE_ABI,
      functionName: 'issueAttestation',
      args: [externalUserId as `0x${string}`, tier, expiry],
    });

    const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });

    log('AUDIT', 'attestation_confirmed', {
      address: externalUserId,
      tier,
      applicantId,
      txHash,
      blockNumber: receipt.blockNumber.toString(),
    });

    return new NextResponse('OK', { status: 200 });
  } catch (error) {
    log('ERROR', 'webhook_exception', { message: String(error) });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
