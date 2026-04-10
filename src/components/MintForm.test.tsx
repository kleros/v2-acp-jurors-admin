import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { mockReset, mockUseWaitForTransactionReceipt, mockUseWriteContract, mockWriteContract } from "../test/mocks";
import { MintForm } from "./MintForm";

describe("MintForm", () => {
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
  });

  afterEach(() => {
    cleanup();
  });

  it("renders the mint form with token selector and address input", () => {
    render(<MintForm />);
    expect(screen.getByLabelText("Token")).toBeInTheDocument();
    expect(screen.getByLabelText("Recipient Address")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Mint" })).toBeInTheDocument();
  });

  it("shows both token options in the dropdown", () => {
    render(<MintForm />);
    const options = screen.getAllByRole("option");
    expect(options).toHaveLength(2);
    expect(options[0]).toHaveTextContent("ACP Experience");
    expect(options[1]).toHaveTextContent("ACP Lawyer");
  });

  it("disables mint button when address is empty", () => {
    render(<MintForm />);
    expect(screen.getByRole("button", { name: "Mint" })).toBeDisabled();
  });

  it("shows validation error for invalid address", async () => {
    const user = userEvent.setup();
    render(<MintForm />);
    await user.type(screen.getByLabelText("Recipient Address"), "not-an-address");
    expect(screen.getByText("Invalid Ethereum address")).toBeInTheDocument();
  });

  it("does not show validation error for empty input", () => {
    render(<MintForm />);
    expect(screen.queryByText("Invalid Ethereum address")).not.toBeInTheDocument();
  });

  it("enables mint button with valid address", async () => {
    const user = userEvent.setup();
    render(<MintForm />);
    await user.type(screen.getByLabelText("Recipient Address"), "0x1234567890abcdef1234567890abcdef12345678");
    expect(screen.getByRole("button", { name: "Mint" })).toBeEnabled();
  });

  it("calls writeContract with correct args on mint", async () => {
    const user = userEvent.setup();
    render(<MintForm />);
    await user.type(screen.getByLabelText("Recipient Address"), "0x1234567890abcdef1234567890abcdef12345678");
    await user.click(screen.getByRole("button", { name: "Mint" }));
    expect(mockWriteContract).toHaveBeenCalledWith({
      address: "0x2A2f1fBBf07C1372371cf4a65cB28C2DF681850b",
      abi: expect.any(Array),
      functionName: "safeMint",
      args: ["0x1234567890abcdef1234567890abcdef12345678"],
    });
  });

  it("calls writeContract with experience address when selected", async () => {
    const user = userEvent.setup();
    render(<MintForm />);
    await user.selectOptions(screen.getByLabelText("Token"), "experience");
    await user.type(screen.getByLabelText("Recipient Address"), "0x1234567890abcdef1234567890abcdef12345678");
    await user.click(screen.getByRole("button", { name: "Mint" }));
    expect(mockWriteContract).toHaveBeenCalledWith(
      expect.objectContaining({
        address: "0x4249564a17EE0143819a109FAB241F55B1A5e9B4",
      }),
    );
  });

  it("shows pending state while waiting for wallet confirmation", () => {
    mockUseWriteContract.mockReturnValue({
      data: undefined,
      writeContract: mockWriteContract,
      isPending: true,
      reset: mockReset,
    });
    render(<MintForm />);
    expect(screen.getByRole("button", { name: "Confirm in wallet..." })).toBeDisabled();
  });

  it("shows confirming state while waiting for tx", () => {
    mockUseWriteContract.mockReturnValue({
      data: "0xabc",
      writeContract: mockWriteContract,
      isPending: false,
      reset: mockReset,
    });
    mockUseWaitForTransactionReceipt.mockReturnValue({
      isLoading: true,
      isSuccess: false,
    });
    render(<MintForm />);
    expect(screen.getByRole("button", { name: "Confirming..." })).toBeDisabled();
  });

  it("shows success message with arbiscan link after mint", () => {
    mockUseWriteContract.mockReturnValue({
      data: "0xabcdef",
      writeContract: mockWriteContract,
      isPending: false,
      reset: mockReset,
    });
    mockUseWaitForTransactionReceipt.mockReturnValue({
      isLoading: false,
      isSuccess: true,
    });
    render(<MintForm />);
    expect(screen.getByText("Minted successfully!")).toBeInTheDocument();
    const link = screen.getByText("View on Arbiscan");
    expect(link).toHaveAttribute("href", "https://arbiscan.io/tx/0xabcdef");
  });
});
