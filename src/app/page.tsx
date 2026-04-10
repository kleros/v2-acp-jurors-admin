"use client";

import { BurnForm } from "@/components/BurnForm";
import { MintForm } from "@/components/MintForm";
import { NetworkGuard } from "@/components/NetworkGuard";
import { ConnectKitButton } from "connectkit";

export default function Home() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-10 md:pl-20 md:pr-10">
      <div className="mb-12 flex items-center justify-between">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/kleros-logo.svg" alt="Kleros" className="h-12 w-auto opacity-80" />
        <ConnectKitButton />
      </div>

      <div className="mb-12">
        <p className="mb-1 font-display text-label-sm uppercase tracking-widest text-secondary">
          Kleros Argentina Consumer Protection
        </p>
        <h1 className="font-display text-4xl font-bold tracking-tight text-on-surface">Juror Certification</h1>
      </div>

      <NetworkGuard>
        <div className="space-y-8">
          <MintForm />
          <BurnForm />
        </div>
      </NetworkGuard>
    </main>
  );
}
