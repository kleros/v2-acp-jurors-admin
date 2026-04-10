"use client";

import { type ReactNode, useEffect } from "react";
import { useAccount, useSwitchChain } from "wagmi";
import { arbitrum } from "wagmi/chains";

export function NetworkGuard({ children }: { children: ReactNode }) {
  const { isConnected, chainId } = useAccount();
  const { switchChain } = useSwitchChain();

  const needsSwitch = isConnected && chainId !== arbitrum.id;

  useEffect(() => {
    if (needsSwitch && switchChain) {
      switchChain({ chainId: arbitrum.id });
    }
  }, [needsSwitch, switchChain]);

  if (needsSwitch) {
    return (
      <div className="rounded-xl bg-noir-surface/80 p-6 text-center shadow-float outline outline-1 outline-ghost backdrop-blur-sm">
        <p className="font-display text-sm text-secondary">Please switch to Arbitrum One to continue.</p>
        <button
          type="button"
          onClick={() => switchChain?.({ chainId: arbitrum.id })}
          className="mt-4 rounded-lg bg-transparent px-5 py-2.5 font-display text-sm font-medium text-secondary outline outline-1 outline-secondary/20 transition-all hover:shadow-glow-purple"
        >
          Switch to Arbitrum
        </button>
      </div>
    );
  }

  return <>{children}</>;
}
