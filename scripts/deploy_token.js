const hre = require("hardhat");

async function main() {
  const Token = await hre.ethers.getContractFactory("MyToken");
  const token = await Token.deploy();
  await token.waitForDeployment();

  console.log("MyToken:", await token.getAddress());
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
