import { describe, expect, it } from "vitest";
import { contracts, sbtAbi } from "./contracts";

describe("contracts config", () => {
  it("has experience and lawyer contracts", () => {
    expect(contracts.experience.address).toBe("0xbCF80cb53f173Ff8be96813a40be20eFAb2B59ed");
    expect(contracts.lawyer.address).toBe("0x0d41Cb0c9Da123a7554C5eee87aD289874e85E48");
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
