const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DeFi: LendingPool", function () {
  it("deposit and withdraw update accounting", async () => {
    const [owner, alice] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("MyToken");
    const token = await Token.deploy();
    await token.waitForDeployment();

    const Pool = await ethers.getContractFactory("LendingPool");
    const pool = await Pool.deploy(await token.getAddress());
    await pool.waitForDeployment();

    // give alice some tokens and approve pool
    await token.transfer(alice.address, 1000);
    await token.connect(alice).approve(await pool.getAddress(), 500);

    await pool.connect(alice).deposit(500);
    expect(await pool.totalDeposited()).to.equal(500);
    expect(await pool.deposited(alice.address)).to.equal(500);

    await pool.connect(alice).withdraw(200);
    expect(await pool.totalDeposited()).to.equal(300);
    expect(await pool.deposited(alice.address)).to.equal(300);

    await expect(pool.connect(alice).withdraw(999)).to.be.reverted;
  });
});
