const { ethers, upgrades } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("🚀 Deploying contracts with address:", deployer.address);

  // 1. Deploy ForgeToken (ERC1155)
  const ForgeToken = await ethers.getContractFactory("ForgeToken");
  const forgeToken = await upgrades.deployProxy(ForgeToken, [], {
    initializer: "initialize",
  });
  await forgeToken.waitForDeployment();
  const tokenAddress = await forgeToken.getAddress();
  console.log("✅ ForgeToken deployed to:", tokenAddress);

  // 2. Deploy ForgeLogic (forge controller)
  const ForgeLogic = await ethers.getContractFactory("ForgeLogic");
  const forgeLogic = await upgrades.deployProxy(ForgeLogic, [tokenAddress], {
    initializer: "initialize",
  });
  await forgeLogic.waitForDeployment();
  const logicAddress = await forgeLogic.getAddress();
  console.log("✅ ForgeLogic deployed to:", logicAddress);

  // 3. Link: Set ForgeLogic as forgeContract in ForgeToken
  const tx = await forgeToken.setForgeContract(logicAddress);
  await tx.wait();
  console.log("🔗 Forge contract linked in ForgeToken.");
}

main().catch((error) => {
  console.error("❌ Deployment failed:", error);
  process.exit(1);
});
