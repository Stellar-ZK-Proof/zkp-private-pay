# ZKP Private Pay

> Zero-knowledge proof private institutional payments on Stellar (Soroban)

ZKP Private Pay lets institutions settle cross-border payments where **amount and recipient stay hidden on-chain** via Groth16 ZK proofs, while preserving full audit-compliance. Only the commitment hash and the sender are public. Auditors reveal private data on demand using the preimage.

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│  Frontend  (Next.js 14 · Tailwind · TypeScript)         │
│  • Payment form  • Proof viewer  • Freighter wallet     │
└───────────────────────┬─────────────────────────────────┘
                        │ REST
┌───────────────────────▼─────────────────────────────────┐
│  Backend   (Node.js · Express · TypeScript)              │
│  • /api/payments/submit   — generate proof + settle      │
│  • /api/proofs/generate   — proof only (preview)         │
│  • /api/proofs/verify     — off-chain verification       │
│  • /api/institutions      — whitelist management         │
└───────────────────────┬─────────────────────────────────┘
                        │ Soroban RPC
┌───────────────────────▼─────────────────────────────────┐
│  Contract  (Rust · Soroban SDK · Stellar Testnet)        │
│  • submit_payment   — store commitment + nullifier       │
│  • settle_payment   — verify proof public inputs         │
│  • reject_payment   — compliance override (admin)        │
│  • whitelist_institution / delist_institution            │
└─────────────────────────────────────────────────────────┘
```

## ZK Flow

1. **Commit** — Backend derives `commitment = SHA256(amount ∥ recipient ∥ salt)` and `nullifier = SHA256("nullifier" ∥ salt ∥ recipient)`
2. **Prove** — snarkjs generates a Groth16 proof over the circuit (payment_commitment.circom) with private inputs `{amount, recipient, salt}`
3. **Submit** — Soroban contract stores commitment + nullifier (prevents replay)
4. **Settle** — Contract checks proof public inputs match stored commitment; marks TX settled
5. **Audit** — Sender reveals `{amount, recipient, salt}` to auditor; they verify against commitment

## Repo structure

```
zkp-private-pay/
├── contract/          # Rust · Soroban smart contract
│   ├── Cargo.toml
│   └── src/lib.rs
├── backend/           # Node.js · Express API
│   ├── src/
│   │   ├── index.ts
│   │   ├── lib/{stellar,zkp,logger}.ts
│   │   └── routes/{payments,proofs,institutions,health}.ts
│   ├── .env.example
│   └── package.json
├── frontend/          # Next.js 14 app
│   ├── src/
│   │   ├── app/{layout,page}.tsx
│   │   ├── components/
│   │   └── styles/globals.css
│   ├── .env.example
│   └── package.json
└── README.md
```

## Quickstart

### Prerequisites
- Node.js 20+
- Rust + `cargo`
- Stellar CLI: `cargo install --locked stellar-cli`

### 1. Smart contract

```bash
cd contract
stellar contract build
stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/zkp_private_pay.wasm \
  --network testnet \
  --source <YOUR_SECRET_KEY>
```

### 2. Backend

```bash
cd backend
cp .env.example .env        # fill in CONTRACT_ID + STELLAR_SECRET_KEY
npm install
npm run dev
```

### 3. Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
# → http://localhost:3000
```

## ZK Circuit (production)

Place compiled circuit files in `backend/circuits/`:
- `payment_commitment.wasm`
- `payment_commitment_final.zkey`
- `verification_key.json`

Generate them from `circuits/payment_commitment.circom` using:
```bash
circom payment_commitment.circom --r1cs --wasm --sym
snarkjs groth16 setup payment_commitment.r1cs pot14_final.ptau payment_commitment_0000.zkey
snarkjs zkey contribute payment_commitment_0000.zkey payment_commitment_final.zkey
snarkjs zkey export verificationkey payment_commitment_final.zkey verification_key.json
```

Without circuit files the backend runs in **dev mode** (mock proofs) — suitable for UI development.

## Funding

This project is eligible for [Stellar Community Fund](https://stellar.org/grants-and-funding) Build Awards (up to $150k XLM).

## License

MIT
