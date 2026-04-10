import { describe, expect, it } from "vitest";
import { contracts, sbtAbi } from "./contracts";

describe("contracts config", () => {
  it("has experience and lawyer contracts", () => {
    expect(contracts.experience.address).toBe("0x4249564a17EE0143819a109FAB241F55B1A5e9B4");
    expect(contracts.lawyer.address).toBe("0x2A2f1fBBf07C1372371cf4a65cB28C2DF681850b");
  });

  it("has labels for both contracts", () => {
    expect(contracts.experience.label).toBe("ACP Experience");
    expect(contracts.lawyer.label).toBe("ACP Lawyer");
  });

  it("ABI includes safeMint, burn, balanceOf, ownerOf, and Transfer event", () => {
    const functionNames = sbtAbi.filter((item) => item.type === "function").map((item) => item.name);
    expect(functionNames).toContain("safeMint");
    expect(functionNames).toContain("burn");
    expect(functionNames).toContain("balanceOf");
    expect(functionNames).toContain("ownerOf");

    const eventNames = sbtAbi.filter((item) => item.type === "event").map((item) => item.name);
    expect(eventNames).toContain("Transfer");
  });
});
