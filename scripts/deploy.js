const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contract with the account:", deployer.address);

  // Разворачиваем контракт
  const AITUToken = await ethers.getContractFactory("AITUToken");
  const token = await AITUToken.deploy();

  await token.waitForDeployment();

  console.log("AITUToken deployed to:", await token.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
