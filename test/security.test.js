const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Security: Reentrancy", function () {
  it("Attack drains VulnerableBank (proof of exploit)", async () => {
    const [owner, attackerEOA] = await ethers.getSigners();

    const Bank = await ethers.getContractFactory("VulnerableBank");
    const bank = await Bank.deploy();
    await bank.waitForDeployment();

    // give bank 5 ETH to be stolen
    await owner.sendTransaction({
      to: await bank.getAddress(),
      value: ethers.parseEther("5"),
    });

    const Attack = await ethers.getContractFactory("Attack");
    const attack = await Attack.connect(attackerEOA).deploy(await bank.getAddress());
    await attack.waitForDeployment();

    const bankAddr = await bank.getAddress();
    const before = await ethers.provider.getBalance(bankAddr);

    // attacker deposits 1 ETH and reenters multiple times
    const tx = await attack.connect(attackerEOA).attack(5, {
      value: ethers.parseEther("1"),
      gasLimit: 10_000_000,
    });
    await tx.wait();

    const after = await ethers.provider.getBalance(bankAddr);

    // proof: bank lost ETH
    expect(after).to.be.lt(before);
  });

  it("Attack fails on FixedBank", async () => {
    const [owner, attackerEOA] = await ethers.getSigners();

    const Bank = await ethers.getContractFactory("FixedBank");
    const bank = await Bank.deploy();
    await bank.waitForDeployment();

    await owner.sendTransaction({
      to: await bank.getAddress(),
      value: ethers.parseEther("5"),
    });

    const Attack = await ethers.getContractFactory("Attack");
    const attack = await Attack.connect(attackerEOA).deploy(await bank.getAddress());
    await attack.waitForDeployment();

    await expect(
      attack.connect(attackerEOA).attack(5, {
        value: ethers.parseEther("1"),
        gasLimit: 10_000_000,
      })
    ).to.be.reverted;
  });
});
