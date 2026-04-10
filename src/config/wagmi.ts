import { getDefaultConfig } from "connectkit";
import { http, createConfig } from "wagmi";
import { arbitrum } from "wagmi/chains";

export const config = createConfig(
  getDefaultConfig({
    chains: [arbitrum],
    transports: {
      [arbitrum.id]: http(),
    },
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? "",
    appName: "Juror Certification",
    appDescription: "Mint and burn Kleros Argentina Consumer Protection Soulbound Tokens",
  }),
);
