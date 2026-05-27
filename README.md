# MyTodoList

Task kanban on-chain — todos disimpan di smart contract, bukan database.

Built with: Next.js 16, Bun, Tailwind v4, Hardhat v3, Solidity 0.8.28, wagmi v3.

---

## Prerequisites

- [Bun](https://bun.sh) v1.3.2
- [MetaMask](https://metamask.io) atau wallet Web3 lain (Rabby, dll)

## Setup

```bash
bun install
```

## Jalanin (3 terminal)

### Terminal 1 — Local blockchain

```bash
bunx hardhat node
```

Ini jalanin Hardhat network di `http://127.0.0.1:8545`. Biarin aja jalan.

### Terminal 2 — Deploy contracts

```bash
bunx hardhat run scripts/deploy.ts --network localhost
```

Nge-deploy `TodoList.sol` dan `TodoNFT.sol`, trus nulis address-nya ke `.env.local`.

### Terminal 3 — Web app

```bash
bun run dev
```

Buka `http://localhost:3000`.

## MetaMask setup

1. Buka MetaMask → Settings → Networks → Add Network Manual
2. **Network Name:** `Hardhat Local`
3. **RPC URL:** `http://127.0.0.1:8545`
4. **Chain ID:** `31337`
5. **Currency Symbol:** `ETH`

Import salah satu account Hardhat (saldo 10.000 ETH):

```
0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

## Cara pake

1. Buka `http://localhost:3000`
2. Klik **Connect Wallet** — pake MetaMask
3. Setelah connect, klik **New Task** buat bikin todo
4. Drag card ke kolom lain buat mindahin status
5. Semua perubahan tersimpan di smart contract

## Scripts

| Command | Description |
|---------|-------------|
| `bun run dev` | Next.js dev server (Turbopack) |
| `bun run build` | Build production |
| `bun run lint` | ESLint check |
| `bunx hardhat node` | Local blockchain |
| `bunx hardhat run scripts/deploy.ts --network localhost` | Deploy contracts |
| `bunx hardhat run scripts/deploy.ts --network sepolia` | Deploy ke Sepolia testnet |

## Struktur

```
src/
  app/              Routes (landing, board)
  components/       UI komponen
  hooks/            useChain, useBadges
  lib/              Types, store, wagmi config, ABI, badges
contracts/          Smart contracts (TodoList.sol, TodoNFT.sol)
scripts/            Hardhat deploy script
```

## Smart contracts

- **TodoList.sol** — CRUD todos, subtasks, column moves, user stats
- **TodoNFT.sol** — ERC-1155 achievement badges (8 jenis, claimable on-chain)
