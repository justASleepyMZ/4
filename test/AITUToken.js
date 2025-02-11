const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("AITUToken", function () {
  let Token, token, owner, addr1, addr2;
  const initialSupply = 2000;
  const tokenPrice = ethers.parseEther("0.001");

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    Token = await ethers.getContractFactory("AITUToken");
    token = await Token.deploy();
    await token.waitForDeployment();

    await owner.sendTransaction({
      to: token.target,
      value: ethers.parseEther("10"),
    });

    await owner.sendTransaction({
      to: addr1.address,
      value: ethers.parseEther("1"),
    });
  });

  it("Should assign the total supply to the owner", async function () {
    expect(await token.balanceOf(owner.address)).to.equal(ethers.parseUnits(initialSupply.toString(), 18));
  });

  it("Should allow users to buy tokens", async function () {
    const amountToBuy = ethers.parseUnits("10", 18);
    const requiredETH = (amountToBuy * tokenPrice) / ethers.parseUnits("1", 18);

    await token.connect(addr1).buyTokens(amountToBuy, { value: requiredETH });

    expect(await token.balanceOf(addr1.address)).to.equal(amountToBuy);
    expect(await token.balanceOf(owner.address)).to.equal(
      ethers.parseUnits((initialSupply - 10).toString(), 18)
    );
  });

  it("Should revert if not enough ETH sent for buying", async function () {
    const amountToBuy = ethers.parseUnits("10", 18);
    const insufficientETH = (amountToBuy * tokenPrice) / ethers.parseUnits("1", 18) - 1n;

    await expect(token.connect(addr1).buyTokens(amountToBuy, { value: insufficientETH }))
      .to.be.revertedWith("Not enough ETH sent");
  });

  it("Should allow users to sell tokens", async function () {
    const amountToBuy = ethers.parseUnits("10", 18);
    const requiredETH = (amountToBuy * tokenPrice) / ethers.parseUnits("1", 18);

    await token.connect(addr1).buyTokens(amountToBuy, { value: requiredETH });

    await token.connect(addr1).sellTokens(amountToBuy);

    expect(await token.balanceOf(addr1.address)).to.equal(0);
  });

  it("Should revert if not enough tokens to sell", async function () {
    await expect(token.connect(addr1).sellTokens(ethers.parseUnits("10", 18)))
      .to.be.revertedWith("Not enough tokens");
  });
});
