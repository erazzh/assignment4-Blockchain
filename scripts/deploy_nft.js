const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  const NFT = await hre.ethers.getContractFactory("MyNFT");
  const nft = await NFT.deploy();
  await nft.waitForDeployment();

  const addr = await nft.getAddress();
  console.log("MyNFT:", addr);

  const uris = [
    "ipfs://example/1.json",
    "ipfs://example/2.json",
    "ipfs://example/3.json",
  ];

  for (let i = 0; i < uris.length; i++) {
    const tx = await nft.mint(deployer.address, uris[i]);
    await tx.wait();
    console.log(`Minted tokenId ${i} uri ${uris[i]}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
