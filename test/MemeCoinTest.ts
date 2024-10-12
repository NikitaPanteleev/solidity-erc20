import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract, Signer } from "ethers"; 
import { MemeCoin } from "../typechain-types";

describe("MyToken", function () {
  let myToken: MemeCoin;
  let owner: Signer;
  let addr1: Signer;
  let addr2: Signer;

  // Common logic to deploy the contract
  const deployToken = async (name: string, symbol: string) => {
    const contractFactory = await ethers.getContractFactory("MemeCoin");
    const deployedContract = await contractFactory.deploy(name, symbol);
    await deployedContract.waitForDeployment();
    return deployedContract;
  };

  beforeEach(async () => {
    // Get signers and deploy a new instance of the contract before each test
    [owner, addr1, addr2] = await ethers.getSigners();
    myToken = await deployToken("NewAwesomeMeme", "NAM");
  });

 it("Should deploy the contract and check the contract address is not null", async function () {
    expect(await myToken.getAddress()).to.not.be.null;
    expect(await myToken.name()).to.be.eq("NewAwesomeMeme");
    expect(await myToken.symbol()).to.be.eq("NAM");

    // Console log the contract address and token name
    console.log("Contract deployed to:", await myToken.getAddress(), await myToken.name());
  });

  it("Should check that the owner balance is initially 0", async function () {
    expect(await myToken.balanceOf(owner.getAddress())).to.be.eq(0);
  });

  it("Should allow minters to mint tokens on bonding curve", async function () {
    const tokenAmount = ethers.parseUnits("100", 1);
      // Calculate the price for the tokens based on the bonding curve logic
      const priceForTokens = await myToken.coinPrice(tokenAmount);
      await myToken.connect(addr1).mint(tokenAmount, {
        value: priceForTokens,
      });

      const addr1Balance: bigint = await myToken.balanceOf(await addr1.getAddress());
      expect(addr1Balance).to.equal(tokenAmount);
  })

  it("Should fail if trying to mint more than the max supply", async function () {
    const tokenAmount = ethers.parseUnits("1000001", 18); // Exceeds max supply

    await expect(
      myToken.connect(addr1).mint(tokenAmount, { value: ethers.parseEther("10") })
    ).to.be.revertedWith("You are trying to mint over the max supply");
  });

  it("Should mint all tokens in 2 transactions and check contract balance", async function () {
    const maxSupply = await myToken.MAX_SUPPLY();
    const halfSupply = maxSupply / BigInt(2); 

    // Get price for half the supply
    const priceForFirstHalf: bigint = await myToken.coinPrice(halfSupply);
    console.log(`first half: ${ethers.formatEther(priceForFirstHalf)}`);
    // addr1 mints half of the supply in the first transaction
    await myToken.connect(addr1).mint(halfSupply, {
      value: priceForFirstHalf,
    });
    expect(await myToken.totalTokensSold()).to.equal(halfSupply);

    const priceForSecondHalf: bigint = await myToken.coinPrice(halfSupply);

    // addr2 mints the remaining half in the second transaction
    await myToken.connect(addr2).mint(halfSupply, {
      value: priceForSecondHalf,
    });

    expect(await myToken.totalTokensSold()).to.equal(maxSupply);

    const contractBalance = await ethers.provider.getBalance(myToken.getAddress());
    expect(contractBalance).to.equal(priceForFirstHalf + priceForSecondHalf);
    
    console.log(`Contract owns ${ethers.formatEther(contractBalance)} ETH after both transactions.`);
  });
});