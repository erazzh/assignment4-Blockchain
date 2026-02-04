const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MyToken", function () {
  it("owner can mint", async () => {
    const [owner, alice] = await ethers.getSigners();
    const Token = await ethers.getContractFactory("MyToken");
    const token = await Token.deploy();
    await token.waitForDeployment();

    await expect(token.connect(alice).mint(alice.address, 1)).to.be.reverted;
    await token.mint(alice.address, 100);
    expect(await token.balanceOf(alice.address)).to.equal(100);
  });

  it("transfer + approve + transferFrom works", async () => {
    const [owner, alice, bob] = await ethers.getSigners();
    const Token = await ethers.getContractFactory("MyToken");
    const token = await Token.deploy();
    await token.waitForDeployment();

    await token.transfer(alice.address, 1000);
    await token.connect(alice).approve(bob.address, 200);
    await token.connect(bob).transferFrom(alice.address, bob.address, 150);

    expect(await token.balanceOf(bob.address)).to.equal(150);
    expect(await token.allowance(alice.address, bob.address)).to.equal(50);
  });
});
