// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract LendingPool {
    IERC20 public immutable token;

    mapping(address => uint256) public deposited;
    uint256 public totalDeposited;

    constructor(address token_) {
        token = IERC20(token_);
    }

    function deposit(uint256 amount) external {
        require(amount > 0, "amount=0");
        require(token.transferFrom(msg.sender, address(this), amount), "transferFrom failed");
        deposited[msg.sender] += amount;
        totalDeposited += amount;
    }

    function withdraw(uint256 amount) external {
        require(amount > 0, "amount=0");
        require(deposited[msg.sender] >= amount, "not enough");
        deposited[msg.sender] -= amount;
        totalDeposited -= amount;
        require(token.transfer(msg.sender, amount), "transfer failed");
    }
}
