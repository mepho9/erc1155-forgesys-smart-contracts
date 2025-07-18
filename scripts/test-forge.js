const { ethers, network } = require("hardhat");

async function mintTokens(token, user, tokenIds) {
  for (const id of tokenIds) {
    await token.connect(user).mint(id);
    console.log(`Minted token ID: ${id}`);
    await network.provider.send("evm_increaseTime", [3]);
    await network.provider.send("evm_mine");
  }
  console.log(`All tokens minted: [${tokenIds.join(", ")}]\n`);
}

async function main() {
  const [user] = await ethers.getSigners();

  const forgeTokenAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
  const forgeLogicAddress = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";

  const token = await ethers.getContractAt("ForgeToken", forgeTokenAddress);
  const logic = await ethers.getContractAt("ForgeLogic", forgeLogicAddress);

  await mintTokens(token, user, [0, 1, 2]);
  await logic.connect(user).forgeTheToken(3);
  console.log("Forged token ID: 3\n");

  await mintTokens(token, user, [1, 2]);
  await logic.connect(user).forgeTheToken(4);
  console.log("Forged token ID: 4\n");

  await mintTokens(token, user, [0, 2]);
  await logic.connect(user).forgeTheToken(5);
  console.log("Forged token ID: 5\n");

  await mintTokens(token, user, [0, 1, 2]);
  await logic.connect(user).forgeTheToken(6);
  console.log("Forged token ID: 6\n");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
