# About

This is my testing/scafolding Solidity project to refresh my knowledge. The overall idea is very basic version of pump.fun:
- [Done] `MemeCoin.sol` defines the basic contract which can mint you some tokens. The price is defined by linear bonding curve. This is very simple contract, so it won't buy tokens back.
- [TODO] `AMM.sol` allows you to sell tokens to other people & buy from people or the contract itself.
- [TODO] `MemeCoinFactory.sol` this contract is supposed to use via UI to create meme coins. It also contains the list of created MemeCoins.

I also plan to write a simple UI on top of it with the following functionality:
- user can see the list of all available tokens requested from MemeCoinFactory
- user can go to each MemeCoin to see the details about this coin: current supply, price on bonding curve, number of accounts involved
- user can create his own MemeCoin
- user can buy/sell his memecoins on 
# Commands
`npx hardhat node` - run test node with wallets.


This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a Hardhat Ignition module that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat ignition deploy ./ignition/modules/Lock.ts
```
