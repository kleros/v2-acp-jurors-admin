import { vi } from "vitest";

export const mockWriteContract = vi.fn();
export const mockReset = vi.fn();

export const mockUseWriteContract = vi.fn().mockReturnValue({
  data: undefined,
  writeContract: mockWriteContract,
  isPending: false,
  reset: mockReset,
});

export const mockUseWaitForTransactionReceipt = vi.fn().mockReturnValue({
  isLoading: false,
  isSuccess: false,
});

export const mockUsePublicClient = vi.fn().mockReturnValue(undefined);

export const mockUseReadContract = vi.fn().mockReturnValue({
  data: undefined,
});

vi.mock("wagmi", async () => {
  const actual = await vi.importActual("wagmi");
  return {
    ...actual,
    useWriteContract: (...args: unknown[]) => mockUseWriteContract(...args),
    useWaitForTransactionReceipt: (...args: unknown[]) => mockUseWaitForTransactionReceipt(...args),
    usePublicClient: (...args: unknown[]) => mockUsePublicClient(...args),
    useReadContract: (...args: unknown[]) => mockUseReadContract(...args),
  };
});

vi.mock("connectkit", () => ({
  ConnectKitButton: () => <button type="button">Connect Wallet</button>,
  ConnectKitProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  getDefaultConfig: (config: Record<string, unknown>) => config,
}));

vi.mock("wagmi/chains", () => ({
  arbitrum: { id: 42161, name: "Arbitrum One" },
}));
