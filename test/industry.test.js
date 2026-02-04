const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Industry: SupplyChain", function () {
  it("register -> inTransit -> delivered", async () => {
    const [owner, alice] = await ethers.getSigners();

    const SC = await ethers.getContractFactory("SupplyChain");
    const sc = await SC.deploy();
    await sc.waitForDeployment();

    await sc.connect(alice).registerItem(1, "Box #1");
    let item = await sc.items(1);
    expect(item.exists).to.equal(true);

    await sc.connect(alice).updateStatus(1, 1); // InTransit
    await sc.connect(alice).updateStatus(1, 2); // Delivered

    item = await sc.items(1);
    expect(item.status).to.equal(2);
  });
});
