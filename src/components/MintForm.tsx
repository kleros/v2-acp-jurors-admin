"use client";

import { type ContractKey, contracts, sbtAbi } from "@/config/contracts";
import { useState } from "react";
import { type Address, isAddress } from "viem";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";

export function MintForm() {
  const [selectedToken, setSelectedToken] = useState<ContractKey>("lawyer");
  const [recipient, setRecipient] = useState("");

  const { data: hash, writeContract, isPending, reset } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const handleMint = () => {
    if (!isAddress(recipient)) return;
    writeContract({
      address: contracts[selectedToken].address,
      abi: sbtAbi,
      functionName: "safeMint",
      args: [recipient as Address],
    });
  };

  return (
    <div className="rounded-xl bg-noir-surface/80 p-6 shadow-float outline outline-1 outline-ghost backdrop-blur-sm">
      <h2 className="mb-5 font-display text-xl font-semibold text-on-surface">Mint SBT</h2>

      <div className="space-y-4">
        <div>
          <label htmlFor="mint-token" className="mb-1 block font-display text-label-sm text-on-surface-variant">
            Token
          </label>
          <select
            id="mint-token"
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
        </div>

        <div>
          <label htmlFor="mint-recipient" className="mb-1 block font-display text-label-sm text-on-surface-variant">
            Recipient Address
          </label>
          <input
            id="mint-recipient"
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="0x..."
            className="w-full rounded-lg border-none bg-noir-elevated px-3 py-2.5 font-mono text-sm text-on-surface outline outline-1 outline-ghost placeholder:text-on-surface-variant transition focus:outline-secondary-dim focus:ring-0"
          />
          {recipient && !isAddress(recipient) && <p className="mt-1 text-sm text-tertiary">Invalid Ethereum address</p>}
        </div>

        <button
          type="button"
          onClick={handleMint}
          disabled={!isAddress(recipient) || isPending || isConfirming}
          className="w-full rounded-lg bg-primary px-4 py-2.5 font-display text-sm font-semibold text-primary-on transition-all hover:shadow-glow-primary disabled:cursor-not-allowed disabled:bg-noir-elevated disabled:text-on-surface-variant disabled:shadow-none"
        >
          {isPending ? "Confirm in wallet..." : isConfirming ? "Confirming..." : "Mint"}
        </button>

        {isSuccess && (
          <div className="rounded-lg bg-noir-elevated p-3 text-sm text-primary outline outline-1 outline-ghost">
            Minted successfully!{" "}
            <a
              href={`https://arbiscan.io/tx/${hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-secondary underline hover:text-secondary-dim"
            >
              View on Arbiscan
            </a>
            <a
              href={`https://opensea.io/${recipient}`}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 text-secondary underline hover:text-secondary-dim"
            >
              View on OpenSea
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
