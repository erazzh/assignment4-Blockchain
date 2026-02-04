const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MyNFT", function () {
  it("mint sets owner and uri", async () => {
    const [owner, alice] = await ethers.getSigners();
    const NFT = await ethers.getContractFactory("MyNFT");
    const nft = await NFT.deploy();
    await nft.waitForDeployment();

    await nft.mint(alice.address, "ipfs://example/1.json");
    expect(await nft.ownerOf(0)).to.equal(alice.address);
    expect(await nft.tokenURI(0)).to.equal("ipfs://example/1.json");
  });
});
