import { expect } from "chai";
import { ethers } from "hardhat";

describe("MyToken", function () {
  it("Should deploy the contract and check the contract address is not null", async function () {
    // Get the contract factory
    const MyToken = await ethers.getContractFactory("MemeCoin");

    // Deploy the contract with name, symbol, and initial supply
    const myToken = await MyToken.deploy("NewAwesomeMeme", "NAM");

    // Check that the contract address is valid (not null or zero address)
    expect(await myToken.getAddress()).to.not.be.null;
    expect(await myToken.name()).to.be.eq("NewAwesomeMeme");
    expect(await myToken.symbol()).to.be.eq("NAM");

     // Console log the contract address
     console.log("Contract deployed to:", await myToken.getAddress(), await myToken.name());
  });
});