import { expect } from "chai";
import { ethers } from "hardhat";

describe("MyToken", function () {
  let myToken: any;
  let owner: any;

  // Common logic to deploy the contract
  const deployToken = async (name: string, symbol: string) => {
    const contractFactory = await ethers.getContractFactory("MemeCoin");
    const deployedContract = await contractFactory.deploy(name, symbol);
    return deployedContract;
  };

  beforeEach(async () => {
    // Get signers and deploy a new instance of the contract before each test
    [owner] = await ethers.getSigners();
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
    expect(await myToken.balanceOf(owner.address)).to.be.eq(0);
  });
});