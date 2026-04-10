# Juror Certification Frontend

Work style: telegraph; noun-phrases ok; drop filler/grammar; min tokens

## Git

Commits require GPG passphrase (interactive — will hang). Always use `-c commit.gpgsign=false` and append `Co-Authored-By: Claude <noreply@anthropic.com>` to commit messages.

## Project

Standalone Next.js app for minting/burning Kleros Argentina Consumer Protection SBT tokens on Arbitrum.

## Stack

- Next.js 15 (App Router), React 18, TypeScript
- Wagmi v2 + viem + ConnectKit (dark mode)
- Tailwind v3 (v4 untested — may work, worth revisiting)
- Pinned to Next.js 15 + React 18 + Wagmi 2 because ConnectKit 1.9.2 doesn't support React 19 / Wagmi 3
- Biome (lint/format), Vitest + React Testing Library
- Yarn Berry (nodeLinker: node-modules)

## Commands

- `yarn dev` — dev server
- `yarn build` — production build
- `yarn test` — vitest
- `yarn lint` — biome check
- `yarn format` — biome format --write

## Architecture

- `src/config/contracts.ts` — ABI + addresses for 2 SBTs (Experience + Lawyer)
- `src/config/wagmi.ts` — Arbitrum chain, ConnectKit config
- `src/hooks/useTokenLookup.ts` — finds tokenId by indexing Transfer events (no ERC721Enumerable)
- `src/components/MintForm.tsx` — select token + recipient → safeMint()
- `src/components/BurnForm.tsx` — select token + address → auto-lookup tokenId → burn()
- `src/components/NetworkGuard.tsx` — auto-switch to Arbitrum, blocks UI if wrong chain
- `src/components/Providers.tsx` — Wagmi/QueryClient/ConnectKit providers
- Default selected token: **Lawyer** (not Experience)

## Testing

- wagmi and connectkit fully mocked in `src/test/mocks.tsx`
- New components need to import mocks from there; wagmi hooks are redirected to mock fns

## SBT Contracts (Arbitrum)

> **Warning:** redeployment planned — these addresses may be stale. Verify on-chain before use.

- Experience: `0xbCF80cb53f173Ff8be96813a40be20eFAb2B59ed`
- Lawyer: `0x0d41Cb0c9Da123a7554C5eee87aD289874e85E48`
- safeMint: onlyOwner, 1 per address
- burn: token holder OR contract owner (via `_isAuthorized` override)
- Transfers blocked (TransfersNotPermitted)

## Design System

See `DESIGN.md` for full spec ("Neon Noir" dark theme). Tokens defined in `tailwind.config.ts`.

## Known Issues

- CSS files excluded from Biome (`*.css` in biome.json ignore) — Biome can't parse Tailwind directives
- `next.config.ts` has `outputFileTracingRoot: __dirname` to suppress monorepo lockfile warning
- WalletConnect needs `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` in .env.local (injected wallets work without)

## Pending

- Consider replacing ConnectKit with RainbowKit, AppKit, or a custom wagmi connect button to unblock React 19 / Next.js 16 / Wagmi 3 upgrade
- Contract redeployment needed — current deployed SBTs lack admin burn (`_isAuthorized` override).

