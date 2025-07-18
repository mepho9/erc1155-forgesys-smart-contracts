const { expect } = require("chai");
const { ethers, upgrades, network } = require("hardhat");

describe("ForgeToken", function () {
  let deployer, user, forgeContract;
  let ForgeToken, forgeToken;

  beforeEach(async function () {
    [deployer, user, forgeContract] = await ethers.getSigners();

    ForgeToken = await ethers.getContractFactory("ForgeToken");
    forgeToken = await upgrades.deployProxy(ForgeToken, [], {
      initializer: "initialize",
    });
    await forgeToken.waitForDeployment();
  });

  it("should allow minting token ID 0, 1, or 2 with cooldown", async function () {
  await forgeToken.connect(user).mint(0);

  await expect(forgeToken.connect(user).mint(0)).to.be.revertedWith("Cooldown: wait 1s");

  await network.provider.send("evm_increaseTime", [2]);
  await network.provider.send("evm_mine");

  await forgeToken.connect(user).mint(1);
  const balance1 = await forgeToken.balanceOf(user.address, 1);
  expect(balance1).to.equal(1);
  });



  it("should revert if trying to mint ID > 2", async function () {
    await expect(forgeToken.connect(user).mint(3)).to.be.revertedWith("id must be between 0 and 2");
  });

  it("should not allow mintFromForge unless called by forgeContract", async function () {
    await expect(
      forgeToken.connect(user).mintFromForge(user.address, 3)
    ).to.be.revertedWith("Only forge can mint");
  });

  it("should allow mintFromForge only for forgeable IDs 3 to 6", async function () {
    await forgeToken.setForgeContract(forgeContract.address);

    await forgeToken.connect(forgeContract).mintFromForge(user.address, 3);
    expect(await forgeToken.balanceOf(user.address, 3)).to.equal(1);

    await expect(
      forgeToken.connect(forgeContract).mintFromForge(user.address, 7)
    ).to.be.revertedWith("Only forgeable tokens allowed");
  });

  it("should only allow forgeContract to burn", async function () {
    await forgeToken.setForgeContract(forgeContract.address);
    await forgeToken.connect(forgeContract).mintFromForge(user.address, 3);
    expect(await forgeToken.balanceOf(user.address, 3)).to.equal(1);

    await forgeToken.connect(forgeContract).burn(user.address, 3, 1);
    expect(await forgeToken.balanceOf(user.address, 3)).to.equal(0);

    await expect(
      forgeToken.connect(user).burn(user.address, 3, 1)
    ).to.be.revertedWith("Only forge can burn");
  });

  it("should not allow setting forgeContract to 0x0", async function () {
    await expect(
      forgeToken.setForgeContract("0x0000000000000000000000000000000000000000")
    ).to.be.revertedWith("Invalid address");
  });
});
