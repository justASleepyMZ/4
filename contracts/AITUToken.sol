// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract AITUToken is ERC20 {
    address public owner;
    uint256 public tokenPrice;

    event TokensPurchased(address indexed buyer, uint256 amount, uint256 cost);
    event TokensSold(address indexed seller, uint256 amount, uint256 revenue);

    constructor() ERC20("AITUToken_SE2314", "AITU") {
        owner = msg.sender;
        tokenPrice = 0.00001 ether;
        _mint(msg.sender, 2000 * 10 ** decimals());
    }

    function buyTokens(uint256 amountToBuy) public payable {
        require(amountToBuy > 0, "Amount must be greater than zero");
        uint256 requiredETH = (amountToBuy * tokenPrice) / (10 ** decimals());
        require(msg.value >= requiredETH, "Not enough ETH sent");
        require(balanceOf(owner) >= amountToBuy, "Not enough tokens");

        _transfer(owner, msg.sender, amountToBuy);

        if (msg.value > requiredETH) {
            (bool success, ) = msg.sender.call{value: msg.value - requiredETH}("");
            require(success, "ETH refund failed");
        }

        emit TokensPurchased(msg.sender, amountToBuy, requiredETH);
    }

    function sellTokens(uint256 amountAITU) public {
        require(amountAITU > 0, "Amount must be greater than zero");
        require(balanceOf(msg.sender) >= amountAITU, "Not enough tokens");

        uint256 etherAmount = (amountAITU * tokenPrice) / (10 ** decimals());
        require(address(this).balance >= etherAmount, "Not enough ETH in contract");

        _transfer(msg.sender, owner, amountAITU);
        (bool success, ) = payable(msg.sender).call{value: etherAmount}("");
        require(success, "ETH transfer failed");

        emit TokensSold(msg.sender, amountAITU, etherAmount);
    }

    receive() external payable {}

    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
