import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  mockReset,
  mockUseReadContract,
  mockUseWaitForTransactionReceipt,
  mockUseWriteContract,
  mockWriteContract,
} from "../test/mocks";
import { BurnForm } from "./BurnForm";

vi.mock("@/hooks/useTokenLookup", () => ({
  useTokenLookup: vi.fn().mockReturnValue({
    tokenId: null,
    balance: undefined,
    isLoading: false,
    error: null,
  }),
}));

import { useTokenLookup } from "@/hooks/useTokenLookup";
const mockUseTokenLookup = vi.mocked(useTokenLookup);

describe("BurnForm", () => {
  beforeEach(() => {
    mockUseWriteContract.mockReturnValue({
      data: undefined,
      writeContract: mockWriteContract,
      isPending: false,
      reset: mockReset,
    });
    mockUseWaitForTransactionReceipt.mockReturnValue({
      isLoading: false,
      isSuccess: false,
    });
    mockUseReadContract.mockReturnValue({ data: undefined });
    mockUseTokenLookup.mockReturnValue({
      tokenId: null,
      balance: undefined,
      isLoading: false,
      error: null,
    });
  });

  afterEach(() => {
    cleanup();
  });

  it("renders the burn form with token selector and address input", () => {
    render(<BurnForm />);
    expect(screen.getByLabelText("Token")).toBeInTheDocument();
    expect(screen.getByLabelText("Token Holder Address")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Burn" })).toBeInTheDocument();
  });

  it("shows arbiscan link for token holders", () => {
    render(<BurnForm />);
    const link = screen.getByText(/View token holders on Arbiscan/);
    expect(link).toHaveAttribute(
      "href",
      "https://arbiscan.io/token/0x0d41Cb0c9Da123a7554C5eee87aD289874e85E48#balances",
    );
  });

  it("updates arbiscan link when switching token", async () => {
    const user = userEvent.setup();
    render(<BurnForm />);
    await user.selectOptions(screen.getByLabelText("Token"), "experience");
    const link = screen.getByText(/View token holders on Arbiscan/);
    expect(link).toHaveAttribute(
      "href",
      "https://arbiscan.io/token/0xbCF80cb53f173Ff8be96813a40be20eFAb2B59ed#balances",
    );
  });

  it("disables burn button when no token found", () => {
    render(<BurnForm />);
    expect(screen.getByRole("button", { name: "Burn" })).toBeDisabled();
  });

  it("shows validation error for invalid address", async () => {
    const user = userEvent.setup();
    render(<BurnForm />);
    await user.type(screen.getByLabelText("Token Holder Address"), "invalid");
    expect(screen.getByText("Invalid Ethereum address")).toBeInTheDocument();
  });

  it("shows loading state while looking up token", async () => {
    mockUseTokenLookup.mockReturnValue({
      tokenId: null,
      balance: undefined,
      isLoading: true,
      error: null,
    });
    const user = userEvent.setup();
    render(<BurnForm />);
    await user.type(screen.getByLabelText("Token Holder Address"), "0x1234567890abcdef1234567890abcdef12345678");
    expect(screen.getByText("Looking up token...")).toBeInTheDocument();
  });

  it("shows token not found when balance is zero", async () => {
    mockUseTokenLookup.mockReturnValue({
      tokenId: null,
      balance: 0n,
      isLoading: false,
      error: null,
    });
    const user = userEvent.setup();
    render(<BurnForm />);
    await user.type(screen.getByLabelText("Token Holder Address"), "0x1234567890abcdef1234567890abcdef12345678");
    expect(screen.getByText("This address does not hold a token.")).toBeInTheDocument();
  });

  it("shows found tokenId and enables burn button", async () => {
    mockUseTokenLookup.mockReturnValue({
      tokenId: 42n,
      balance: 1n,
      isLoading: false,
      error: null,
    });
    const user = userEvent.setup();
    render(<BurnForm />);
    await user.type(screen.getByLabelText("Token Holder Address"), "0x1234567890abcdef1234567890abcdef12345678");
    expect(screen.getByText("42")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Burn" })).toBeEnabled();
  });

  it("calls writeContract with correct tokenId on burn", async () => {
    mockUseTokenLookup.mockReturnValue({
      tokenId: 42n,
      balance: 1n,
      isLoading: false,
      error: null,
    });
    const user = userEvent.setup();
    render(<BurnForm />);
    await user.type(screen.getByLabelText("Token Holder Address"), "0x1234567890abcdef1234567890abcdef12345678");
    await user.click(screen.getByRole("button", { name: "Burn" }));
    expect(mockWriteContract).toHaveBeenCalledWith({
      address: "0x0d41Cb0c9Da123a7554C5eee87aD289874e85E48",
      abi: expect.any(Array),
      functionName: "burn",
      args: [42n],
    });
  });

  it("shows lookup error", async () => {
    mockUseTokenLookup.mockReturnValue({
      tokenId: null,
      balance: undefined,
      isLoading: false,
      error: "RPC error",
    });
    const user = userEvent.setup();
    render(<BurnForm />);
    await user.type(screen.getByLabelText("Token Holder Address"), "0x1234567890abcdef1234567890abcdef12345678");
    expect(screen.getByText("Error: RPC error")).toBeInTheDocument();
  });

  it("shows success message after burn", () => {
    mockUseTokenLookup.mockReturnValue({
      tokenId: 42n,
      balance: 1n,
      isLoading: false,
      error: null,
    });
    mockUseWriteContract.mockReturnValue({
      data: "0xburnhash",
      writeContract: mockWriteContract,
      isPending: false,
      reset: mockReset,
    });
    mockUseWaitForTransactionReceipt.mockReturnValue({
      isLoading: false,
      isSuccess: true,
    });
    render(<BurnForm />);
    expect(screen.getByText("Burned successfully!")).toBeInTheDocument();
    const link = screen.getByText("View on Arbiscan");
    expect(link).toHaveAttribute("href", "https://arbiscan.io/tx/0xburnhash");
  });
});
