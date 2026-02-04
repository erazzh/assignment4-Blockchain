const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deployer:", deployer.address);

  // 1) ERC-20
  const Token = await hre.ethers.getContractFactory("MyToken");
  const token = await Token.deploy();
  await token.waitForDeployment();
  const tokenAddr = await token.getAddress();
  console.log("MyToken deployed:", tokenAddr);

  // 2) ERC-721
  const NFT = await hre.ethers.getContractFactory("MyNFT");
  const nft = await NFT.deploy();
  await nft.waitForDeployment();
  const nftAddr = await nft.getAddress();
  console.log("MyNFT deployed:", nftAddr);

  // mint 3 NFTs
  const uris = ["ipfs://example/1.json", "ipfs://example/2.json", "ipfs://example/3.json"];
  for (let i = 0; i < uris.length; i++) {
    const tx = await nft.mint(deployer.address, uris[i]);
    await tx.wait();
    console.log(`Minted NFT tokenId ${i} -> ${uris[i]}`);
  }

  console.log("TOKEN_ADDRESS =", tokenAddr);
  console.log("NFT_ADDRESS   =", nftAddr);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
