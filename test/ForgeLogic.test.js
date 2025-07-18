const { expect } = require("chai");
const { ethers, upgrades, network } = require("hardhat");

describe("ForgeLogic", function () {
  let deployer, user;
  let ForgeToken, ForgeLogic;
  let forgeToken, forgeLogic;

  beforeEach(async function () {
    [deployer, user] = await ethers.getSigners();

    // Deploy ForgeToken
    ForgeToken = await ethers.getContractFactory("ForgeToken");
    forgeToken = await upgrades.deployProxy(ForgeToken, [], {
      initializer: "initialize",
    });
    await forgeToken.waitForDeployment();

    // Deploy ForgeLogic with token address
    ForgeLogic = await ethers.getContractFactory("ForgeLogic");
    forgeLogic = await upgrades.deployProxy(ForgeLogic, [await forgeToken.getAddress()], {
      initializer: "initialize",
    });
    await forgeLogic.waitForDeployment();

    // Link contracts
    await forgeToken.setForgeContract(await forgeLogic.getAddress());
  });

  it("should forge ID 3 using token 0 and 1", async function () {
    await forgeToken.connect(user).mint(0);
    await network.provider.send("evm_increaseTime", [3]); // cooldown exceeded
    await network.provider.send("evm_mine");

    await forgeToken.connect(user).mint(1);
    await network.provider.send("evm_increaseTime", [3]);
    await network.provider.send("evm_mine");

    await forgeLogic.connect(user).forgeTheToken(3);

    expect(await forgeToken.balanceOf(user.address, 3)).to.equal(1);
    expect(await forgeToken.balanceOf(user.address, 0)).to.equal(0);
    expect(await forgeToken.balanceOf(user.address, 1)).to.equal(0);
  });

  it("should revert forging ID 3 if missing required tokens", async function () {
    await forgeToken.connect(user).mint(0);
    await expect(forgeLogic.connect(user).forgeTheToken(3)).to.be.reverted;
  });

  it("should forge ID 6 from token 0, 1 and 2", async function () {
    await forgeToken.connect(user).mint(0);
    await network.provider.send("evm_increaseTime", [3]);
    await network.provider.send("evm_mine");

    await forgeToken.connect(user).mint(1);
    await network.provider.send("evm_increaseTime", [3]);
    await network.provider.send("evm_mine");

    await forgeToken.connect(user).mint(2);
    await network.provider.send("evm_increaseTime", [3]);
    await network.provider.send("evm_mine");

    await forgeLogic.connect(user).forgeTheToken(6);

    expect(await forgeToken.balanceOf(user.address, 6)).to.equal(1);
    expect(await forgeToken.balanceOf(user.address, 0)).to.equal(0);
    expect(await forgeToken.balanceOf(user.address, 1)).to.equal(0);
    expect(await forgeToken.balanceOf(user.address, 2)).to.equal(0);
  });

  it("should revert with invalid forge ID", async function () {
    await expect(forgeLogic.connect(user).forgeTheToken(999)).to.be.revertedWith("Invalid token ID");
    await expect(forgeLogic.connect(user).forgeTheToken(2)).to.be.revertedWith("Invalid token ID");
  });
});
