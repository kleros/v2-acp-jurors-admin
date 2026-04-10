# Juror Certification Admin

**Admin dashboard for minting and revoking Kleros Argentina Consumer Protection Soulbound Tokens on Arbitrum One.**

Built for the [Kleros v2 Argentina Consumer Protection](https://v2.kleros.builders/#/courts/32/purpose) juror certification programme, this app lets contract owners issue non-transferable SBT credentials (Experience and Lawyer) to certified jurors and revoke them when needed.

---

## How It Works

1. **Connect** your wallet (the SBT contract owner).
2. **Mint** -- select a token type (ACP Lawyer or ACP Experience), enter the juror's address, and issue a Soulbound Token in a single transaction.
3. **Burn** -- select a token type, enter the holder's address. The app automatically looks up the on-chain token ID via Transfer event indexing and burns it.

The tokens are non-transferable ERC-721s deployed on Arbitrum One. Only one token of each type can exist per address.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript, React 18 |
| Web3 | Wagmi v2 + viem + ConnectKit |
| Styling | Tailwind CSS v3, "Neon Noir" dark theme |
| Lint / Format | Biome |
| Testing | Vitest + React Testing Library |
| Package Manager | Yarn Berry |

---

## Getting Started

### Prerequisites

- Node.js >= 18
- Yarn (`corepack enable`)

### Install

```bash
git clone https://github.com/kleros/v2-acp-jurors-admin.git
cd v2-acp-jurors-admin
yarn install
```

### Environment

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
```

> WalletConnect is optional -- injected wallets (MetaMask, Rabby, etc.) work without it.

### Run

```bash
yarn dev       # development server at http://localhost:3000
yarn build     # production build
yarn start     # serve production build
```

---

## Project Structure

```
src/
  app/
    layout.tsx          # Root layout, metadata, providers
    page.tsx            # Main page -- wallet connect, mint & burn forms
    globals.css         # Neon Noir base styles, noise texture, radial glow
  components/
    MintForm.tsx        # Select token type + recipient address -> safeMint()
    BurnForm.tsx        # Select token type + holder address -> auto-lookup tokenId -> burn()
    NetworkGuard.tsx    # Auto-switches to Arbitrum, blocks UI on wrong chain
    Providers.tsx       # Wagmi / QueryClient / ConnectKit provider tree
  config/
    contracts.ts        # ABI + deployed addresses for both SBT contracts
    wagmi.ts            # Arbitrum chain config, ConnectKit defaults
  hooks/
    useTokenLookup.ts   # Finds tokenId by scanning Transfer events (no enumerable extension)
  test/
    mocks.tsx           # Wagmi + ConnectKit mock setup for component tests
    setup.ts            # Vitest global setup
```

---

## SBT Contracts

Deployed on **Arbitrum One**:

| Token | Address |
|---|---|
| ACP Experience | [`0xbCF80cb53f173Ff8be96813a40be20eFAb2B59ed`](https://arbiscan.io/address/0xbCF80cb53f173Ff8be96813a40be20eFAb2B59ed) |
| ACP Lawyer | [`0x0d41Cb0c9Da123a7554C5eee87aD289874e85E48`](https://arbiscan.io/address/0x0d41Cb0c9Da123a7554C5eee87aD289874e85E48) |

Key properties:

- **`safeMint(address)`** -- owner-only, one token per address
- **`burn(uint256)`** -- callable by the token holder or the contract owner
- **Transfers blocked** -- these are Soulbound Tokens (`TransfersNotPermitted`)

---

## Scripts

| Command | Description |
|---|---|
| `yarn dev` | Start the Next.js dev server |
| `yarn build` | Production build |
| `yarn test` | Run tests with Vitest |
| `yarn lint` | Lint with Biome |
| `yarn format` | Auto-format with Biome |

