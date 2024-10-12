// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MemeCoin is ERC20Capped {
    uint256 public constant MAX_SUPPLY = 1000000;
    uint256 public constant INITIAL_PRICE = 1 gwei;
    uint256 public constant FINAL_PRICE = 1000 gwei;
    uint256 public constant STEP = (FINAL_PRICE - INITIAL_PRICE) / MAX_SUPPLY;

    error NotEnoughAmountSent(uint256 transactionAmount, uint256 cointPrice);
    error ReimburseFailed();
    error InvalidAmount();

    uint256 public totalTokensSold = 0;

    constructor(
        string memory name,
        string memory symbol
    ) ERC20Capped(MAX_SUPPLY) ERC20(name, symbol) {}

    function mint(uint256 tokenAmount) external payable {
        require(
            tokenAmount > 0,
            "You need to send some amount to mint tokens."
        );
        require(
            tokenAmount + totalTokensSold <= MAX_SUPPLY,
            "You are trying to mint over the max supply"
        );
        uint256 currentPriceForGivenAmount = coinPrice(tokenAmount);
        require(
            msg.value >= currentPriceForGivenAmount,
            NotEnoughAmountSent({
                transactionAmount: msg.value,
                cointPrice: currentPriceForGivenAmount
            })
        );

        _mint(msg.sender, tokenAmount);
        totalTokensSold += tokenAmount;

        if (msg.value > currentPriceForGivenAmount) {
            (bool success, ) = payable(msg.sender).call{
                value: msg.value - currentPriceForGivenAmount
            }("");
            require(success, ReimburseFailed());
        }
    }

    function coinPrice(uint256 tokenAmount) public view returns (uint256) {
        require(
            tokenAmount + totalTokensSold <= MAX_SUPPLY,
            "the amount exceeds max supply"
        );
        // 45 gwei is average gas price
        // return STEP * tokenAmount;
        //TODO fix me
        return
            STEP *
            totalTokensSold *
            tokenAmount +
            ((tokenAmount * (tokenAmount + 1)) / 2) *
            STEP;
    }
}
