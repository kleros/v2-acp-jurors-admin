"use client";

import { sbtAbi } from "@/config/contracts";
import { useEffect, useState } from "react";
import { type Address, parseAbiItem, zeroAddress } from "viem";
import { usePublicClient, useReadContract } from "wagmi";
import { arbitrum } from "wagmi/chains";

const transferEvent = parseAbiItem("event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)");

export function useTokenLookup(contractAddress: Address | undefined, ownerAddress: Address | undefined) {
  const publicClient = usePublicClient({ chainId: arbitrum.id });
  const [tokenId, setTokenId] = useState<bigint | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: balance } = useReadContract({
    address: contractAddress,
    abi: sbtAbi,
    functionName: "balanceOf",
    args: ownerAddress ? [ownerAddress] : undefined,
    chainId: arbitrum.id,
    query: { enabled: !!contractAddress && !!ownerAddress },
  });

  useEffect(() => {
    if (!publicClient || !contractAddress || !ownerAddress || balance === 0n) {
      setTokenId(null);
      setError(null);
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    setError(null);

    publicClient
      .getLogs({
        address: contractAddress,
        event: transferEvent,
        args: { from: zeroAddress, to: ownerAddress },
        fromBlock: 0n,
        toBlock: "latest",
      })
      .then(async (logs) => {
        if (cancelled) return;

        for (const log of logs.reverse()) {
          const id = log.args.tokenId;
          if (id === undefined) continue;

          try {
            const owner = await publicClient.readContract({
              address: contractAddress,
              abi: sbtAbi,
              functionName: "ownerOf",
              args: [id],
            });
            if (!cancelled && owner.toLowerCase() === ownerAddress.toLowerCase()) {
              setTokenId(id);
              setIsLoading(false);
              return;
            }
          } catch {
            // Token was burned, continue checking
          }
        }

        if (!cancelled) {
          setTokenId(null);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to lookup token");
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [publicClient, contractAddress, ownerAddress, balance]);

  return { tokenId, balance, isLoading, error };
}
