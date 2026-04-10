"use client";

import { type ContractKey, contracts, sbtAbi } from "@/config/contracts";
import { useTokenLookup } from "@/hooks/useTokenLookup";
import { useState } from "react";
import { type Address, isAddress } from "viem";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";

export function BurnForm() {
  const [selectedToken, setSelectedToken] = useState<ContractKey>("lawyer");
  const [ownerAddress, setOwnerAddress] = useState("");

  const contractAddress = contracts[selectedToken].address;
  const validAddress = isAddress(ownerAddress) ? (ownerAddress as Address) : undefined;

  const {
    tokenId,
    balance,
    isLoading: isLookingUp,
    error: lookupError,
  } = useTokenLookup(contractAddress, validAddress);

  const { data: hash, writeContract, isPending, reset } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const handleBurn = () => {
    if (tokenId === null) return;
    writeContract({
      address: contractAddress,
      abi: sbtAbi,
      functionName: "burn",
      args: [tokenId],
    });
  };

  return (
    <div className="rounded-xl bg-noir-surface/80 p-6 shadow-float outline outline-1 outline-ghost backdrop-blur-sm">
      <h2 className="mb-5 font-display text-xl font-semibold text-on-surface">Burn SBT</h2>

      <div className="space-y-4">
        <div>
          <label htmlFor="burn-token" className="mb-1 block font-display text-label-sm text-on-surface-variant">
            Token
          </label>
          <select
            id="burn-token"
            value={selectedToken}
            onChange={(e) => setSelectedToken(e.target.value as ContractKey)}
            className="w-full rounded-lg border-none bg-noir-elevated px-3 py-2.5 text-sm text-on-surface outline outline-1 outline-ghost transition focus:outline-secondary-dim focus:ring-0"
          >
            {Object.entries(contracts).map(([key, { label }]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
          <a
            href={`https://arbiscan.io/token/${contractAddress}#balances`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center gap-1 text-sm text-secondary transition-colors hover:text-secondary-dim"
          >
            View token holders on Arbiscan &#8599;
          </a>
        </div>

        <div>
          <label htmlFor="burn-owner" className="mb-1 block font-display text-label-sm text-on-surface-variant">
            Token Holder Address
          </label>
          <input
            id="burn-owner"
            type="text"
            value={ownerAddress}
            onChange={(e) => setOwnerAddress(e.target.value)}
            placeholder="0x..."
            className="w-full rounded-lg border-none bg-noir-elevated px-3 py-2.5 font-mono text-sm text-on-surface outline outline-1 outline-ghost placeholder:text-on-surface-variant transition focus:outline-secondary-dim focus:ring-0"
          />
          {ownerAddress && !isAddress(ownerAddress) && (
            <p className="mt-1 text-sm text-tertiary">Invalid Ethereum address</p>
          )}
        </div>

        {validAddress && (
          <div className="rounded-lg bg-noir-elevated p-3 text-sm outline outline-1 outline-ghost">
            {isLookingUp ? (
              <p className="text-on-surface-variant">Looking up token...</p>
            ) : lookupError ? (
              <p className="text-tertiary">Error: {lookupError}</p>
            ) : balance === 0n ? (
              <p className="text-on-surface-variant">This address does not hold a token.</p>
            ) : tokenId !== null ? (
              <p className="text-on-surface">
                Found token ID: <span className="font-mono font-semibold text-primary">{tokenId.toString()}</span>
              </p>
            ) : (
              <p className="text-on-surface-variant">No active token found for this address.</p>
            )}
          </div>
        )}

        <button
          type="button"
          onClick={handleBurn}
          disabled={tokenId === null || isPending || isConfirming}
          className="w-full rounded-lg bg-tertiary px-4 py-2.5 font-display text-sm font-semibold text-noir-bg transition-all hover:shadow-glow-magenta disabled:cursor-not-allowed disabled:bg-noir-elevated disabled:text-on-surface-variant disabled:shadow-none"
        >
          {isPending ? "Confirm in wallet..." : isConfirming ? "Confirming..." : "Burn"}
        </button>

        {isSuccess && (
          <div className="rounded-lg bg-noir-elevated p-3 text-sm text-primary outline outline-1 outline-ghost">
            Burned successfully!{" "}
            <a
              href={`https://arbiscan.io/tx/${hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-secondary underline hover:text-secondary-dim"
            >
              View on Arbiscan
            </a>
            <button
              type="button"
              onClick={reset}
              className="ml-2 text-on-surface-variant underline hover:text-on-surface"
            >
              Reset
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
